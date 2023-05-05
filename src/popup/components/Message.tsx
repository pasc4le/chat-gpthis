import React from 'react';
import clsx from 'clsx';
import {
  contentOrder,
  Message as MessageType,
  PageInfo,
  useCurrentPageInfo,
} from 'popup/hooks';

const getInfoSource = (pageInfo: PageInfo | undefined) => {
  if (!pageInfo) return;

  for (let i = 0; i < contentOrder.length; i++)
    if (contentOrder[i] in pageInfo && pageInfo[contentOrder[i]] != '')
      return contentOrder[i];
};

const getInfoSourceMessage = (
  infoSource: (typeof contentOrder)[number] | undefined
) => {
  switch (infoSource) {
    case 'entireText':
      return 'You are chatting about the entire text of the page.';
    case 'sectionsText':
      return 'You are chatting about the section elements of the page';
    case 'articlesText':
      return 'You are chatting about the article elements of the page';
    case 'selectedText':
      return 'You are chatting about the selected text.';
    default:
      return 'Loading...';
  }
};

export function Message({
  message,
  index,
}: {
  message: MessageType;
  index?: number;
}) {
  const pageInfo = useCurrentPageInfo();

  if (message.role == 'system' && index == 0)
    return (
      <div className={clsx(message.role, 'message')}>
        {pageInfo && getInfoSourceMessage(getInfoSource(pageInfo))}
      </div>
    );

  return (
    <div
      className={clsx(
        message.role == 'assistant' && message.loading && 'loading',
        message.role,
        'message'
      )}
    >
      {message.role == 'assistant' && message.loading ? (
        <progress />
      ) : message.role == 'assistant' ? (
        message.choices[message.chosen]
      ) : (
        message.content
      )}
    </div>
  );
}

Message.defaultProps = {
  index: -1,
};
