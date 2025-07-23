import React from 'react'
import ReactDOM from 'react-dom/client'
import { DocsApp } from '../../src/components/DocsApp'
import { DocsConfig } from '../../src/types'

const demoConfig: DocsConfig = {
  projectName: 'Fjell Demo',
  basePath: '/',
  port: 3000,
  branding: {
    theme: 'demo',
    tagline: 'Testing the Beautiful Animated Header Design',
    backgroundImage: '/pano.png', // Custom background image - can be overridden
    github: 'https://github.com/getfjell/docs-template',
    npm: 'https://www.npmjs.com/package/@fjell/docs-template'
  },
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      subtitle: 'Introduction to the template',
      file: '/demo-content/overview.md'
    },
    {
      id: 'features',
      title: 'Features',
      subtitle: 'Template capabilities',
      file: '/demo-content/features.md'
    },
    {
      id: 'styling',
      title: 'Styling',
      subtitle: 'Visual design elements',
      file: '/demo-content/styling.md'
    },
    {
      id: 'configuration',
      title: 'Configuration',
      subtitle: 'Setup and customization',
      file: '/demo-content/configuration.md'
    }
  ],
  version: {
    source: 'manual',
    value: '1.0.4'
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DocsApp config={demoConfig} />
  </React.StrictMode>
)
