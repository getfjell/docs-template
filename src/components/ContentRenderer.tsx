import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import { DocsConfig, DocumentSection } from '@/types'

interface ContentRendererProps {
  content: string
  sectionId: string
  sectionData?: DocumentSection
  loading: boolean
  config: DocsConfig
  onImageClick: (imageUrl: string) => void
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({
  content,
  sectionData,
  loading,
  config,
  onImageClick
}) => {
  if (loading) {
    return (
      <main className="main-content">
        <div className="content">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading documentation...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="main-content">
      <div className="content">
        <div className="content-header">
          {sectionData && (
            <>
              <div className="breadcrumb">
                <span className="breadcrumb-project">{config.projectName}</span>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-section">{sectionData.title}</span>
              </div>
              <h1 className="page-title">{sectionData.title}</h1>
              <p className="page-subtitle">{sectionData.subtitle}</p>
            </>
          )}
        </div>

        <div className="markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({inline, className, children, ...props}: any) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                                     <SyntaxHighlighter
                     style={oneLight as any}
                     language={match[1]}
                     PreTag="div"
                     {...props}
                   >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              },
              img({src, alt, ...props}) {
                // Handle relative image paths
                const imageSrc = src?.startsWith('/') ? src : `${config.basePath}${src || ''}`

                return (
                  <img
                    src={imageSrc}
                    alt={alt || ''}
                    {...props}
                    onClick={() => onImageClick(imageSrc)}
                    style={{ cursor: 'pointer' }}
                    title="Click to view fullscreen"
                  />
                )
              },
              a({href, children, ...props}) {
                // Handle relative links
                const isExternal = href?.startsWith('http') || href?.startsWith('//')

                const linkProps = {
                  href,
                  ...props,
                  ...(isExternal && {
                    target: '_blank',
                    rel: 'noopener noreferrer'
                  })
                }

                return (
                  <a {...linkProps}>
                    {children}
                  </a>
                )
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </main>
  )
}
