import React, { useEffect } from "react";
import { useCurrentPageInfo } from "popup/common";
import { useState } from "react";

export function PageInfoPopup({ initState }: { initState?: boolean }) {
  const [isOpen, setOpen] = useState(initState);
  const pageInfo = useCurrentPageInfo();

  useEffect(() => {
    console.log("ciao2", pageInfo);
  }, [pageInfo]);

  return (
    <>
      {isOpen && (
        <div className="popup">
          {Object.entries(pageInfo ?? {}).map(([key, value]) => (
            <>
              <h3>{key.toLocaleUpperCase()}</h3>
              <p>{value}</p>
            </>
          ))}
        </div>
      )}
      <button onClick={() => setOpen((v) => !v)}>
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
    </>
  );
}

PageInfoPopup.defaultProps = {
  initState: false,
};
