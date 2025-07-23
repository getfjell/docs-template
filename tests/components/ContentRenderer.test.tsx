import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { ContentRenderer } from '../../src/components/ContentRenderer'
import { DocsConfig, DocumentSection } from '../../src/types'

// Mock react-syntax-highlighter to avoid syntax highlighting dependencies in tests
vi.mock('react-syntax-highlighter', () => ({
  Prism: ({ children, ...props }: any) => <pre {...props}>{children}</pre>
}))

vi.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  oneLight: {}
}))

const mockConfig: DocsConfig = {
  projectName: 'Test Project',
  basePath: '/docs',
  port: 3000,
  branding: {
    theme: 'light'
  },
  sections: [],
  version: {
    source: 'manual',
    value: '1.0.0'
  }
}

const mockSectionData: DocumentSection = {
  id: 'test-section',
  title: 'Test Section',
  subtitle: 'A test section for unit testing',
  file: 'test.md'
}

describe('ContentRenderer', () => {
  it('displays loading spinner when loading is true', () => {
    const mockOnImageClick = vi.fn()

    render(
      <ContentRenderer
        content=""
        sectionId="test"
        loading={true}
        config={mockConfig}
        onImageClick={mockOnImageClick}
      />
    )

    expect(screen.getByText('Loading documentation...')).toBeInTheDocument()
    expect(document.querySelector('.loading-spinner')).toBeInTheDocument()
  })

  it('renders content without section data when not loading', () => {
    const mockOnImageClick = vi.fn()
    const testContent = '# Test Heading\n\nThis is test content.'

    render(
      <ContentRenderer
        content={testContent}
        sectionId="test"
        loading={false}
        config={mockConfig}
        onImageClick={mockOnImageClick}
      />
    )

    expect(screen.getByText('Test Heading')).toBeInTheDocument()
    expect(screen.getByText('This is test content.')).toBeInTheDocument()
    expect(document.querySelector('.main-content')).toBeInTheDocument()
  })

  it('renders content with section data and breadcrumbs', () => {
    const mockOnImageClick = vi.fn()
    const testContent = '# Test Heading\n\nThis is test content.'

    render(
      <ContentRenderer
        content={testContent}
        sectionId="test"
        sectionData={mockSectionData}
        loading={false}
        config={mockConfig}
        onImageClick={mockOnImageClick}
      />
    )

    // Check breadcrumb elements
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('A test section for unit testing')).toBeInTheDocument()

    // Check that breadcrumb structure exists and contains Test Section
    const breadcrumb = document.querySelector('.breadcrumb')
    expect(breadcrumb).toBeInTheDocument()
    expect(breadcrumb).toHaveTextContent('Test Section')

    // Check page title and subtitle
    const pageTitle = document.querySelector('.page-title')
    expect(pageTitle).toBeInTheDocument()
    expect(pageTitle).toHaveTextContent('Test Section')

    expect(document.querySelector('.page-subtitle')).toBeInTheDocument()
  })

  it('handles image clicks correctly', () => {
    const mockOnImageClick = vi.fn()
    const contentWithImage = '![Test Image](test.png)'

    render(
      <ContentRenderer
        content={contentWithImage}
        sectionId="test"
        loading={false}
        config={mockConfig}
        onImageClick={mockOnImageClick}
      />
    )

    const image = screen.getByAltText('Test Image')
    expect(image).toBeInTheDocument()

    fireEvent.click(image)
    expect(mockOnImageClick).toHaveBeenCalledWith('/docstest.png')
  })

  it('renders code blocks correctly', () => {
    const mockOnImageClick = vi.fn()
    const contentWithCode = '```javascript\nconst test = "hello";\n```'

    render(
      <ContentRenderer
        content={contentWithCode}
        sectionId="test"
        loading={false}
        config={mockConfig}
        onImageClick={mockOnImageClick}
      />
    )

    expect(screen.getByText('const test = "hello";')).toBeInTheDocument()
  })

  it('handles external links with proper attributes', () => {
    const mockOnImageClick = vi.fn()
    const contentWithExternalLink = '[External Link](https://example.com)'

    render(
      <ContentRenderer
        content={contentWithExternalLink}
        sectionId="test"
        loading={false}
        config={mockConfig}
        onImageClick={mockOnImageClick}
      />
    )

    const link = screen.getByText('External Link')
    expect(link).toBeInTheDocument()
    expect(link.closest('a')).toHaveAttribute('href', 'https://example.com')
    expect(link.closest('a')).toHaveAttribute('target', '_blank')
    expect(link.closest('a')).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('handles internal links without external attributes', () => {
    const mockOnImageClick = vi.fn()
    const contentWithInternalLink = '[Internal Link](./internal.md)'

    render(
      <ContentRenderer
        content={contentWithInternalLink}
        sectionId="test"
        loading={false}
        config={mockConfig}
        onImageClick={mockOnImageClick}
      />
    )

    const link = screen.getByText('Internal Link')
    expect(link).toBeInTheDocument()
    expect(link.closest('a')).toHaveAttribute('href', './internal.md')
    expect(link.closest('a')).not.toHaveAttribute('target')
    expect(link.closest('a')).not.toHaveAttribute('rel')
  })
})
