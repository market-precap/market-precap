'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '../ui/ThemeToggle';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white">
              Market Precap
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              About
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Blog
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6 text-gray-600 dark:text-gray-300"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Home
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                About
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Blog
              </Link>
              <div className="pt-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
