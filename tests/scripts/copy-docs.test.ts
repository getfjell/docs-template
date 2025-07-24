import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { copyDocs } from '../../src/scripts/copy-docs-core';

const TEST_DIR = path.join(__dirname, 'test-project-dir-for-copy-docs');

describe('copy-docs script', () => {
  const originalProcessExit = process.exit;
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;

  beforeEach(() => {
    process.exit = vi.fn() as any;
    console.log = vi.fn();
    console.error = vi.fn();

    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(TEST_DIR, { recursive: true });
    fs.mkdirSync(path.join(TEST_DIR, 'docs'));
  });

  afterEach(() => {
    process.exit = originalProcessExit;
    console.log = originalConsoleLog;
    console.error = originalConsoleError;

    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
    vi.clearAllMocks();
  });

  const createTestFile = (name: string, content: string) => {
    fs.writeFileSync(path.join(TEST_DIR, name), content);
  };

  const createDocsConfig = (filesToCopy: any) => {
    const configContent = `export default ${JSON.stringify({ filesToCopy }, null, 2)};`;
    createTestFile('docs.config.ts', configContent);
  };

  test('successfully copies documentation files', async () => {
    createTestFile('README.md', 'Test README content');
    createTestFile('API.md', 'Test API content');
    createDocsConfig([
      { source: 'README.md', destination: 'docs/README.md' },
      { source: 'API.md', destination: 'docs/API.md' },
    ]);

    await copyDocs(TEST_DIR);

    const readmeContent = fs.readFileSync(path.join(TEST_DIR, 'docs/README.md'), 'utf-8');
    expect(readmeContent).toBe('Test README content');

    const apiContent = fs.readFileSync(path.join(TEST_DIR, 'docs/API.md'), 'utf-8');
    expect(apiContent).toBe('Test API content');

    expect(fs.existsSync(path.join(TEST_DIR, 'docs.config.js'))).toBe(false);
    expect(console.log).toHaveBeenCalledWith('Documentation files copied successfully!');
    expect(process.exit).not.toHaveBeenCalled();
  });

  test('exits with error if docs.config.ts is not found', async () => {
    await copyDocs(TEST_DIR);
    expect(console.error).toHaveBeenCalledWith('Error: docs.config.ts not found in current directory');
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
