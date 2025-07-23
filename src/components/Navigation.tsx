import React from 'react'
import { DocumentSection } from '@/types'

interface NavigationProps {
  sections: DocumentSection[]
  currentSection: string
  onSectionChange: (sectionId: string) => void
  projectName: string
  version: string
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const Navigation: React.FC<NavigationProps> = ({
  sections,
  currentSection,
  onSectionChange,
  projectName,
  version,
  sidebarOpen,
  setSidebarOpen
}) => {
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle navigation"
      >
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-container">
              <div className="logo">
                <span className="logo-text">Fjell</span>
              </div>
            </div>
            <div className="project-info">
              <h1 className="project-title">{projectName}</h1>
              <div className="version-badge">v{version}</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-sections">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  className={`nav-item ${currentSection === section.id ? 'active' : ''}`}
                  onClick={() => {
                    onSectionChange(section.id)
                    setSidebarOpen(false) // Close mobile sidebar on selection
                  }}
                >
                  <div className="nav-item-content">
                    <span className="nav-title">{section.title}</span>
                    <span className="nav-subtitle">{section.subtitle}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="footer-text">
            Built with Fjell Documentation Template
          </div>
        </div>
      </div>
    </>
  )
}
