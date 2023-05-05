import { useEffect, useState } from 'react';

export interface PageInfo {
  entireText: string;
  url: string;
  title: string;
  selectedText?: string;
  articlesText?: string;
  sectionsText?: string;
  error?: string;
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

      const pageInfo = await chrome.tabs
        .sendMessage(focusId, {
          action: 'getPageInfo',
        })
        .then((r) => r)
        .catch((e) => ({
          entireText: '',
          url: 'about:internal',
          title: '',
          error: 'Error: ' + JSON.stringify(e),
        }));

      setPageInfo(pageInfo);
    };

    updateInfo();

    chrome.tabs.onActivated.addListener((activeTab) => {
      console.log('Changed Tab');
      updateInfo(activeTab.tabId);
    });
  }, []);

  return pageInfo;
};
