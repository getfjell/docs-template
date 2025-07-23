import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Navigation } from '../../src/components/Navigation'
import { DocumentSection } from '../../src/types'

const mockSections: DocumentSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    subtitle: 'Quick setup guide',
    file: 'getting-started.md'
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    subtitle: 'Complete API documentation',
    file: 'api-reference.md'
  },
  {
    id: 'examples',
    title: 'Examples',
    subtitle: 'Code examples and tutorials',
    file: 'examples.md'
  }
]

const defaultProps = {
  sections: mockSections,
  currentSection: 'getting-started',
  onSectionChange: vi.fn(),
  projectName: 'Test Project',
  version: '1.2.3',
  sidebarOpen: false,
  setSidebarOpen: vi.fn()
}

describe('Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders mobile menu button', () => {
      render(<Navigation {...defaultProps} />)

      const menuButton = screen.getByRole('button', { name: 'Toggle navigation' })
      expect(menuButton).toBeInTheDocument()
      expect(menuButton).toHaveClass('mobile-menu-button')
    })

    it('renders sidebar with correct structure', () => {
      render(<Navigation {...defaultProps} />)

      const sidebar = document.querySelector('.sidebar')
      expect(sidebar).toBeInTheDocument()
      expect(sidebar).not.toHaveClass('sidebar-open')
    })

    it('renders logo and project information', () => {
      render(<Navigation {...defaultProps} />)

      expect(screen.getByText('Fjell')).toBeInTheDocument()
      expect(screen.getByText('Test Project')).toBeInTheDocument()
      expect(screen.getByText('v1.2.3')).toBeInTheDocument()
    })

    it('renders footer text', () => {
      render(<Navigation {...defaultProps} />)

      expect(screen.getByText('Built with Fjell Documentation Template')).toBeInTheDocument()
    })
  })

  describe('Sidebar State Management', () => {
    it('applies sidebar-open class when sidebarOpen is true', () => {
      render(<Navigation {...defaultProps} sidebarOpen={true} />)

      const sidebar = document.querySelector('.sidebar')
      expect(sidebar).toHaveClass('sidebar-open')
    })

    it('does not apply sidebar-open class when sidebarOpen is false', () => {
      render(<Navigation {...defaultProps} sidebarOpen={false} />)

      const sidebar = document.querySelector('.sidebar')
      expect(sidebar).not.toHaveClass('sidebar-open')
    })
  })

  describe('Mobile Menu Functionality', () => {
    it('calls setSidebarOpen with correct value when menu button is clicked', () => {
      const setSidebarOpen = vi.fn()
      render(<Navigation {...defaultProps} sidebarOpen={false} setSidebarOpen={setSidebarOpen} />)

      const menuButton = screen.getByRole('button', { name: 'Toggle navigation' })
      fireEvent.click(menuButton)

      expect(setSidebarOpen).toHaveBeenCalledWith(true)
    })

    it('calls setSidebarOpen with false when sidebar is open and menu button is clicked', () => {
      const setSidebarOpen = vi.fn()
      render(<Navigation {...defaultProps} sidebarOpen={true} setSidebarOpen={setSidebarOpen} />)

      const menuButton = screen.getByRole('button', { name: 'Toggle navigation' })
      fireEvent.click(menuButton)

      expect(setSidebarOpen).toHaveBeenCalledWith(false)
    })
  })

  describe('Navigation Sections', () => {
    it('renders all navigation sections', () => {
      render(<Navigation {...defaultProps} />)

      expect(screen.getByText('Getting Started')).toBeInTheDocument()
      expect(screen.getByText('Quick setup guide')).toBeInTheDocument()
      expect(screen.getByText('API Reference')).toBeInTheDocument()
      expect(screen.getByText('Complete API documentation')).toBeInTheDocument()
      expect(screen.getByText('Examples')).toBeInTheDocument()
      expect(screen.getByText('Code examples and tutorials')).toBeInTheDocument()
    })

    it('renders section titles and subtitles correctly', () => {
      render(<Navigation {...defaultProps} />)

      mockSections.forEach(section => {
        expect(screen.getByText(section.title)).toBeInTheDocument()
        expect(screen.getByText(section.subtitle)).toBeInTheDocument()
      })
    })

    it('renders empty navigation when no sections provided', () => {
      render(<Navigation {...defaultProps} sections={[]} />)

      const navSections = document.querySelector('.nav-sections')
      expect(navSections).toBeInTheDocument()
      expect(navSections?.children).toHaveLength(0)
    })
  })

  describe('Active Section Highlighting', () => {
    it('applies active class to current section', () => {
      render(<Navigation {...defaultProps} currentSection="api-reference" />)

      const sections = screen.getAllByRole('button').filter(button =>
        button.classList.contains('nav-item')
      )

      const activeSection = sections.find(section =>
        section.textContent?.includes('API Reference')
      )
      const inactiveSection = sections.find(section =>
        section.textContent?.includes('Getting Started')
      )

      expect(activeSection).toHaveClass('active')
      expect(inactiveSection).not.toHaveClass('active')
    })

    it('updates active section when currentSection prop changes', () => {
      const { rerender } = render(<Navigation {...defaultProps} currentSection="getting-started" />)

      let sections = screen.getAllByRole('button').filter(button =>
        button.classList.contains('nav-item')
      )
      let activeSection = sections.find(section =>
        section.textContent?.includes('Getting Started')
      )
      expect(activeSection).toHaveClass('active')

      rerender(<Navigation {...defaultProps} currentSection="examples" />)

      sections = screen.getAllByRole('button').filter(button =>
        button.classList.contains('nav-item')
      )
      activeSection = sections.find(section =>
        section.textContent?.includes('Examples')
      )
      const previousActive = sections.find(section =>
        section.textContent?.includes('Getting Started')
      )

      expect(activeSection).toHaveClass('active')
      expect(previousActive).not.toHaveClass('active')
    })
  })

  describe('Navigation Item Interactions', () => {
    it('calls onSectionChange when navigation item is clicked', () => {
      const onSectionChange = vi.fn()
      render(<Navigation {...defaultProps} onSectionChange={onSectionChange} />)

      const apiReferenceButton = screen.getByText('API Reference').closest('button')
      fireEvent.click(apiReferenceButton!)

      expect(onSectionChange).toHaveBeenCalledWith('api-reference')
    })

    it('calls setSidebarOpen(false) when navigation item is clicked', () => {
      const setSidebarOpen = vi.fn()
      render(<Navigation {...defaultProps} setSidebarOpen={setSidebarOpen} />)

      const examplesButton = screen.getByText('Examples').closest('button')
      fireEvent.click(examplesButton!)

      expect(setSidebarOpen).toHaveBeenCalledWith(false)
    })

    it('calls both onSectionChange and setSidebarOpen when nav item is clicked', () => {
      const onSectionChange = vi.fn()
      const setSidebarOpen = vi.fn()
      render(<Navigation
        {...defaultProps}
        onSectionChange={onSectionChange}
        setSidebarOpen={setSidebarOpen}
      />)

      const gettingStartedButton = screen.getByText('Getting Started').closest('button')
      fireEvent.click(gettingStartedButton!)

      expect(onSectionChange).toHaveBeenCalledWith('getting-started')
      expect(setSidebarOpen).toHaveBeenCalledWith(false)
    })

    it('calls functions with correct section id for each navigation item', () => {
      const onSectionChange = vi.fn()
      render(<Navigation {...defaultProps} onSectionChange={onSectionChange} />)

      mockSections.forEach(section => {
        const button = screen.getByText(section.title).closest('button')
        fireEvent.click(button!)
        expect(onSectionChange).toHaveBeenCalledWith(section.id)
      })

      expect(onSectionChange).toHaveBeenCalledTimes(mockSections.length)
    })
  })

  describe('Accessibility', () => {
    it('provides accessible label for mobile menu button', () => {
      render(<Navigation {...defaultProps} />)

      const menuButton = screen.getByRole('button', { name: 'Toggle navigation' })
      expect(menuButton).toHaveAttribute('aria-label', 'Toggle navigation')
    })

    it('renders navigation items as buttons for keyboard accessibility', () => {
      render(<Navigation {...defaultProps} />)

      const navButtons = screen.getAllByRole('button').filter(button =>
        button.classList.contains('nav-item')
      )

      expect(navButtons).toHaveLength(mockSections.length)
      navButtons.forEach(button => {
        expect(button.tagName).toBe('BUTTON')
      })
    })
  })

  describe('Project Information Display', () => {
    it('displays project name in header', () => {
      render(<Navigation {...defaultProps} projectName="Custom Project Name" />)

      expect(screen.getByText('Custom Project Name')).toBeInTheDocument()
      expect(screen.getByText('Custom Project Name')).toHaveClass('project-title')
    })

    it('displays version in badge format', () => {
      render(<Navigation {...defaultProps} version="2.0.0-beta" />)

      const versionElement = screen.getByText('v2.0.0-beta')
      expect(versionElement).toBeInTheDocument()
      expect(versionElement).toHaveClass('version-badge')
    })

    it('handles empty version string', () => {
      render(<Navigation {...defaultProps} version="" />)

      const versionElement = screen.getByText('v')
      expect(versionElement).toBeInTheDocument()
    })
  })
})
