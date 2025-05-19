import React, { useMemo } from 'react';
import MarkdownItAsync from 'markdown-it-async';
import DOMPurify from 'dompurify';
import type { RichTextProps } from './interface';
import { DEFAULT_MARKDOWN_OPTIONS } from './helpers';

const md = MarkdownItAsync(DEFAULT_MARKDOWN_OPTIONS);

const RichText: React.FC<RichTextProps> = ({
  content,
  loading = false,
  loadingPlaceholder,
  markdownOptions,
  className = '',
  ...rest
}) => {
  const mergedOptions = useMemo(() => ({ ...md.options, ...markdownOptions }), [markdownOptions]);

  const htmlContent = useMemo(() => {
    if (loading) return '';
    try {
      const rendered = md.render(content);
      return DOMPurify.sanitize(rendered);
    } catch (error) {
      console.error('Markdown render error:', error);
      return content;
    }
  }, [content, loading, mergedOptions]);

  if (loading) {
    return loadingPlaceholder ? (
      <div className={className} {...rest}>
        {loadingPlaceholder}
      </div>
    ) : null;
  }

  return (
    <div
      className={`rich-text ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      {...rest}
    />
  );
};

export default RichText;
