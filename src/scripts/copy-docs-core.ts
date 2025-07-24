import { execSync } from 'child_process';
import { join } from 'path';
import { existsSync } from 'fs';
import type { DocsConfig } from '@fjell/docs-template';

interface CompileError extends Error {
  message: string;
}

export async function copyDocs(cwd?: string): Promise<void> {
  try {
    // Look for docs.config.ts in the current working directory
    const workingDir: string = cwd || process.cwd();
    const configPath: string = join(workingDir, 'docs.config.ts');

    if (!existsSync(configPath)) {
      console.error('Error: docs.config.ts not found in current directory');
      console.error('Please run this command from a directory containing docs.config.ts');
      process.exit(1);
    }

    console.log('Loading configuration from:', configPath);

    // Compile TypeScript config to JavaScript first
    const configJsPath: string = configPath.replace('.ts', '.js');
    console.log('Compiling TypeScript configuration...');

    try {
      execSync(`npx tsc ${configPath} --target es2022 --module esnext --moduleResolution bundler`, { cwd: workingDir });
    } catch (error) {
      const compileError = error as CompileError;
      console.error('Failed to compile TypeScript configuration:', compileError.message);
      process.exit(1);
    }

    // Import the compiled configuration with cache busting
    const configJsUrl: string = `file://${configJsPath}?${Date.now()}`;
    const { default: config }: { default: DocsConfig } = await import(configJsUrl);

    // Clean up the compiled JavaScript file
    try {
      execSync(`rm ${configJsPath}`, { cwd: workingDir });
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

      const command: string = `cp ${file.source} ${file.destination}`;
      console.log(`Executing: ${command}`);

      try {
        execSync(command, { cwd: workingDir });
      } catch (error) {
        const copyError = error as CompileError;
        console.error(`Failed to copy ${file.source} to ${file.destination}:`, copyError.message);
        process.exit(1);
      }
    }

    console.log('Documentation files copied successfully!');
  } catch (error) {
    const generalError = error as Error;
    console.error('Error copying documentation files:', generalError.message);
    process.exit(1);
  }
}
