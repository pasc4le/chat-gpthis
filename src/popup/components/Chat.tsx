import { useChatCompletion } from 'popup/hooks';
import React, { useContext, useEffect, useRef } from 'react';
import { Message } from './Message';
import 'popup/style/Chat.css';
import { AppContext } from 'popup/App';

export function Chat() {
  const inputEl = useRef<HTMLInputElement>(null);
  const messagesContainer = useRef<HTMLDivElement>(null);
  const [messages, sendMessage, resetMessages] = useChatCompletion();
  const ctx = useContext(AppContext);

  useEffect(() => {
    scrollAllDown();
  }, [messages]);

  const scrollAllDown = () => {
    if (!messagesContainer.current) return;

    messagesContainer.current.scrollTo(
      0,
      messagesContainer.current.scrollHeight
    );
  };

  const sendCurrentMessage = () => {
    if (!inputEl.current) return;

    sendMessage(inputEl.current.value);

    inputEl.current.value = '';
  };

  return (
    <section id="chat" className="view">
      <div id="topbar">
        <h1>Chat</h1>
        <button onClick={() => resetMessages()}>
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
        <button onClick={() => ctx.goTo('settings')}>
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
            />
          </svg>
        </button>
        <button onClick={() => ctx.goTo('info')}>
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
        </button>
      </div>
      <div id="messages" ref={messagesContainer}>
        <span className="text-center mt-auto opacity-30">
          Powered by ChatGPT API
        </span>
        {messages.map((message, i) => (
          <Message key={message.role + i} message={message} index={i} />
        ))}
      </div>
      <div id="editor">
        <input
          type="text"
          placeholder="Send a message."
          ref={inputEl}
          onKeyDown={(e) => (e.key == 'Enter' ? sendCurrentMessage() : null)}
        />
        <button onClick={() => sendCurrentMessage()}>
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
