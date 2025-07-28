import React from 'react'
import { DocsConfig } from '../types'

interface HeaderProps {
  config: DocsConfig
  version: string
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const Header: React.FC<HeaderProps> = ({
  config,
  version,
  sidebarOpen,
  setSidebarOpen
}) => {
  const { projectName, branding } = config

  // Split project name for brand styling (e.g., "Fjell Core" -> "Fjell" + "Core")
  const nameParts = projectName.split(' ')
  const brandMain = nameParts[0] || projectName
  const brandSub = nameParts.slice(1).join(' ')

  return (
    <header className="header">
      <div className="header-container">
        <div className="brand">
          <h1 className="brand-title">
            <span className="brand-fjell">{brandMain}</span>
            {brandSub && <span className="brand-default">{brandSub}</span>}
          </h1>
          <p className="brand-tagline">{branding.tagline}</p>
        </div>

        <div className="header-actions">
          {version && (
            branding.github ? (
              <a
                href={`${branding.github}/releases`}
                className="version-badge"
                target="_blank"
                rel="noopener noreferrer"
                title="View releases"
              >
                v{version}
              </a>
            ) : (
              <span className="version-badge" title="Version information">
                v{version}
              </span>
            )
          )}
          {branding.github && (
            <a
              href={branding.github}
              className="header-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Source
            </a>
          )}
          {branding.npm && (
            <a
              href={branding.npm}
              className="header-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Install Package
            </a>
          )}
        </div>

        <button
          className="menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle navigation"
        >
          <span className="menu-line"></span>
          <span className="menu-line"></span>
          <span className="menu-line"></span>
        </button>
      </div>
    </header>
  )
}
