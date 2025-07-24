import { build } from 'esbuild';
import { createReactConfig } from '@fjell/eslint-config/esbuild/react';
import { createCliConfig } from '@fjell/eslint-config/esbuild/cli';
import { createLibraryConfig } from '@fjell/eslint-config/esbuild/library';
import { existsSync, readFileSync, writeFileSync } from 'fs';

// Copy CSS files to dist (custom logic preserved)
const copyCSS = () => {
  const cssFiles = ['src/styles/base.css', 'src/styles/themes.css'];
  let allCSS = '';

  cssFiles.forEach(file => {
    if (existsSync(file)) {
      const content = readFileSync(file, 'utf8');
      allCSS += content + '\n';
    }
  });

  writeFileSync('dist/index.css', allCSS);
  console.log('CSS files bundled to dist/index.css');
};

async function buildLib() {
  try {
    console.log('Building library...');

    // Use shared React config with custom overrides for docs template
    const config = createReactConfig({
      entryPoints: ['src/index.ts'],
      outdir: 'dist',
      loader: {
        '.png': 'file',
        '.jpg': 'file',
        '.jpeg': 'file',
        '.gif': 'file',
        '.svg': 'file'
      },
      splitting: false,
      tsconfig: './tsconfig.json',
      logLevel: 'info',
      metafile: true
    });

    // Build JavaScript
    const result = await build(config);

    // Copy and bundle CSS
    copyCSS();

    // Write metafile for analysis
    writeFileSync('dist/meta.json', JSON.stringify(result.metafile, null, 2));

    console.log('Library build completed successfully');
  } catch (error) {
    console.error('Library build failed:', error);
    process.exit(1);
  }
}

async function buildScripts() {
  try {
    console.log('Building scripts...');

    // Use shared CLI config for the scripts
    const config = createCliConfig({
      entryPoints: ['src/scripts/copy-docs.ts', 'src/scripts/copy-docs-core.ts'],
      outdir: 'dist/scripts',
      additionalExternals: ['@fjell/docs-template'],
      tsconfig: './tsconfig.json',
      logLevel: 'info'
    });

    await build(config);

    console.log('Scripts build completed successfully');
  } catch (error) {
    console.error('Scripts build failed:', error);
    process.exit(1);
  }
}

async function buildConfig() {
  try {
    console.log('Building config...');

    // Use shared library config for the config files
    const config = createLibraryConfig({
      entryPoints: ['src/config/index.ts'],
      outdir: 'dist/config',
      additionalExternals: ['vite', '@vitejs/plugin-react'],
      tsconfig: './tsconfig.json',
      logLevel: 'info'
    });

    await build(config);

    console.log('Config build completed successfully');
  } catch (error) {
    console.error('Config build failed:', error);
    process.exit(1);
  }
}

async function buildAll() {
  await buildLib();
  await buildScripts();
  await buildConfig();
}

buildAll();
