import React from 'react'
import { DocumentSection } from '../types'

interface NavigationProps {
  sections: DocumentSection[]
  currentSection: string
  currentSubsection: string | null
  onSectionChange: (sectionId: string, subsectionId?: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const Navigation: React.FC<NavigationProps> = ({
  sections,
  currentSection,
  currentSubsection,
  onSectionChange,
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
        <nav className="sidebar-nav">
          <ul className="nav-sections">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  className={`nav-item ${currentSection === section.id && !currentSubsection ? 'active' : ''}`}
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

                {/* Subsections */}
                {section.subsections && currentSection === section.id && (
                  <ul className="nav-subsections">
                    {section.subsections.map((subsection) => (
                      <li key={subsection.id}>
                        <button
                          className={`nav-subitem ${currentSubsection === subsection.id ? 'active' : ''}`}
                          onClick={() => {
                            onSectionChange(section.id, subsection.id)
                            setSidebarOpen(false)
                          }}
                        >
                          <div className="nav-subitem-content">
                            <span className="nav-subtitle">{subsection.title}</span>
                            <span className="nav-description">{subsection.subtitle}</span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
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
