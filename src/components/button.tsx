import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

const BASE =
  "inline-flex items-center justify-center rounded-full font-humanist font-semibold transition-all whitespace-nowrap";

const SIZES = {
  md: "px-7 py-3.5 text-sm",
  sm: "px-5 py-2.5 text-xs",
} as const;

const VARIANTS = {
  solid: "bg-ac-maroon text-ac-on-maroon shadow-md hover:bg-ac-maroon-deep",
  inverse: "bg-ac-on-maroon text-ac-maroon shadow-lg hover:bg-white",
  outline:
    "bg-ac-surface-container-lowest text-ac-primary border border-ac-border-hairline hover:bg-ac-surface-container",
  "outline-inverse": "bg-white/10 text-ac-on-maroon border border-ac-on-maroon-line hover:bg-white/15",
} as const;

type Variant = keyof typeof VARIANTS;
type Size = keyof typeof SIZES;

type CommonProps = { variant?: Variant; size?: Size; className?: string };

type LinkButtonProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & { href: string };

type PlainButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & { href?: undefined };

export function Button(props: LinkButtonProps | PlainButtonProps) {
  const { variant = "solid", size = "md", className = "", ...rest } = props;
  const classes = `${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${className}`;

  if (rest.href) {
    const { href, ...linkRest } = rest as LinkButtonProps;
    return <Link href={href} className={classes} {...linkRest} />;
  }

  const buttonRest = rest as PlainButtonProps;
  return <button className={classes} {...buttonRest} />;
}
