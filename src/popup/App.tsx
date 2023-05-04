import React, { createContext, useEffect, useState } from "react";
import { Settings } from "popup/components/Settings";
import { Chat } from "popup/components/Chat";
import { useConfig } from "popup/hooks";
import { PageInfo } from "./components/PageInfo";

export interface AppContext {
  view: string;
  goTo: ((newView: string) => void) &
  ((fn: (oldValue: string) => string) => void);
}
export const AppContext = createContext<AppContext>({
  view: "auto",
  goTo: () => null,
});

export function App() {
  const [view, goTo] = useState("auto");
  const config = useConfig();

  useEffect(() => {
    if (!config) return;
    if (!config.theme) return;

    document.documentElement.setAttribute("data-theme", config.theme);
  }, [config]);

  useEffect(() => {
    console.log("View Update", view);
  }, [view]);

  return (
    <AppContext.Provider value={{ view, goTo }}>
      {view == "settings" ? (
        <Settings />
      ) : view === "info" ? (
        <PageInfo />
      ) : config !== false && config?.apiKey ? (
        <Chat />
      ) : (
        config !== false && <Settings />
      )}
    </AppContext.Provider>
  );
}
