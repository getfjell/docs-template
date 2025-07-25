import React, { useEffect, useState } from 'react'
import { DocsAppProps, DocumentSection } from '@/types'
import { Navigation } from './Navigation'
import { ContentRenderer } from './ContentRenderer'
import { Layout } from './Layout'
import { loadDocument } from '@/utils/contentLoader'
import '@/styles/base.css'

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

      // Set custom background image if provided
      if (config.branding.backgroundImage) {
        document.documentElement.style.setProperty(
          '--brand-background-image',
          `url('${config.branding.backgroundImage}')`
        )
      }

      // This block determines which version string to display in the docs UI.
      // It checks the config.version.source to decide where to get the version:
      // 1. If the source is 'manual' and a value is provided, use that value.
      // 2. If the source is 'env' and an environment variable name is provided, use the value of that environment variable (or 'dev' if not set).
      // 3. If the source is 'package.json', use the version injected at build time from the package.json file.
      // 4. Otherwise, fall back to a version injected at build time on the window object, or use '1.0.0' as a default.
      if (config.version.source === 'manual' && config.version.value) {
        setVersion(config.version.value)
      } else if (config.version.source === 'env' && config.version.envVar) {
        setVersion(process.env[config.version.envVar] || 'dev')
      } else if (config.version.source === 'package.json') {
        // Use the version injected at build time from package.json
        setVersion((window as any).__APP_VERSION__ || '1.0.0')
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
      version={version}
    >
      <Navigation
        sections={config.sections}
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
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
