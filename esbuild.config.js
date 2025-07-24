import { build } from 'esbuild'
import { existsSync, readFileSync, writeFileSync } from 'fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))

// Copy CSS files to dist
const copyCSS = () => {
  const cssFiles = ['src/styles/base.css', 'src/styles/themes.css']
  let allCSS = ''

  cssFiles.forEach(file => {
    if (existsSync(file)) {
      const content = readFileSync(file, 'utf8')
      allCSS += content + '\n'
    }
  })

  writeFileSync('dist/index.css', allCSS)
  console.log('CSS files bundled to dist/index.css')
}

const config = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  outdir: 'dist',
  format: 'esm',
  target: 'es2022',
  platform: 'neutral',
  sourcemap: true,
  minify: false,
  splitting: false,
  loader: {
    '.png': 'file',
    '.jpg': 'file',
    '.jpeg': 'file',
    '.gif': 'file',
    '.svg': 'file'
  },
  external: [
    'react',
    'react-dom',
    'react-markdown',
    'react-syntax-highlighter',
    'remark-gfm',
    ...Object.keys(pkg.peerDependencies || {}),
    ...Object.keys(pkg.dependencies || {})
  ],
  jsx: 'automatic',
  tsconfig: './tsconfig.json',
  logLevel: 'info',
  metafile: true
}

// Configuration for building scripts
const scriptsConfig = {
  entryPoints: ['src/scripts/copy-docs.ts', 'src/scripts/copy-docs-core.ts'],
  bundle: true,
  outdir: 'dist/scripts',
  format: 'esm',
  target: 'es2022',
  platform: 'node',
  sourcemap: true,
  minify: false,
  splitting: false,
  external: [
    '@fjell/docs-template'
  ],
  tsconfig: './tsconfig.json',
  logLevel: 'info',
  banner: {
    js: '#!/usr/bin/env node'
  }
}

// Configuration for building config
const configConfig = {
  entryPoints: ['src/config/index.ts'],
  bundle: true,
  outdir: 'dist/config',
  format: 'esm',
  target: 'es2022',
  platform: 'node',
  sourcemap: true,
  minify: false,
  splitting: false,
  external: [
    'vite',
    '@vitejs/plugin-react',
    ...Object.keys(pkg.peerDependencies || {}),
    ...Object.keys(pkg.dependencies || {})
  ],
  tsconfig: './tsconfig.json',
  logLevel: 'info'
}

async function buildLib() {
  try {
    console.log('Building library...')

    // Build JavaScript
    const result = await build(config)

    // Copy and bundle CSS
    copyCSS()

    // Write metafile for analysis
    writeFileSync('dist/meta.json', JSON.stringify(result.metafile, null, 2))

    console.log('Library build completed successfully')

  } catch (error) {
    console.error('Library build failed:', error)
    process.exit(1)
  }
}

async function buildScripts() {
  try {
    console.log('Building scripts...')

    await build(scriptsConfig)

    console.log('Scripts build completed successfully')

  } catch (error) {
    console.error('Scripts build failed:', error)
    process.exit(1)
  }
}

async function buildConfig() {
  try {
    console.log('Building config...')

    await build(configConfig)

    console.log('Config build completed successfully')

  } catch (error) {
    console.error('Config build failed:', error)
    process.exit(1)
  }
}

async function buildAll() {
  await buildLib()
  await buildScripts()
  await buildConfig()
}

buildAll()
