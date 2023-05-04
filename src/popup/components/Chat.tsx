import { resetConfig, useChatCompletion } from "popup/common";
import React, { useEffect, useRef } from "react";
import { PageInfoPopup } from "./PageInfoPopup";
import { Message } from "./Message";
import "popup/style/Chat.css";

export function Chat() {
  const inputEl = useRef<HTMLInputElement>(null);
  const [messages, sendMessage] = useChatCompletion();

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  const sendCurrentMessage = () => {
    if (!inputEl.current) return;

    sendMessage(inputEl.current.value);
  };

  return (
    <section id="chat">
      <div id="topbar">
        <h1>ChatGPT</h1>
        <button onClick={() => resetConfig()}>
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
        <PageInfoPopup />
      </div>
      <div id="messages">
        {messages.map((message, i) => (
          <Message key={message.role + i} message={message} index={i} />
        ))}
      </div>
      <div id="editor">
        <input
          type="text"
          placeholder="Send a message."
          ref={inputEl}
          onKeyDown={(e) => (e.key == "Enter" ? sendCurrentMessage() : null)}
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
