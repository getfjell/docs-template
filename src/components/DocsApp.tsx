import React, { useEffect, useState } from 'react'
import { DocsAppProps, DocumentSection } from '../types'
import { Navigation } from './Navigation'
import { ContentRenderer } from './ContentRenderer'
import { Layout } from './Layout'
import { loadDocument } from '../utils/contentLoader'
import '../styles/base.css'

export const DocsApp: React.FC<DocsAppProps> = ({ config }) => {
  const [currentSection, setCurrentSection] = useState(config.sections[0]?.id || 'overview')
  const [documents, setDocuments] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const [version, setVersion] = useState<string>('')

  useEffect(() => {
    const loadDocuments = async () => {
      const loadedDocs: { [key: string]: string } = {}

      // Load version
      if (config.version.source === 'manual' && config.version.value) {
        setVersion(config.version.value)
      } else if (config.version.source === 'env' && config.version.envVar) {
        setVersion(process.env[config.version.envVar] || 'dev')
      } else {
        // Default to trying to get from injected version
        setVersion((window as any).__APP_VERSION__ || '1.0.0')
      }

      for (const section of config.sections) {
        if (section.file) {
          try {
            const content = await loadDocument(section.file)

            // Apply custom content processing if defined
            const processedContent = config.customContent?.[section.id]
              ? config.customContent[section.id](content)
              : content

            loadedDocs[section.id] = processedContent
          } catch (error) {
            console.error(`Error loading ${section.file}:`, error)
            loadedDocs[section.id] = getDefaultContent(section)
          }
        } else {
          loadedDocs[section.id] = getDefaultContent(section)
        }
      }

      setDocuments(loadedDocs)
      setLoading(false)
    }

    loadDocuments()
  }, [config])

  const getDefaultContent = (section: DocumentSection): string => {
    return `# ${section.title}\n\n${section.subtitle}\n\nContent coming soon...`
  }

  const currentSectionData = config.sections.find(s => s.id === currentSection)
  const currentContent = documents[currentSection] || ''

  return (
    <Layout
      config={config}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      fullscreenImage={fullscreenImage}
      setFullscreenImage={setFullscreenImage}
    >
      <Navigation
        sections={config.sections}
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        projectName={config.projectName}
        version={version}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <ContentRenderer
        content={currentContent}
        sectionId={currentSection}
        sectionData={currentSectionData}
        loading={loading}
        config={config}
        onImageClick={setFullscreenImage}
      />
    </Layout>
  )
}
