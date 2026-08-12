import type { SVGProps } from "react";

/** Ortak çizgi ikon seti. Tümü 24×24, `currentColor` ile renklenir. */
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const TOOTH_PATH =
  "M12 4.2c-2 0-2.5-1.3-4.2-1.3C5.4 2.9 4 5 4 8.1c0 3 .9 4.7 1.5 7.5.4 2 .5 4 1.9 4 1.6 0 1.7-2.4 2.3-4.6.3-1.1.7-1.9 2.3-1.9s2 .8 2.3 1.9c.6 2.2.7 4.6 2.3 4.6 1.4 0 1.5-2 1.9-4 .6-2.8 1.5-4.5 1.5-7.5 0-3.1-1.4-5.2-3.8-5.2-1.7 0-2.2 1.3-4.2 1.3Z";

export const iconNames = [
  // tedavi ikonları
  "tooth",
  "implant",
  "braces",
  "crown",
  "smile",
  "veneer",
  "sparkle",
  "root",
  "filling",
  "inlay",
  "denture",
  "gum",
  "child",
  "surgery",
  "clean",
  "xray",
  // arayüz ikonları
  "phone",
  "whatsapp",
  "mail",
  "pin",
  "clock",
  "calendar",
  "instagram",
  "facebook",
  "arrowRight",
  "arrowUpRight",
  "check",
  "menu",
  "close",
  "chevronDown",
  "star",
  "shield",
  "heart",
  "users",
  "sterile",
  "parking",
] as const;

export type IconName = (typeof iconNames)[number];

export function Icon({
  name,
  ...props
}: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} aria-hidden="true" {...props}>
      {paths[name]}
    </svg>
  );
}

const paths: Record<IconName, React.ReactNode> = {
  tooth: <path d={TOOTH_PATH} />,
  implant: (
    <>
      <path d="M9 3.5h6l-.6 3.2H9.6L9 3.5Z" />
      <path d="M8.7 7.7h6.6" />
      <path d="M9.2 10.4h5.6" />
      <path d="M9.7 13.1h4.6" />
      <path d="M10.6 16h2.8l-1.4 4.6L10.6 16Z" />
    </>
  ),
  braces: (
    <>
      <path d="M3 8.5h18" />
      <rect x="5" y="10" width="4" height="5" rx="1.2" />
      <rect x="15" y="10" width="4" height="5" rx="1.2" />
      <path d="M9 12.5h6" />
      <path d="M3 17.5c2.6 1.6 5.6 2.4 9 2.4s6.4-.8 9-2.4" />
    </>
  ),
  crown: (
    <>
      <path d="M4.5 9.6 3 4.8l4 2.4L12 3l5 4.2 4-2.4-1.5 4.8H4.5Z" />
      <path d="M4.8 12.6h14.4" />
      <path d="M5.6 15.6h12.8" />
    </>
  ),
  smile: (
    <>
      <path d="M4 10.6c2.4-1.7 5.1-2.5 8-2.5s5.6.8 8 2.5c-1 5-4 7.5-8 7.5s-7-2.5-8-7.5Z" />
      <path d="M6.6 9.4v4.1M12 8.3v6.2M17.4 9.4v4.1" />
    </>
  ),
  veneer: (
    <>
      <path d="M7.5 4.5h9l-1 11.2c-.2 2.4-1.6 4-3.5 4s-3.3-1.6-3.5-4L7.5 4.5Z" />
      <path d="M10.5 7.4v9.4" />
      <path d="M13.7 7.4v7.6" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3.2 13.6 8 18 9.7 13.6 11.4 12 16.2 10.4 11.4 6 9.7 10.4 8 12 3.2Z" />
      <path d="M18.6 15.2l.7 2 1.9.7-1.9.7-.7 2-.7-2-1.9-.7 1.9-.7.7-2Z" />
      <path d="M5 14.4l.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4L3.1 16.3l1.4-.5.5-1.4Z" />
    </>
  ),
  root: (
    <>
      <path d={TOOTH_PATH} />
      <path d="M11.4 8.4c0 3.4-1.3 5.4-1.9 8.2" />
      <path d="M12.9 8.4c0 3.4 1.2 5.4 1.8 8.2" />
    </>
  ),
  filling: (
    <>
      <path d={TOOTH_PATH} />
      <path d="M9.4 8.2h5.2l-1 3.4H10.4l-1-3.4Z" fill="currentColor" opacity=".18" />
      <path d="M9.4 8.2h5.2l-1 3.4H10.4l-1-3.4Z" />
    </>
  ),
  inlay: (
    <>
      <rect x="3.6" y="6.4" width="16.8" height="11.2" rx="3.4" />
      <path d="M8.4 6.6v10.8" />
      <path d="M13.2 9.6h4.2v5.2h-4.2z" />
    </>
  ),
  denture: (
    <>
      <path d="M3.6 8.2c0-1.7 3.8-3 8.4-3s8.4 1.3 8.4 3c0 5.8-2.9 10.4-8.4 10.4S3.6 14 3.6 8.2Z" />
      <path d="M7 6.4v3.4M12 5.6v4.4M17 6.4v3.4" />
    </>
  ),
  gum: (
    <>
      <path d="M3.4 14.6c0-4.3 3.6-7.2 8.6-7.2s8.6 2.9 8.6 7.2c0 2.6-2.4 4.4-4.6 3.4-1.3-.6-1.5-2.2-4-2.2s-2.7 1.6-4 2.2c-2.2 1-4.6-.8-4.6-3.4Z" />
      <path d="M12 7.4V3.6" />
      <path d="M8.2 8.2 6.6 5.2M15.8 8.2l1.6-3" />
    </>
  ),
  child: (
    <>
      <circle cx="12" cy="6.6" r="3" />
      <path d="M6 20.4c0-3.6 2.7-6.2 6-6.2s6 2.6 6 6.2" />
      <path d="M9.8 17.6c1.4.9 3 .9 4.4 0" />
    </>
  ),
  surgery: (
    <>
      <path d="M3.4 20.6 12 12" />
      <path d="m13.4 10.6 4.3-4.3a3.4 3.4 0 0 1 4.7 0l-6.8 6.8-2.2-2.5Z" />
      <path d="M6.6 6.4 4 3.8" />
      <path d="M9.6 8.6 6.8 5.8" />
    </>
  ),
  clean: (
    <>
      <path d="M14.6 3.4 20.6 9.4" />
      <path d="m16.8 5.6-9.4 9.4-4 5.6 5.6-4 9.4-9.4" />
      <path d="M5.6 12.6 11.4 18.4" />
    </>
  ),
  xray: (
    <>
      <rect x="3.4" y="4.4" width="17.2" height="15.2" rx="2.6" />
      <path d="M8.4 4.6v14.8M15.6 4.6v14.8" />
      <path d="M3.6 12h16.8" />
    </>
  ),
  phone: (
    <path d="M6.2 3.6h3l1.5 3.8L8.9 8.6a11.6 11.6 0 0 0 6.5 6.5l1.2-1.8 3.8 1.5v3a2 2 0 0 1-2.2 2C10.6 18.9 5.1 13.4 4.2 5.8a2 2 0 0 1 2-2.2Z" />
  ),
  whatsapp: (
    <>
      <path d="M3.6 20.4 5 16.6a8.4 8.4 0 1 1 3.2 3l-4.6.8Z" />
      <path d="M9 9.2c0 3 2.4 5.4 5.4 5.4.6 0 1.2-.5 1.2-1.1l-1.6-.8-.9.9c-1-.5-1.9-1.4-2.4-2.4l.9-.9-.8-1.6c-.6 0-1.8.3-1.8 1.1" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.2" width="18" height="13.6" rx="2.4" />
      <path d="m3.6 7 7.3 5a2 2 0 0 0 2.2 0l7.3-5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21c4-4.2 6-7.4 6-10a6 6 0 1 0-12 0c0 2.6 2 5.8 6 10Z" />
      <circle cx="12" cy="10.8" r="2.3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7.2V12l3.2 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.4" y="5" width="17.2" height="15.4" rx="2.6" />
      <path d="M3.6 9.6h16.8M8.4 3.4v3.4M15.6 3.4v3.4" />
      <path d="M8 13.4h2.2M8 16.8h2.2M13.8 13.4H16M13.8 16.8H16" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <path d="M16.9 7.1h.01" />
    </>
  ),
  facebook: (
    <path d="M14.4 21v-7.6h2.5l.5-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.8-.1-1.6-.2-2.4-.2-2.4 0-4.1 1.5-4.1 4.2v2h-2.6v3h2.6V21" />
  ),
  arrowRight: (
    <>
      <path d="M4.5 12h15" />
      <path d="m13.6 6.2 5.9 5.8-5.9 5.8" />
    </>
  ),
  arrowUpRight: (
    <>
      <path d="M7 17 17 7" />
      <path d="M8.4 7H17v8.6" />
    </>
  ),
  check: <path d="m4.6 12.6 4.8 4.8L19.4 7.4" />,
  menu: <path d="M4 7.2h16M4 12h16M4 16.8h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  chevronDown: <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />,
  star: (
    <path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.6 9.7l5.8-.8L12 3.6Z" />
  ),
  shield: (
    <>
      <path d="M12 3.2 4.8 6v6.2c0 4 3 7.3 7.2 8.6 4.2-1.3 7.2-4.6 7.2-8.6V6L12 3.2Z" />
      <path d="m9 12.2 2.1 2.1 4-4" />
    </>
  ),
  heart: (
    <path d="M12 20.2c-6-3.7-8.4-6.9-8.4-10a4.6 4.6 0 0 1 8.4-2.6 4.6 4.6 0 0 1 8.4 2.6c0 3.1-2.4 6.3-8.4 10Z" />
  ),
  users: (
    <>
      <circle cx="9.2" cy="8" r="3.4" />
      <path d="M3 19.4c0-3.2 2.8-5.4 6.2-5.4s6.2 2.2 6.2 5.4" />
      <path d="M16 5.2a3.4 3.4 0 0 1 0 6.6" />
      <path d="M17.4 14.4c2.2.6 3.6 2.4 3.6 5" />
    </>
  ),
  sterile: (
    <>
      <path d="M12 3.4c1.4 2.6 1.4 5.2 0 7.8-1.4-2.6-1.4-5.2 0-7.8Z" />
      <path d="M5.4 15.2c2.4-1.5 4.9-2 7.6-1.3-2.3 1.6-4.8 2-7.6 1.3Z" />
      <path d="M18.6 15.2c-2.8.7-5.3.3-7.6-1.3 2.7-.7 5.2-.2 7.6 1.3Z" />
      <circle cx="12" cy="14.6" r="1.4" />
      <path d="M6.4 20.6h11.2" />
    </>
  ),
  parking: (
    <>
      <rect x="3.6" y="3.6" width="16.8" height="16.8" rx="4" />
      <path d="M9.6 17V7.4h3.2a2.9 2.9 0 0 1 0 5.8H9.6" />
    </>
  ),
};
