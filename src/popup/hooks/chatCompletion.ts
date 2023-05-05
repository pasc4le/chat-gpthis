import {
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessage,
  Configuration,
  OpenAIApi,
} from 'openai';
import { STORAGE_KEY_PREFX } from 'popup/common';
import { PageInfo, useConfig, useCurrentPageInfo } from 'popup/hooks';
import { useEffect, useState } from 'react';

const BASE_CHAT_COMPLETION_OPTIONS = {
  model: 'gpt-3.5-turbo',
};
const SYSTEM_PROMPT = `You will answer thoroughly to the following questions about this text: {content}\n\nTitle: {title}`;

export type Message =
  | {
      role: 'assistant';
      loading: true;
    }
  | {
      role: 'assistant';
      choices: string[];
      chosen: number;
      loading: false;
    }
  | {
      role: 'system';
      content: string;
    }
  | {
      role: 'user';
      content: string;
    };

export const contentOrder: (keyof PageInfo)[] = [
  'selectedText',
  'articlesText',
  'sectionsText',
  'entireText',
];

export const fillSystemPrompt = (pageInfo: PageInfo) => {
  let result = SYSTEM_PROMPT;

  for (let i = 0; i < contentOrder.length; i++)
    if (contentOrder[i] in pageInfo && pageInfo[contentOrder[i]] != '') {
      result = result.replace('{content}', pageInfo[contentOrder[i]] ?? '');
      break;
    }

  Object.entries(pageInfo).forEach(
    ([key, value]) => (result = result.replace(`{${key}}`, value))
  );

  return result;
};

export const useChatCompletion = (
  startingMessages: Message[] = []
): [Message[], (newMessage: string) => void, () => void] => {
  const config = useConfig();
  const pageInfo = useCurrentPageInfo();
  const [openai, setOpenai] = useState<OpenAIApi | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>(startingMessages);

  const initializeOpenAiApi = () => {
    console.log('config change', config);
    if (config === false) return;

    console.log(
      'Configuration Change Detected, initializing openaiConfig',
      config
    );
    const openaiConfig = new Configuration({
      apiKey: config.apiKey,
    });

    setOpenai(new OpenAIApi(openaiConfig));
  };

  const resetMessages = () => {
    if (!pageInfo) return;

    setMessages([
      {
        role: 'system',
        content: fillSystemPrompt(pageInfo),
      },
    ]);
  };

  useEffect(() => {
    initializeOpenAiApi();
  }, [config]);

  useEffect(() => {
    if (!pageInfo) return;

    chrome.storage.local.set({ [STORAGE_KEY_PREFX + pageInfo.url]: messages });
  }, [messages]);

  useEffect(() => {
    if (!pageInfo) return;

    const key = STORAGE_KEY_PREFX + pageInfo.url;
    chrome.storage.local.get([key]).then((result) => {
      if (!(key in result)) resetMessages();
      else setMessages(result[key]);
    });
  }, [pageInfo?.url]);

  const prepareMessages = (
    messages: Message[]
  ): ChatCompletionRequestMessage[] => {
    if (!messages) return [];

    return messages
      .filter((v) => !('loading' in v))
      .map((message) => {
        if (message?.role == 'assistant')
          return {
            role: 'assistant',
            content: message.loading
              ? 'Loading...'
              : message.choices[message.chosen],
          };

        return message;
      });
  };

  const encodeResponse = (
    choices: { message?: ChatCompletionResponseMessage }[]
  ): Message => {
    return {
      role: 'assistant',
      choices: choices.map((v) => v.message?.content ?? 'Invalid Response.'),
      chosen: 0,
      loading: false,
    };
  };

  const sendMessage = async (newMessageRaw: string) => {
    if (!openai || !config || !pageInfo) return;

    const newMessage: Message = {
      role: 'user',
      content: newMessageRaw,
    };

    setMessages((value) => {
      value.push(newMessage);
      value.push({
        role: 'assistant',
        loading: true,
      });
      return [...value];
    });

    console.log('Sending Chat Completion ', {
      ...BASE_CHAT_COMPLETION_OPTIONS,
      messages: [...prepareMessages(messages), newMessage],
    });

    const completion = await openai
      .createChatCompletion({
        ...BASE_CHAT_COMPLETION_OPTIONS,
        messages: [...prepareMessages(messages), newMessage],
      })
      .then((r) => r.data)
      .catch((e) => ({
        choices: [
          {
            message: {
              role: 'assistant' as const,
              content: 'Error: ' + e.response.data.error.message,
            },
          },
        ],
      }));

    console.log('Completion Response', completion);

    setMessages((value) => {
      if (completion && completion.choices) {
        value.pop();
        value.push(encodeResponse(completion.choices));
      }
      return [...value];
    });
  };

  return [messages, sendMessage, resetMessages];
};
