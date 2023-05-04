import { setConfig } from "popup/common";
import React, { useRef } from "react";

export interface IntroProps { }

export function Intro({ }: IntroProps) {
  const inputEl = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    setConfig({
      apiKey: inputEl.current?.value,
    });
  };

  return (
    <>
      <p>
        Before starting to use this extension, you need to
        <a href="https://platform.openai.com/account/api-keys">
          generate an OpenAI API Secret Key
        </a>
      </p>
      <input type="text" placeholder="OpenAI Secret Key" ref={inputEl} />
      <input type="submit" value="Submit" onClick={handleSubmit} />
    </>
  );
}
