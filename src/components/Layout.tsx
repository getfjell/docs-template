import React from 'react'
import { DocsConfig } from '../types'
import { Header } from './Header'

interface LayoutProps {
  config: DocsConfig
  children: React.ReactNode
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  fullscreenImage: string | null
  setFullscreenImage: (image: string | null) => void
  version: string
}

export const Layout: React.FC<LayoutProps> = ({
  config,
  children,
  sidebarOpen,
  setSidebarOpen,
  fullscreenImage,
  setFullscreenImage,
  version
}) => {
  return (
    <div className={`docs-app ${config.branding.theme ? `brand-${config.branding.theme}` : ''}`}>
      {/* Animated Background */}
      <div className="header-background"></div>

      {/* Fixed Header */}
      <Header
        config={config}
        version={version}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Layout */}
      <div className="layout">
        {children}
      </div>

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div
          className="fullscreen-overlay"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="fullscreen-content">
            <img
              src={fullscreenImage}
              alt="Fullscreen view"
              className="fullscreen-image"
            />
            <button
              className="close-fullscreen"
              onClick={() => setFullscreenImage(null)}
              aria-label="Close fullscreen view"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
