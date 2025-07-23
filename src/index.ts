export { DocsApp } from './components/DocsApp'
export { Navigation } from './components/Navigation'
export { ContentRenderer } from './components/ContentRenderer'
export { Layout } from './components/Layout'

export {
  loadDocument,
  processContent,
  extractSection,
  extractMultipleSections,
  createGettingStartedContent
} from './utils/contentLoader'

export type {
  DocsConfig,
  DocsAppProps,
  DocumentSection,
  BrandingConfig,
  VersionConfig,
  VitePluginConfig
} from './types/index'

import { DocsApp } from './components/DocsApp'
import type { DocsConfig } from './types'

// Utility function to render the docs app
export const renderDocsApp = (config: DocsConfig) => {
  return DocsApp({ config })
}
