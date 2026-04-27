import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import Image, { type ImageProps } from "next/image";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="mt-10 mb-6 font-display text-4xl font-bold tracking-tight text-white">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 mb-4 font-display text-3xl font-semibold tracking-tight text-white">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 font-display text-2xl font-semibold text-white/90">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="my-5 text-lg leading-relaxed text-white/75">{children}</p>
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
      <ul className="my-5 list-disc space-y-2 pl-6 text-white/75">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="my-5 list-decimal space-y-2 pl-6 text-white/75">{children}</ol>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-accent-purple/60 bg-glass px-5 py-3 italic text-white/80">
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
