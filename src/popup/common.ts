import { useState, useEffect } from "react";
import {
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessage,
  Configuration,
  OpenAIApi,
} from "openai";

export const STORAGE_KEY_PREFX = "pasc4le-chatgpt-this-";
export const CONFIG_KEY = STORAGE_KEY_PREFX + "config";
export const DEFAULT_CONFIG: Config = {};
const BASE_CHAT_COMPLETION_OPTIONS = {
  model: "gpt-3.5-turbo",
};
const SYSTEM_PROMPT = `You will answer thoroughly to the following questions about this text: {content}\n\nTitle: {title}`;

export type Message =
  | {
    role: "assistant";
    loading: true;
  }
  | {
    role: "assistant";
    choices: string[];
    chosen: number;
    loading: false;
  }
  | {
    role: "system";
    content: string;
  }
  | {
    role: "user";
    content: string;
  };

export interface Config {
  apiKey?: string;
}

export const getConfig = async (): Promise<Config | undefined> => {
  const data = await chrome.storage.local.get([CONFIG_KEY]);
  return data[CONFIG_KEY];
};

export const setConfig = async (newConfig: Config) =>
  await chrome.storage.local.set({ [CONFIG_KEY]: newConfig });

export const resetConfig = async () => await setConfig(DEFAULT_CONFIG);

export const useConfig = () => {
  const [config, setConfig] = useState<Config | false>(false);

  useEffect(() => {
    (async () => {
      setConfig((await getConfig()) ?? DEFAULT_CONFIG);
    })();

    chrome.storage.onChanged.addListener((changes) => {
      if (CONFIG_KEY in changes) {
        setConfig(changes[CONFIG_KEY].newValue);
        console.log("new change", changes[CONFIG_KEY]);
      }
    });
  }, []);

  return config;
};

export interface PageInfo {
  entireText: string;
  url: string;
  title: string;
  selectedText?: string;
  articlesText?: string;
  sectionsText?: string;
}

export const useCurrentPageInfo = () => {
  const [pageInfo, setPageInfo] = useState<PageInfo | undefined>(undefined);

  useEffect(() => {
    const updateInfo = async (focusId: number | undefined = undefined) => {
      if (!focusId) {
        const [tab] = await chrome.tabs.query({
          active: true,
          lastFocusedWindow: true,
        });
        if (!tab?.id) throw Error("Couldn't retrieve Active Tab ID.");

        focusId = tab?.id;
      }

      setPageInfo(
        await chrome.tabs.sendMessage(focusId, {
          action: "getPageInfo",
        })
      );
    };

    updateInfo();

    chrome.tabs.onActivated.addListener((activeTab) => {
      console.log("Changed Tab");
      updateInfo(activeTab.tabId);
    });
  }, []);

  return pageInfo;
};

export const contentOrder: (keyof PageInfo)[] = [
  "selectedText",
  "articlesText",
  "sectionsText",
  "entireText",
];

const fillSystemPrompt = (pageInfo: PageInfo) => {
  let result = SYSTEM_PROMPT;

  for (let i = 0; i < contentOrder.length; i++)
    if (contentOrder[i] in pageInfo && pageInfo[contentOrder[i]] != "") {
      result = result.replace("{content}", pageInfo[contentOrder[i]] ?? "");
      break;
    }

  Object.entries(pageInfo).forEach(
    ([key, value]) => (result = result.replace(`{${key}}`, value))
  );

  return result;
};

export const useChatCompletion = (
  startingMessages: Message[] = []
): [Message[], (newMessage: string) => void] => {
  const config = useConfig();
  const pageInfo = useCurrentPageInfo();
  const [openai, setOpenai] = useState<OpenAIApi | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>(startingMessages);

  const initializeOpenAiApi = () => {
    console.log("config change", config);
    if (config === false) return;

    console.log(
      "Configuration Change Detected, initializing openaiConfig",
      config
    );
    const openaiConfig = new Configuration({
      apiKey: config.apiKey,
    });

    setOpenai(new OpenAIApi(openaiConfig));
  };

  useEffect(() => {
    initializeOpenAiApi();
  }, [config]);

  useEffect(() => {
    if (!pageInfo) return;

    if (messages.length === 0) {
      setMessages([
        {
          role: "system",
          content: fillSystemPrompt(pageInfo),
        },
      ]);
    }
  }, [pageInfo?.url]);

  const prepareMessages = (
    messages: Message[]
  ): ChatCompletionRequestMessage[] => {
    if (!messages) return [];

    return messages
      .filter((v) => !("loading" in v))
      .map((message) => {
        if (message?.role == "assistant")
          return {
            role: "assistant",
            content: message.loading
              ? "Loading..."
              : message.choices[message.chosen],
          };

        return message;
      });
  };

  const encodeResponse = (
    choices: { message?: ChatCompletionResponseMessage }[]
  ): Message => {
    return {
      role: "assistant",
      choices: choices.map((v) => v.message?.content ?? "Invalid Response."),
      chosen: 0,
      loading: false,
    };
  };

  const sendMessage = async (newMessageRaw: string) => {
    console.log("info", config, openai, pageInfo);
    if (!openai || !config || !pageInfo) return;

    const newMessage: Message = {
      role: "user",
      content: newMessageRaw,
    };

    setMessages((value) => {
      value.push(newMessage);
      value.push({
        role: "assistant",
        loading: true,
      });
      return [...value];
    });

    console.log("Sending Chat Completion ", {
      ...BASE_CHAT_COMPLETION_OPTIONS,
      messages: [...prepareMessages(messages), newMessage],
    });

    const completion = await openai
      .createChatCompletion({
        ...BASE_CHAT_COMPLETION_OPTIONS,
        messages: [...prepareMessages(messages), newMessage],
      })
      .then((r) => r.data)
      .catch((e) => console.error(e));

    console.log("Completion Response", completion);

    setMessages((value) => {
      if (completion && completion.choices) {
        value.pop();
        value.push(encodeResponse(completion.choices));
      }
      return [...value];
    });
  };

  return [messages, sendMessage];
};
