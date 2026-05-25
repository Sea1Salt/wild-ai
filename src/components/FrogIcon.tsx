import type { SVGProps } from "react";

export function FrogIcon({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.5 9.2c.3-2 1.7-3.4 3.5-3.4.8 0 1.5.2 2 .7.5-.5 1.2-.7 2-.7 1.8 0 3.2 1.4 3.5 3.4 1.4.7 2.3 2.1 2.3 3.8 0 3-2.7 5.2-7.8 5.2S4.2 16 4.2 13c0-1.7.9-3.1 2.3-3.8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M8.4 9.3h.01M15.6 9.3h.01M9 13.7c1.6 1.1 4.4 1.1 6 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
