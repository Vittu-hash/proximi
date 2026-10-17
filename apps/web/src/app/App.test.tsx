import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders root heading and confirms app boots', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /proximi/i })).toBeDefined();
  });
});
