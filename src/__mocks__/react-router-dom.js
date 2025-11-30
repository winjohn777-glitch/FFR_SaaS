const React = require('react');

module.exports = {
  BrowserRouter: ({ children }) =>
    React.createElement('div', { 'data-testid': 'browser-router' }, children),
  Routes: ({ children }) =>
    React.createElement('div', { 'data-testid': 'routes' }, children),
  Route: ({ element }) =>
    React.createElement('div', { 'data-testid': 'route' }, element),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
  useParams: () => ({}),
  Link: ({ children, to }) =>
    React.createElement('a', { href: to }, children),
};