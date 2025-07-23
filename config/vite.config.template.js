import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, resolve } from 'fs'

export const createDocsViteConfig = (options = {}) => {
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

  return defineConfig({
    plugins: [react(), ...plugins],
    base: basePath,
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    server: {
      port
    },
    define: {
      __APP_VERSION__: JSON.stringify(version),
      ...defineVars
    }
  })
}
