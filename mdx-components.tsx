import type { MDXComponents } from "mdx/types";
import { Children, isValidElement, type ReactNode } from "react";
import Link from "next/link";
import Image, { type ImageProps } from "next/image";
import { slugifyHeading } from "@/lib/utils";

function getTextContent(value: ReactNode): string {
  return Children.toArray(value)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return String(child);
      if (isValidElement<{ children?: ReactNode }>(child)) return getTextContent(child.props.children);
      return "";
    })
    .join("");
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return getMDXComponents(components);
}

export function getMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="mt-10 mb-6 font-display text-4xl font-bold tracking-tight text-white">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        id={slugifyHeading(getTextContent(children))}
        className="font-display text-2xl font-semibold leading-snug tracking-tight text-white sm:text-3xl"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-xl font-semibold leading-snug text-white/90 sm:text-2xl">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-mono text-sm font-semibold uppercase tracking-[0.12em] text-accent-cyan/90">
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className="text-lg leading-[1.95] text-white/75">{children}</p>
    ),
    a: ({ href, children }) => (
      <Link
        href={href ?? "#"}
        className="text-accent-cyan underline-offset-4 hover:underline"
      >
        {children}
      </Link>
    ),
    ul: ({ children }) => (
      <ul className="text-white/75">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="my-6 list-decimal space-y-2 ps-6 text-white/75">{children}</ol>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-7 rounded-e-2xl border-e-2 border-accent-cyan/70 bg-white/[0.035] px-5 py-4 italic leading-relaxed text-white/80 shadow-[0_15px_50px_-35px_rgba(6,182,212,0.65)]">
        {children}
      </blockquote>
    ),
    code: ({ children, ...props }) => (
      <code
        className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[0.9em] text-accent-cyan"
        {...props}
      >
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="my-6 overflow-x-auto rounded-2xl border border-white/10 bg-black/60 p-5 text-sm leading-relaxed shadow-glass backdrop-blur-md">
        {children}
      </pre>
    ),
    img: (props) => (
      <Image
        {...(props as ImageProps)}
        width={1200}
        height={630}
        alt={props.alt ?? ""}
        className="my-8 rounded-2xl border border-white/10"
      />
    ),
    ...components,
  };
}
