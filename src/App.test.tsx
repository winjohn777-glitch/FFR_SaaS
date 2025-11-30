import React from 'react';
import { render, screen } from '@testing-library/react';

test('renders without crashing', () => {
  const App = require('./App').default;
  render(<App />);

  // Check that the app renders without throwing
  const themeProvider = screen.getByTestId('theme-provider');
  expect(themeProvider).toBeInTheDocument();
});

test('app component exists', () => {
  const App = require('./App').default;
  expect(App).toBeDefined();
  expect(typeof App).toBe('function');
});
