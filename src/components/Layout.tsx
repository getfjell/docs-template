import React from 'react'
import { DocsConfig } from '../types'

interface LayoutProps {
  config: DocsConfig
  children: React.ReactNode
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  fullscreenImage: string | null
  setFullscreenImage: (image: string | null) => void
}

export const Layout: React.FC<LayoutProps> = ({
  config,
  children,
  sidebarOpen,
  setSidebarOpen,
  fullscreenImage,
  setFullscreenImage
}) => {
  return (
    <div className={`docs-app ${config.branding.theme ? `brand-${config.branding.theme}` : ''}`}>
      <div className="header-background"></div>

      {children}

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
