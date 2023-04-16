"use client"

import * as React from "react"
import Image from "next/image"
import { ClipboardIcon } from "@heroicons/react/24/outline"
import { useMDXComponent } from "next-contentlayer/hooks"

import { cn } from "@/lib/utils"
import { Callout } from "@/components/callout"
import { Card } from "@/components/card"

const components = {
  h1: ({ className, ...props }) => (
    <h1
      className={cn(
        "mt-2 scroll-m-20 text-4xl font-bold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        "mt-10 scroll-m-20 border-b border-b-slate-200 pb-1 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4
      className={cn(
        "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }) => (
    <h5
      className={cn(
        "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }) => (
    <h6
      className={cn(
        "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn(
        "font-medium text-slate-900 underline underline-offset-4",
        className
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "mt-6 border-l-2 border-slate-300 pl-6 italic text-slate-800 [&>*]:text-slate-600",
        className
      )}
      {...props}
    />
  ),
  img: ({
    className,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={cn("rounded-md border border-slate-200", className)}
      alt={alt}
      {...props}
    />
  ),
  hr: ({ ...props }) => (
    <hr className="my-4 border-slate-200 md:my-8" {...props} />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn(
        "m-0 border-t border-slate-300 p-0 even:bg-slate-100",
        className
      )}
      {...props}
    />
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn(
        "border border-slate-200 px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn(
        "border border-slate-200 px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <div className="flex flex-col">
      <div className="flex items-center space-x-1 justify-end -my-5 mr-1">
        <CopyCodeButton onCopy={() => copyCodeContent(props.children)} />
      </div>
      <pre
        className={cn(
          "mt-6 mb-4 overflow-x-auto rounded-lg bg-slate-900 py-4",
          className
        )}
        {...props}
      />
    </div>
  ),
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "relative rounded border bg-slate-300/25 py-[0.2rem] px-[0.3rem] font-mono text-sm text-slate-600",
        className
      )}
      {...props}
    />
  ),
  Image,
  Callout,
  Card,
}

const getContentFromChildren = (children) => {
  if (Array.isArray(children)) {
    return children.map(getContentFromChildren).join("")
  } else if (typeof children === "string") {
    return children
  } else if (children && children.props && children.props.children) {
    return getContentFromChildren(children.props.children)
  }
  return ""
}

const copyCodeToClipboard = async (content) => {
  try {
    await navigator.clipboard.writeText(content)
    console.log("Code copied to clipboard")
  } catch (err) {
    console.error("Failed to copy code to clipboard", err)
  }
}

const copyCodeContent = (children) => {
  const content = getContentFromChildren(children)
  copyCodeToClipboard(content)
}

interface CopyCodeButtonProps {
  onCopy: () => Promise<void>
}

const CopyCodeButton: React.FC<CopyCodeButtonProps> = ({ onCopy }) => {
  const [isCopied, setIsCopied] = React.useState(false)

  const handleCopyClick = async () => {
    await onCopy()
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return (
    <div
      className="cursor-pointer hover:text-gray-900 flex transition-color duration-200"
      onClick={handleCopyClick}
    >
      <ClipboardIcon className="h-4 w-5" />
      <span className="text-xs">{isCopied ? "Copied!" : "Copy code"}</span>
    </div>
  )
}

interface MdxProps {
  code: string
}

export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code)

  return (
    <div className="mdx">
      <Component components={components} />
    </div>
  )
}