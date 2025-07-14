'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';

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
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md shadow-2xl border-b border-gray-800/40 font-poppins transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-3xl font-extrabold font-mono text-white tracking-tight hover:text-gray-300 transition-all duration-300 hover:scale-105 transform"
        >
          JEE Ace
        </Link>

        <nav className="hidden md:flex space-x-6 text-gray-300 font-semibold">
          {[
            { href: '/dashboard', label: 'Dashboard' },
            { href: '/mockTests', label: 'Mock Tests' },
           
            { href: '/quickNotes', label: 'Quick Notes' }
           
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="relative px-3 py-2 rounded-lg hover:text-white transition-all duration-300 hover:bg-gray-800 hover:scale-105 transform group"
            >
              {label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-300 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-full border-2 border-gray-600 text-gray-300 font-semibold hover:bg-gray-600 hover:text-white hover:shadow-lg hover:scale-105 transform transition-all duration-300"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="px-6 py-2 rounded-full bg-gray-700 text-white font-semibold hover:bg-gray-600 hover:shadow-lg hover:scale-105 transform transition-all duration-300"
            >
              Login
            </Link>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-300 focus:outline-none hover:text-white hover:scale-110 transform transition-all duration-300"
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
        <div className="md:hidden bg-black/95 backdrop-blur-sm border-t border-gray-800/40 px-4 py-4 space-y-3 font-semibold text-gray-300 animate-slide-down">
          {['dashboard', 'mockTests', 'question-bank', 'quickNotes', 'leaderboard'].map((page, index) => (
            <Link
              key={page}
              href={`/${page}`}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-lg hover:text-white hover:bg-gray-800 transition-all duration-300 hover:translate-x-2 transform"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {page
                .split('-')
                .map((word) => word[0].toUpperCase() + word.slice(1))
                .join(' ')}
            </Link>
          ))}

          <div className="pt-3">
            {user ? (
              <button
                onClick={handleLogout}
                className="block w-full border-2 border-gray-600 text-gray-300 rounded-full py-3 text-center hover:bg-gray-600 hover:text-white hover:shadow-lg transition-all duration-300 hover:scale-105 transform"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-full bg-gray-700 text-white rounded-full py-3 text-center hover:bg-gray-600 hover:shadow-lg transition-all duration-300 hover:scale-105 transform"
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