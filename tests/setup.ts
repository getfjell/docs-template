import '@testing-library/jest-dom'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
})

// Mock IntersectionObserver
class MockIntersectionObserver {
  root = null
  rootMargin = ''
  thresholds = []

  disconnect() {}
  observe() {}
  unobserve() {}
}

window.IntersectionObserver = MockIntersectionObserver as any
window.ResizeObserver = MockIntersectionObserver as any
