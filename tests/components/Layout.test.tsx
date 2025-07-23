import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Layout } from '../../src/components/Layout';
import { DocsConfig } from '../../src/types';

describe('Layout', () => {
  let mockConfig: DocsConfig;
  let mockSetSidebarOpen: ReturnType<typeof vi.fn>;
  let mockSetFullscreenImage: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSetSidebarOpen = vi.fn();
    mockSetFullscreenImage = vi.fn();

    mockConfig = {
      projectName: 'Test Project',
      basePath: '/test',
      port: 3000,
      branding: {
        theme: 'default'
      },
      sections: [],
      version: {
        source: 'manual',
        value: '1.0.0'
      }
    };
  });

  it('should render basic layout structure with children', () => {
    render(
      <Layout
        config={mockConfig}
        sidebarOpen={false}
        setSidebarOpen={mockSetSidebarOpen}
        fullscreenImage={null}
        setFullscreenImage={mockSetFullscreenImage}
      >
        <div data-testid="test-children">Test Content</div>
      </Layout>
    );

    expect(screen.getByTestId('test-children')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply default theme class when theme is provided', () => {
    const { container } = render(
      <Layout
        config={mockConfig}
        sidebarOpen={false}
        setSidebarOpen={mockSetSidebarOpen}
        fullscreenImage={null}
        setFullscreenImage={mockSetFullscreenImage}
      >
        <div>Content</div>
      </Layout>
    );

    const docsApp = container.querySelector('.docs-app');
    expect(docsApp).toHaveClass('brand-default');
  });

  it('should apply custom theme class when custom theme is provided', () => {
    const customConfig = {
      ...mockConfig,
      branding: {
        theme: 'dark'
      }
    };

    const { container } = render(
      <Layout
        config={customConfig}
        sidebarOpen={false}
        setSidebarOpen={mockSetSidebarOpen}
        fullscreenImage={null}
        setFullscreenImage={mockSetFullscreenImage}
      >
        <div>Content</div>
      </Layout>
    );

    const docsApp = container.querySelector('.docs-app');
    expect(docsApp).toHaveClass('brand-dark');
  });

  it('should not apply theme class when no theme is provided', () => {
    const noThemeConfig = {
      ...mockConfig,
      branding: {}
    };

    const { container } = render(
      <Layout
        config={noThemeConfig}
        sidebarOpen={false}
        setSidebarOpen={mockSetSidebarOpen}
        fullscreenImage={null}
        setFullscreenImage={mockSetFullscreenImage}
      >
        <div>Content</div>
      </Layout>
    );

    const docsApp = container.querySelector('.docs-app');
    expect(docsApp).toHaveClass('docs-app');
    expect(docsApp).not.toHaveClass('brand-undefined');
  });

  it('should render fullscreen image modal when fullscreenImage is provided', () => {
    const testImageUrl = 'https://example.com/test-image.jpg';

    render(
      <Layout
        config={mockConfig}
        sidebarOpen={false}
        setSidebarOpen={mockSetSidebarOpen}
        fullscreenImage={testImageUrl}
        setFullscreenImage={mockSetFullscreenImage}
      >
        <div>Content</div>
      </Layout>
    );

    const fullscreenOverlay = screen.getByRole('img', { name: 'Fullscreen view' });
    expect(fullscreenOverlay).toBeInTheDocument();
    expect(fullscreenOverlay).toHaveAttribute('src', testImageUrl);

    const closeButton = screen.getByRole('button', { name: 'Close fullscreen view' });
    expect(closeButton).toBeInTheDocument();
  });

  it('should not render fullscreen image modal when fullscreenImage is null', () => {
    render(
      <Layout
        config={mockConfig}
        sidebarOpen={false}
        setSidebarOpen={mockSetSidebarOpen}
        fullscreenImage={null}
        setFullscreenImage={mockSetFullscreenImage}
      >
        <div>Content</div>
      </Layout>
    );

    expect(screen.queryByRole('img', { name: 'Fullscreen view' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close fullscreen view' })).not.toBeInTheDocument();
  });

  it('should call setFullscreenImage with null when fullscreen overlay is clicked', () => {
    const testImageUrl = 'https://example.com/test-image.jpg';

    const { container } = render(
      <Layout
        config={mockConfig}
        sidebarOpen={false}
        setSidebarOpen={mockSetSidebarOpen}
        fullscreenImage={testImageUrl}
        setFullscreenImage={mockSetFullscreenImage}
      >
        <div>Content</div>
      </Layout>
    );

    const fullscreenOverlay = container.querySelector('.fullscreen-overlay');
    expect(fullscreenOverlay).toBeInTheDocument();

    fireEvent.click(fullscreenOverlay!);
    expect(mockSetFullscreenImage).toHaveBeenCalledWith(null);
  });

  it('should call setFullscreenImage with null when close button is clicked', () => {
    const testImageUrl = 'https://example.com/test-image.jpg';

    render(
      <Layout
        config={mockConfig}
        sidebarOpen={false}
        setSidebarOpen={mockSetSidebarOpen}
        fullscreenImage={testImageUrl}
        setFullscreenImage={mockSetFullscreenImage}
      >
        <div>Content</div>
      </Layout>
    );

    const closeButton = screen.getByRole('button', { name: 'Close fullscreen view' });
    fireEvent.click(closeButton);
    expect(mockSetFullscreenImage).toHaveBeenCalledWith(null);
  });

  it('should render sidebar overlay when sidebarOpen is true', () => {
    const { container } = render(
      <Layout
        config={mockConfig}
        sidebarOpen={true}
        setSidebarOpen={mockSetSidebarOpen}
        fullscreenImage={null}
        setFullscreenImage={mockSetFullscreenImage}
      >
        <div>Content</div>
      </Layout>
    );

    const sidebarOverlay = container.querySelector('.sidebar-overlay');
    expect(sidebarOverlay).toBeInTheDocument();
  });

  it('should not render sidebar overlay when sidebarOpen is false', () => {
    const { container } = render(
      <Layout
        config={mockConfig}
        sidebarOpen={false}
        setSidebarOpen={mockSetSidebarOpen}
        fullscreenImage={null}
        setFullscreenImage={mockSetFullscreenImage}
      >
        <div>Content</div>
      </Layout>
    );

    const sidebarOverlay = container.querySelector('.sidebar-overlay');
    expect(sidebarOverlay).not.toBeInTheDocument();
  });

  it('should call setSidebarOpen with false when sidebar overlay is clicked', () => {
    const { container } = render(
      <Layout
        config={mockConfig}
        sidebarOpen={true}
        setSidebarOpen={mockSetSidebarOpen}
        fullscreenImage={null}
        setFullscreenImage={mockSetFullscreenImage}
      >
        <div>Content</div>
      </Layout>
    );

    const sidebarOverlay = container.querySelector('.sidebar-overlay');
    expect(sidebarOverlay).toBeInTheDocument();

    fireEvent.click(sidebarOverlay!);
    expect(mockSetSidebarOpen).toHaveBeenCalledWith(false);
  });

  it('should render header background element', () => {
    const { container } = render(
      <Layout
        config={mockConfig}
        sidebarOpen={false}
        setSidebarOpen={mockSetSidebarOpen}
        fullscreenImage={null}
        setFullscreenImage={mockSetFullscreenImage}
      >
        <div>Content</div>
      </Layout>
    );

    const headerBackground = container.querySelector('.header-background');
    expect(headerBackground).toBeInTheDocument();
  });

  it('should handle both fullscreen modal and sidebar overlay simultaneously', () => {
    const testImageUrl = 'https://example.com/test-image.jpg';
    const { container } = render(
      <Layout
        config={mockConfig}
        sidebarOpen={true}
        setSidebarOpen={mockSetSidebarOpen}
        fullscreenImage={testImageUrl}
        setFullscreenImage={mockSetFullscreenImage}
      >
        <div>Content</div>
      </Layout>
    );

    // Both overlays should be present
    expect(container.querySelector('.fullscreen-overlay')).toBeInTheDocument();
    expect(container.querySelector('.sidebar-overlay')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Fullscreen view' })).toBeInTheDocument();
  });
});
