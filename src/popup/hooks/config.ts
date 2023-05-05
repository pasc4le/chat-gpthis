import { STORAGE_KEY_PREFX } from 'popup/common';
import { useEffect, useState } from 'react';

export const CONFIG_KEY = STORAGE_KEY_PREFX + 'config';
export const DEFAULT_CONFIG: Config = {};

export interface Config {
  apiKey?: string;
  theme?: string;
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
        console.log('new change', changes[CONFIG_KEY]);
      }
    });
  }, []);

  return config;
};
