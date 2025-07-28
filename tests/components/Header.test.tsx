import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Header } from '../../src/components/Header'
import { DocsConfig } from '../../src/types'

const mockConfig: DocsConfig = {
  projectName: 'Fjell Core',
  basePath: '/',
  port: 3000,
  branding: {
    theme: 'core',
    tagline: 'Core Item and Key Framework for Fjell',
    github: 'https://github.com/getfjell/fjell-core',
    npm: 'https://www.npmjs.com/package/@fjell/core'
  },
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      subtitle: 'Getting started',
      file: '/README.md'
    }
  ],
  version: {
    source: 'manual',
    value: '1.0.0'
  },
  filesToCopy: []
}

describe('Header', () => {
  const mockSetSidebarOpen = vi.fn()

  beforeEach(() => {
    mockSetSidebarOpen.mockClear()
  })

  it('renders project name correctly', () => {
    render(
      <Header
        config={mockConfig}
        version="1.0.0"
        sidebarOpen={false}
        setSidebarOpen={mockSetSidebarOpen}
      />
    )

    expect(screen.getByText('Fjell')).toBeInTheDocument()
    expect(screen.getByText('Core')).toBeInTheDocument()
  })

  it('renders tagline', () => {
    render(
      <Header
        config={mockConfig}
        version="1.0.0"
        sidebarOpen={false}
        setSidebarOpen={mockSetSidebarOpen}
      />
    )

    expect(screen.getByText('Core Item and Key Framework for Fjell')).toBeInTheDocument()
  })

  it('renders version badge when version is provided', () => {
    render(
      <Header
        config={mockConfig}
        version="1.0.0"
        sidebarOpen={false}
        setSidebarOpen={mockSetSidebarOpen}
      />
    )

    const versionElement = screen.getByText('v1.0.0')
    expect(versionElement).toBeInTheDocument()
    // Should be a link since mockConfig has GitHub URL
    expect(versionElement.closest('a')).toBeInTheDocument()
  })

  it('renders GitHub link when provided', () => {
    render(
      <Header
        config={mockConfig}
        version="1.0.0"
        sidebarOpen={false}
        setSidebarOpen={mockSetSidebarOpen}
      />
    )

    const githubLink = screen.getByText('View Source')
    expect(githubLink).toBeInTheDocument()
    expect(githubLink.closest('a')).toHaveAttribute('href', 'https://github.com/getfjell/fjell-core')
  })

  it('renders NPM link when provided', () => {
    render(
      <Header
        config={mockConfig}
        version="1.0.0"
        sidebarOpen={false}
        setSidebarOpen={mockSetSidebarOpen}
      />
    )

    const npmLink = screen.getByText('Install Package')
    expect(npmLink).toBeInTheDocument()
    expect(npmLink.closest('a')).toHaveAttribute('href', 'https://www.npmjs.com/package/@fjell/core')
  })

  it('handles single word project names correctly', () => {
    const singleWordConfig = {
      ...mockConfig,
      projectName: 'Registry'
    }

    render(
      <Header
        config={singleWordConfig}
        version="1.0.0"
        sidebarOpen={false}
        setSidebarOpen={mockSetSidebarOpen}
      />
    )

    expect(screen.getByText('Registry')).toBeInTheDocument()
    // Should not have a second part
    expect(screen.queryByText('Core')).not.toBeInTheDocument()
  })

  it('toggles sidebar when menu button is clicked', () => {
    render(
      <Header
        config={mockConfig}
        version="1.0.0"
        sidebarOpen={false}
        setSidebarOpen={mockSetSidebarOpen}
      />
    )

    const menuButton = screen.getByLabelText('Toggle navigation')
    fireEvent.click(menuButton)

    expect(mockSetSidebarOpen).toHaveBeenCalledWith(true)
  })

  it('does not render version badge when version is empty', () => {
    render(
      <Header
        config={mockConfig}
        version=""
        sidebarOpen={false}
        setSidebarOpen={mockSetSidebarOpen}
      />
    )

    expect(screen.queryByText(/^v/)).not.toBeInTheDocument()
  })

  it('renders version badge as span when no GitHub URL is provided', () => {
    const configWithoutGithub = {
      ...mockConfig,
      branding: {
        ...mockConfig.branding
      }
    }
    delete configWithoutGithub.branding.github

    render(
      <Header
        config={configWithoutGithub}
        version="1.0.0"
        sidebarOpen={false}
        setSidebarOpen={mockSetSidebarOpen}
      />
    )

    const versionElement = screen.getByText('v1.0.0')
    expect(versionElement).toBeInTheDocument()
    // Should be a span, not a link
    expect(versionElement.closest('a')).not.toBeInTheDocument()
    expect(versionElement.tagName).toBe('SPAN')
  })

  it('does not render GitHub link when not provided', () => {
    const configWithoutGithub = {
      ...mockConfig,
      branding: {
        ...mockConfig.branding
      }
    }
    delete configWithoutGithub.branding.github

    render(
      <Header
        config={configWithoutGithub}
        version="1.0.0"
        sidebarOpen={false}
        setSidebarOpen={mockSetSidebarOpen}
      />
    )

    expect(screen.queryByText('View Source')).not.toBeInTheDocument()
  })
})
