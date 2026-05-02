import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant =
  | "primary"
  | "primary-lg"
  | "secondary"
  | "phone"
  | "white"
  | "ghost-dark";

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

const baseClasses: Record<Variant, string> = {
  primary:
    "inline-flex items-center gap-2 bg-teal text-white text-[15px] font-bold px-[22px] py-[10px] rounded-[9px] border-0 transition hover:brightness-110 hover:-translate-y-px active:translate-y-0 whitespace-nowrap min-h-[44px]",
  "primary-lg":
    "inline-flex items-center gap-2 bg-teal text-white text-[17px] font-bold px-[34px] py-[16px] rounded-[11px] border-0 transition hover:brightness-110 hover:-translate-y-px active:translate-y-0 whitespace-nowrap min-h-[44px]",
  secondary:
    "inline-flex items-center gap-2 bg-transparent text-navy text-[15px] font-bold px-[22px] py-[10px] rounded-[9px] border-2 border-navy transition hover:bg-navy hover:text-white min-h-[44px]",
  phone:
    "inline-flex items-center gap-[7px] text-navy text-[15px] font-bold px-[14px] py-[8px] rounded-[8px] border-2 border-navy transition hover:bg-navy hover:text-white min-h-[44px]",
  white:
    "inline-flex items-center gap-2 bg-white text-teal text-[16px] font-extrabold px-7 py-[14px] rounded-[10px] border-0 transition hover:-translate-y-0.5 min-h-[44px]",
  "ghost-dark":
    "inline-flex items-center gap-2 text-white/85 text-[16px] font-semibold px-[22px] py-[14px] rounded-[11px] border-2 border-white/20 transition hover:border-white/50 hover:text-white min-h-[44px]",
};

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;
type AnchorProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button className={`${baseClasses[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...rest
}: AnchorProps) {
  return (
    <a className={`${baseClasses[variant]} ${className}`} {...rest}>
      {children}
    </a>
  );
}
