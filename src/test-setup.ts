
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock HTMLCanvasElement.getContext
HTMLCanvasElement.prototype.getContext = vi.fn();

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mocked-url');
global.URL.revokeObjectURL = vi.fn();

// Mock FileReader with all required properties
const mockFileReader = vi.fn().mockImplementation(() => ({
  readAsDataURL: vi.fn(),
  result: 'data:image/jpeg;base64,mockbase64data',
  onload: null,
  onerror: null,
  onabort: null,
  onloadend: null,
  onloadstart: null,
  onprogress: null,
  readyState: 0,
  error: null,
  abort: vi.fn(),
  readAsText: vi.fn(),
  readAsArrayBuffer: vi.fn(),
  readAsBinaryString: vi.fn(),
}));

// Add static properties to match FileReader interface
mockFileReader.EMPTY = 0;
mockFileReader.LOADING = 1;
mockFileReader.DONE = 2;
mockFileReader.prototype = {};

global.FileReader = mockFileReader as any;
