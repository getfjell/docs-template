import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  loadDocument,
  processContent,
  extractSection,
  extractMultipleSections,
  createGettingStartedContent
} from '../../src/utils/contentLoader'

// Mock fetch for loadDocument tests
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('contentLoader', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('loadDocument', () => {
    it('should successfully fetch and return document content', async () => {
      const mockContent = 'This is test content'
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockContent)
      })

      const result = await loadDocument('https://example.com/doc.md')

      expect(mockFetch).toHaveBeenCalledWith('https://example.com/doc.md')
      expect(result).toBe(mockContent)
    })

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      await expect(loadDocument('https://example.com/notfound.md'))
        .rejects.toThrow('Failed to fetch https://example.com/notfound.md: 404')
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(loadDocument('https://example.com/doc.md'))
        .rejects.toThrow('Network error')
    })
  })

  describe('processContent', () => {
    it('should return content unchanged', () => {
      const content = 'This is some content with **markdown**'
      const result = processContent(content)
      expect(result).toBe(content)
    })

    it('should handle empty content', () => {
      const result = processContent('')
      expect(result).toBe('')
    })

    it('should handle multiline content', () => {
      const content = `# Title

Some content here
- List item 1
- List item 2`
      const result = processContent(content)
      expect(result).toBe(content)
    })
  })

  describe('extractSection', () => {
    const sampleContent = `# Main Title

This is intro content.

## Installation

To install the package:
npm install package-name

## Basic Usage

Here's how to use it:
const pkg = require('package-name')

## Configuration

Configure the package like this:
const config = { option: 'value' }

## Advanced Features

More advanced features here.`

    it('should extract a section by title', () => {
      const result = extractSection(sampleContent, 'Installation')

      expect(result).toContain('## Installation')
      expect(result).toContain('npm install package-name')
      expect(result).not.toContain('## Basic Usage')
    })

    it('should extract section with case insensitive matching', () => {
      const result = extractSection(sampleContent, 'installation')

      expect(result).toContain('## Installation')
      expect(result).toContain('npm install package-name')
    })

    it('should return original content when section not found', () => {
      const result = extractSection(sampleContent, 'Nonexistent Section')
      expect(result).toBe(sampleContent)
    })

    it('should handle empty content', () => {
      const result = extractSection('', 'Installation')
      expect(result).toBe('')
    })
  })

  describe('extractMultipleSections', () => {
    const sampleContent = `# Main Title

This is intro content.

## Installation

To install the package:
npm install package-name

## Basic Usage

Here's how to use it:
const pkg = require('package-name')

## Configuration

Configure the package like this:
const config = { option: 'value' }

## Advanced Features

More advanced features here.`

    it('should extract multiple sections', () => {
      const result = extractMultipleSections(sampleContent, ['Installation', 'Basic Usage'])

      expect(result).toContain('## Installation')
      expect(result).toContain('npm install package-name')
      expect(result).toContain('## Basic Usage')
      expect(result).toContain('const pkg = require')
      expect(result).not.toContain('## Configuration')
      expect(result).not.toContain('## Advanced Features')
    })

    it('should handle case insensitive matching for multiple sections', () => {
      const result = extractMultipleSections(sampleContent, ['installation', 'BASIC USAGE'])

      expect(result).toContain('## Installation')
      expect(result).toContain('## Basic Usage')
    })

    it('should return original content when no sections found', () => {
      const result = extractMultipleSections(sampleContent, ['Nonexistent', 'Another Missing'])
      expect(result).toBe(sampleContent)
    })

    it('should extract only matching sections when some titles don\'t exist', () => {
      const result = extractMultipleSections(sampleContent, ['Installation', 'Nonexistent Section'])

      expect(result).toContain('## Installation')
      expect(result).toContain('npm install package-name')
      expect(result).not.toContain('## Basic Usage')
    })

    it('should handle empty sections array', () => {
      const result = extractMultipleSections(sampleContent, [])
      expect(result).toBe(sampleContent)
    })
  })

  describe('createGettingStartedContent', () => {
    const sampleContent = `# Main Title

This is intro content.

## Installation

To install the package:
npm install package-name

## Basic Usage

Here's how to use it:
const pkg = require('package-name')

## Configuration

Configure the package like this:
const config = { option: 'value' }

## Advanced Features

More advanced features here.`

    it('should create getting started content with all three sections', () => {
      const result = createGettingStartedContent(sampleContent)

      expect(result).toContain('# Getting Started')
      expect(result).toContain('## Installation')
      expect(result).toContain('## Basic Usage')
      expect(result).toContain('## Configuration')
      expect(result).not.toContain('## Advanced Features')
    })

    it('should handle missing sections gracefully', () => {
      const partialContent = `# Title

## Installation

Install it here.

## Other Section

Some other content.`

      const result = createGettingStartedContent(partialContent)

      expect(result).toContain('# Getting Started')
      expect(result).toContain('## Installation')
      expect(result).not.toContain('## Basic Usage')
      expect(result).not.toContain('## Configuration')
    })

    it('should handle content with no matching sections', () => {
      const noMatchContent = `# Title

## Random Section

Random content here.`

      const result = createGettingStartedContent(noMatchContent)

      expect(result).toBe('# Getting Started\n\n')
    })

    it('should handle empty content', () => {
      const result = createGettingStartedContent('')
      expect(result).toBe('# Getting Started\n\n')
    })
  })
})
