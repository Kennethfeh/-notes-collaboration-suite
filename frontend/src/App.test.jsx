import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  vi.stubGlobal('fetch', async (url, options = {}) => {
    const parsedUrl = typeof url === 'string' ? url : url?.toString();
    if (parsedUrl?.includes('/api/notes') && options.method === 'POST') {
      const body = JSON.parse(options.body);
      return {
        ok: true,
        json: async () => ({ id: 'test-note', text: body.text })
      };
    }
    if (parsedUrl?.includes('/api/notes')) {
      return {
        ok: true,
        json: async () => [{ id: 'existing', text: 'hello' }]
      };
    }
    if (parsedUrl?.includes('/api/health')) {
      return {
        ok: true,
        json: async () => ({ status: 'ok' })
      };
    }
    return {
      ok: true,
      json: async () => ({})
    };
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('App', () => {
  it('renders title', () => {
    render(<App />);
    expect(screen.getByText(/Notes Collaboration Suite/)).toBeDefined();
  });
});
