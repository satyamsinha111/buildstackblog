import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({
  content,
  className = "",
}: MarkdownContentProps) {
  return (
    <div
      className={`prose prose-lg dark:prose-invert article-body max-w-none ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: { className: ["heading-anchor"] },
            },
          ],
        ]}
        components={{
          a: ({ href, children, ...rest }) => {
            const isInternal =
              typeof href === "string" &&
              (href.startsWith("/") || href.startsWith("#"));
            return (
              <a
                href={href}
                {...(isInternal
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
                {...rest}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
