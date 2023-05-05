import React, { createContext, useEffect, useState } from 'react';
import { Settings } from 'popup/components/Settings';
import { Chat } from 'popup/components/Chat';
import { useConfig, useCurrentPageInfo } from 'popup/hooks';
import { PageInfo } from './components/PageInfo';
import { Error } from './components/Error';

export interface AppContext {
  view: string;
  goTo: ((newView: string) => void) &
    ((fn: (oldValue: string) => string) => void);
}
export const AppContext = createContext<AppContext>({
  view: 'auto',
  goTo: () => null,
});

export function App() {
  const [view, goTo] = useState('auto');
  const pageInfo = useCurrentPageInfo();
  const config = useConfig();

  useEffect(() => {
    if (!config) return;
    if (!config.theme) return;

    document.documentElement.setAttribute('data-theme', config.theme);
  }, [config]);

  useEffect(() => {
    console.log('---', pageInfo, config);
    if (pageInfo && pageInfo?.error) goTo('error');
  }, [pageInfo]);

  return (
    <AppContext.Provider value={{ view, goTo }}>
      {view == 'error' ? (
        <Error message="You cannot use the extension on this page." />
      ) : view == 'settings' ? (
        <Settings />
      ) : view === 'info' ? (
        <PageInfo />
      ) : config !== false && config?.apiKey ? (
        <Chat />
      ) : (
        config !== false && <Settings />
      )}
    </AppContext.Provider>
  );
}
