import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { resolve } from 'path'

export const createDocsViteConfig = (options: {
  basePath?: string
  port?: number
  plugins?: any[]
  packageJsonPath?: string
  defineVars?: Record<string, any>
} = {}) => {
  const {
    basePath = '/',
    port = 3000,
    plugins = [],
    packageJsonPath = '../package.json',
    defineVars = {}
  } = options

  // Read version from package.json if available
  let version = '1.0.0'
  try {
    const packageJson = JSON.parse(
      readFileSync(resolve(process.cwd(), packageJsonPath), 'utf-8')
    )
    version = packageJson.version
  } catch {
    console.warn('Could not read package.json for version, using default')
  }

  // Plugin to inject version into HTML for deployment scenarios
  const versionInjectionPlugin = () => {
    return {
      name: 'version-injection',
      transformIndexHtml(html: string) {
        return html.replace(
          '<head>',
          `<head>
  <script>window.__APP_VERSION__ = "${version}";</script>`
        )
      }
    }
  }

  return defineConfig({
    plugins: [react(), versionInjectionPlugin(), ...plugins],
    base: basePath,
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      assetsDir: '', // Keep assets in root instead of assets/ subdirectory
    },
    server: {
      port
    },
    define: {
      // Inject the version at build time so it's available in the deployed static files
      // This is used by DocsApp when config.version.source is 'package.json'
      __APP_VERSION__: JSON.stringify(version),
      ...defineVars
    }
  })
}
