'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import ThemeToggle from './theme-toggle';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
      setMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-primary/90 backdrop-blur-md shadow-lg border-b border-border font-sans transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center text-3xl font-extrabold font-serif text-primary-foreground tracking-tight hover:text-accent-foreground transition-all duration-300 hover:scale-105 transform"
        >
          <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M20.5 7.5V4.5H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 12L12 15L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Bodh.ai
        </Link>

        <nav className="hidden md:flex space-x-6 text-primary-foreground font-semibold">
          {user && [
            { href: '/dashboard', label: 'Dashboard' },
            { href: '/mockTests', label: 'Mock Tests' },
            { href: '/quickNotes', label: 'Quick Notes' }
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="relative px-3 py-2 rounded-lg hover:text-accent-foreground transition-all duration-300 hover:bg-accent hover:scale-105 transform group"
            >
              {label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          {user ? (
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-full border-2 border-accent text-primary-foreground font-semibold hover:bg-accent hover:text-accent-foreground hover:shadow-lg hover:scale-105 transform transition-all duration-300"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="px-6 py-2 rounded-full bg-accent text-accent-foreground font-semibold hover:bg-accent/90 hover:shadow-lg hover:scale-105 transform transition-all duration-300"
            >
              Login
            </Link>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-primary-foreground focus:outline-none hover:text-accent-foreground hover:scale-110 transform transition-all duration-300"
          aria-label="Toggle Menu"
        >
          {menuOpen ? (
            <svg className="w-6 h-6 transform rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-primary/95 backdrop-blur-sm border-t border-border px-4 py-4 space-y-3 font-semibold text-primary-foreground animate-slide-down">
          {user && [
            { page: 'dashboard', label: 'Dashboard' },
            { page: 'mockTests', label: 'Mock Tests' },
            { page: 'quickNotes', label: 'Quick Notes' }
          ].map(({ page, label }, index) => (
            <Link
              key={page}
              href={`/${page}`}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-lg hover:text-accent-foreground hover:bg-accent transition-all duration-300 hover:translate-x-2 transform"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {label}
            </Link>
          ))}

          <div className="pt-3 space-y-3">
            <div className="flex justify-center">
              <ThemeToggle />
            </div>
            {user ? (
              <button
                onClick={handleLogout}
                className="block w-full border-2 border-accent text-primary-foreground rounded-full py-3 text-center hover:bg-accent hover:text-accent-foreground hover:shadow-lg transition-all duration-300 hover:scale-105 transform"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-full bg-accent text-accent-foreground rounded-full py-3 text-center hover:bg-accent/90 hover:shadow-lg transition-all duration-300 hover:scale-105 transform"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Navbar;