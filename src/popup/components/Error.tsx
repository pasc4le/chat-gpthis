import React from 'react';

export function Error({ message }: { message: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-20 w-20 drop-shadow-lg"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
      <h2 className="text-lg font-semibold">Error!</h2>
      <p className="w-10/12 font-light text-center">{message}</p>
    </div>
  );
}
