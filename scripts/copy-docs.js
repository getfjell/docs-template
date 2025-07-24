#!/usr/bin/env node

import { execSync } from 'child_process';
import { join } from 'path';
import { existsSync } from 'fs';

async function copyDocs() {
  try {
    // Look for docs.config.ts in the current working directory
    const cwd = process.cwd();
    const configPath = join(cwd, 'docs.config.ts');

    if (!existsSync(configPath)) {
      console.error('Error: docs.config.ts not found in current directory');
      console.error('Please run this command from a directory containing docs.config.ts');
      process.exit(1);
    }

    console.log('Loading configuration from:', configPath);

    // Compile TypeScript config to JavaScript first
    const configJsPath = configPath.replace('.ts', '.js');
    console.log('Compiling TypeScript configuration...');

    try {
      execSync(`npx tsc ${configPath} --target es2022 --module esnext --moduleResolution bundler`, { cwd });
    } catch (error) {
      console.error('Failed to compile TypeScript configuration:', error.message);
      process.exit(1);
    }

    // Import the compiled configuration with cache busting
    const configJsUrl = `file://${configJsPath}?${Date.now()}`;
    const { default: config } = await import(configJsUrl);

    // Clean up the compiled JavaScript file
    try {
      execSync(`rm ${configJsPath}`, { cwd });
    } catch {
      // Ignore cleanup errors
    }

    if (!config.filesToCopy || !Array.isArray(config.filesToCopy)) {
      console.error('Error: No filesToCopy configuration found in docs.config.ts');
      console.error('Please add a filesToCopy array to your configuration');
      process.exit(1);
    }

    console.log('Copying documentation files...');

    // Perform each copy operation
    for (const file of config.filesToCopy) {
      if (!file.source || !file.destination) {
        console.warn('Skipping invalid file configuration:', file);
        continue;
      }

      const command = `cp ${file.source} ${file.destination}`;
      console.log(`Executing: ${command}`);

      try {
        execSync(command, { cwd });
      } catch (error) {
        console.error(`Failed to copy ${file.source} to ${file.destination}:`, error.message);
        process.exit(1);
      }
    }

    console.log('Documentation files copied successfully!');
  } catch (error) {
    console.error('Error copying documentation files:', error.message);
    process.exit(1);
  }
}

copyDocs();
