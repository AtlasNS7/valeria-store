import type { SVGProps } from "react";

export function LogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M45,45 L100,145 L155,45"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <ellipse
        cx="88"
        cy="150"
        rx="13"
        ry="7"
        transform="rotate(-32 88 150)"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <ellipse
        cx="112"
        cy="150"
        rx="13"
        ry="7"
        transform="rotate(32 112 150)"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <circle cx="100" cy="150" r="4" fill="currentColor" />
      <line x1="100" y1="154" x2="101" y2="163" stroke="currentColor" strokeWidth="2" />
      <rect
        x="93"
        y="163"
        width="16"
        height="16"
        rx="2"
        transform="rotate(45 101 171)"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />
      <circle cx="101" cy="171" r="2" fill="currentColor" />
      <path d="M78,58 L86,42 L100,54 L114,42 L122,58 Z" fill="currentColor" />
    </svg>
  );
}
