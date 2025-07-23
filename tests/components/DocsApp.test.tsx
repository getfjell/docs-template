import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { DocsApp } from '@/components/DocsApp'
import { DocsConfig } from '@/types'
import * as contentLoader from '@/utils/contentLoader'

// Mock the child components
vi.mock('@/components/Navigation', () => ({
  Navigation: ({ projectName, version, currentSection }: any) => (
    <div data-testid="navigation">
      <span data-testid="project-name">{projectName}</span>
      <span data-testid="version">{version}</span>
      <span data-testid="current-section">{currentSection}</span>
    </div>
  )
}))

vi.mock('@/components/ContentRenderer', () => ({
  ContentRenderer: ({ content, loading, sectionId }: any) => (
    <div data-testid="content-renderer">
      <span data-testid="section-id">{sectionId}</span>
      <span data-testid="loading">{loading.toString()}</span>
      <div data-testid="content">{content}</div>
    </div>
  )
}))

vi.mock('@/components/Layout', () => ({
  Layout: ({ children }: any) => (
    <div data-testid="layout">{children}</div>
  )
}))

// Mock the contentLoader
vi.mock('@/utils/contentLoader', () => ({
  loadDocument: vi.fn()
}))

// Mock CSS import
vi.mock('@/styles/base.css', () => ({}))

describe('DocsApp', () => {
  const mockConfig: DocsConfig = {
    projectName: 'Test Project',
    basePath: '/docs',
    port: 3000,
    branding: {
      theme: 'light'
    },
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        subtitle: 'Project overview',
        file: '/overview.md'
      },
      {
        id: 'api',
        title: 'API Reference',
        subtitle: 'API documentation',
        file: '/api.md'
      }
    ],
    version: {
      source: 'manual',
      value: '1.0.0'
    }
  }

  const mockLoadDocument = contentLoader.loadDocument as any

  beforeEach(() => {
    vi.clearAllMocks()
    mockLoadDocument.mockResolvedValue('# Test Content\n\nThis is test content.')

    // Clear any existing window properties
    delete (window as any).__APP_VERSION__
    delete process.env.TEST_VERSION
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders with basic configuration', async () => {
    render(<DocsApp config={mockConfig} />)

    expect(screen.getByTestId('layout')).toBeInTheDocument()
    expect(screen.getByTestId('navigation')).toBeInTheDocument()
    expect(screen.getByTestId('content-renderer')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })
  })

  it('displays project name and version correctly', async () => {
    render(<DocsApp config={mockConfig} />)

    await waitFor(() => {
      expect(screen.getByTestId('project-name')).toHaveTextContent('Test Project')
      expect(screen.getByTestId('version')).toHaveTextContent('1.0.0')
    })
  })

  it('loads documents for all sections', async () => {
    mockLoadDocument.mockResolvedValue('# Loaded Content')

    render(<DocsApp config={mockConfig} />)

    await waitFor(() => {
      expect(mockLoadDocument).toHaveBeenCalledWith('/overview.md')
      expect(mockLoadDocument).toHaveBeenCalledWith('/api.md')
      expect(mockLoadDocument).toHaveBeenCalledTimes(2)
    })

    await waitFor(() => {
      expect(screen.getByTestId('content')).toHaveTextContent('# Loaded Content')
    })
  })

  it('starts with first section as current', async () => {
    render(<DocsApp config={mockConfig} />)

    expect(screen.getByTestId('current-section')).toHaveTextContent('overview')
    expect(screen.getByTestId('section-id')).toHaveTextContent('overview')
  })

  it('shows loading state initially', () => {
    render(<DocsApp config={mockConfig} />)

    expect(screen.getByTestId('loading')).toHaveTextContent('true')
  })

  it('handles document loading errors gracefully', async () => {
    mockLoadDocument.mockRejectedValue(new Error('Failed to load'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<DocsApp config={mockConfig} />)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error loading /overview.md:',
        expect.any(Error)
      )
    })

    await waitFor(() => {
      expect(screen.getByTestId('content')).toHaveTextContent('# Overview Project overview Content coming soon...')
    })

    consoleSpy.mockRestore()
  })

  it('handles version from environment variable', async () => {
    process.env.TEST_VERSION = '2.0.0'
    const envConfig = {
      ...mockConfig,
      version: {
        source: 'env' as const,
        envVar: 'TEST_VERSION'
      }
    }

    render(<DocsApp config={envConfig} />)

    await waitFor(() => {
      expect(screen.getByTestId('version')).toHaveTextContent('2.0.0')
    })
  })

  it('handles version from injected window variable', async () => {
    ;(window as any).__APP_VERSION__ = '3.0.0'
    const windowConfig = {
      ...mockConfig,
      version: {
        source: 'package.json' as const
      }
    }

    render(<DocsApp config={windowConfig} />)

    await waitFor(() => {
      expect(screen.getByTestId('version')).toHaveTextContent('3.0.0')
    })
  })

  it('falls back to default version when env var not found', async () => {
    const envConfig = {
      ...mockConfig,
      version: {
        source: 'env' as const,
        envVar: 'NON_EXISTENT_VAR'
      }
    }

    render(<DocsApp config={envConfig} />)

    await waitFor(() => {
      expect(screen.getByTestId('version')).toHaveTextContent('dev')
    })
  })

  it('applies custom content processing when defined', async () => {
    const customConfig = {
      ...mockConfig,
      customContent: {
        overview: (content: string) => content.replace('Test Content', 'Custom Content')
      }
    }

    mockLoadDocument.mockResolvedValue('# Test Content\n\nOriginal content.')

    render(<DocsApp config={customConfig} />)

    await waitFor(() => {
      expect(screen.getByTestId('content')).toHaveTextContent('# Custom Content Original content.')
    })
  })

  it('handles sections without files', async () => {
    const configWithoutFile = {
      ...mockConfig,
      sections: [
        {
          id: 'nofile',
          title: 'No File Section',
          subtitle: 'Section without file',
          file: ''
        }
      ]
    }

    render(<DocsApp config={configWithoutFile} />)

    await waitFor(() => {
      expect(screen.getByTestId('content')).toHaveTextContent('# No File Section Section without file Content coming soon...')
    })
  })

  it('handles empty sections array', async () => {
    const emptyConfig = {
      ...mockConfig,
      sections: []
    }

    render(<DocsApp config={emptyConfig} />)

    expect(screen.getByTestId('current-section')).toHaveTextContent('overview')
    expect(screen.getByTestId('section-id')).toHaveTextContent('overview')
  })
})
