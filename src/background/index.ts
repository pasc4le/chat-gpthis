import { PageInfo } from 'popup/hooks';

/* From: https://stackoverflow.com/questions/5379120/get-the-highlighted-selected-text + Types */
function getSelectionText() {
  let text: undefined | string;
  var activeEl = document.activeElement;
  var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
  if (
    activeElTagName == 'textarea' ||
    (activeElTagName == 'input' &&
      /^(?:text|search|password|tel|url)$/i.test(
        (activeEl as HTMLInputElement).type
      ) &&
      typeof (activeEl as HTMLInputElement).selectionStart == 'number')
  ) {
    text = (activeEl as HTMLInputElement | HTMLTextAreaElement).value.slice(
      (activeEl as HTMLInputElement | HTMLTextAreaElement)?.selectionStart ?? 0,
      (activeEl as HTMLInputElement | HTMLTextAreaElement)?.selectionEnd ?? 0
    );
  } else if (window.getSelection) {
    const sel = window.getSelection();
    text = sel ? sel.toString() : undefined;
  }
  return text;
}
/* End Paste */

chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  if (!request.action) return;

  switch (request.action) {
    case 'getPageInfo':
      const pageInfo: PageInfo = {
        url: document.location.href,
        entireText: document.body.innerText,
        title: document.title,
        selectedText: getSelectionText(),
      };

      const articleEls = Array.from(document.querySelectorAll('article'));

      articleEls.forEach((el, l, array) => {
        for (let i = 0; i < l; i++) if (array[i].contains(el)) return;

        if (!pageInfo.articlesText) pageInfo.articlesText = el.innerText;
        else pageInfo.articlesText += '\n\n' + el.innerText;
      });

      const sectionEls = document.querySelectorAll('section');

      sectionEls.forEach((el, l, array) => {
        for (let i = 0; i < l; i++) if (array[i].contains(el)) return;

        if (!pageInfo.sectionsText) pageInfo.sectionsText = el.innerText;
        else pageInfo.sectionsText += '\n\n' + el.innerText;
      });

      sendResponse(pageInfo);
      break;
    default:
      console.error('Invalid Action Received: ', request);
  }
});
