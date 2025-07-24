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
  console.log('✅ CSS files bundled to dist/index.css')
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

async function buildLib() {
  try {
    console.log('Building library...')
    
    // Build JavaScript
    const result = await build(config)
    
    // Copy and bundle CSS
    copyCSS()
    
    // Write metafile for analysis
    writeFileSync('dist/meta.json', JSON.stringify(result.metafile, null, 2))
    
    console.log('✅ Build completed successfully')
    
  } catch (error) {
    console.error('❌ Build failed:', error)
    process.exit(1)
  }
}

buildLib()
