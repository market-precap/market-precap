// App-wide constants
export const SITE_NAME = 'Your Site Name';
export const SITE_DESCRIPTION = 'Your site description';

// API endpoints
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Routes
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  BLOG: '/blog',
  BLOG_POST: (slug: string) => `/blog/${slug}`,
};

// Theme
export const THEME = {
  light: {
    background: 'white',
    text: 'black',
  },
  dark: {
    background: '#1a1a1a',
    text: 'white',
  },
};

// Breakpoints
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
};
