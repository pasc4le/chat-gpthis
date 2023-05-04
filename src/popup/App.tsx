import React from "react";
import { useConfig } from "./common";
import { Intro } from "./components/Intro";
import { Chat } from "./components/Chat";

export function App() {
  const config = useConfig();

  return (
    <>
      {config !== false && config?.apiKey ? (
        <Chat />
      ) : (
        config !== false && <Intro />
      )}
    </>
  );
}
