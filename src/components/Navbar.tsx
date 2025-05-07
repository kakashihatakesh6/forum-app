"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-card shadow-md border-b border-border sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text hover:from-primary-hover hover:to-accent transition-all duration-300">
                Forum App
              </Link>
            </div>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                  isActive('/') 
                    ? 'border-primary text-foreground' 
                    : 'border-transparent text-secondary hover:border-border hover:text-foreground'
                }`}
              >
                Home
              </Link>
              <Link
                href="/forums"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                  isActive('/forums') 
                    ? 'border-primary text-foreground' 
                    : 'border-transparent text-secondary hover:border-border hover:text-foreground'
                }`}
              >
                Forums
              </Link>
              <Link
                href="/newhome"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                  isActive('/forums') 
                    ? 'border-primary text-foreground' 
                    : 'border-transparent text-secondary hover:border-border hover:text-foreground'
                }`}
              >
                Explore
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {status === "authenticated" ? (
              <div className="flex items-center space-x-6">
                <span className="text-sm text-gray-700 bg-gray-50 px-3 py-1 rounded-full">
                  Hello, {session.user.name || session.user.email}
                </span>
                <Link
                  href="/profile"
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                >
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors duration-200"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/signin"
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all duration-200 hover:shadow"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-card border-b border-border shadow-lg">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/') 
                  ? 'border-primary text-primary bg-primary-light' 
                  : 'border-transparent text-foreground hover:bg-muted hover:border-secondary hover:text-foreground'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/forums"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/forums') 
                  ? 'border-primary text-primary bg-primary-light' 
                  : 'border-transparent text-foreground hover:bg-muted hover:border-secondary hover:text-foreground'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Forums
            </Link>
            <Link
              href="/newhome"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/forums') 
                  ? 'border-primary text-primary bg-primary-light' 
                  : 'border-transparent text-foreground hover:bg-muted hover:border-secondary hover:text-foreground'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {status === "authenticated" ? (
              <div className="space-y-1">
                <div className="px-4 py-2 text-sm text-gray-700 bg-gray-50 mx-3 rounded-md">
                  {session.user.name || session.user.email}
                </div>
                <Link
                  href="/profile"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-red-300 hover:text-red-700"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="space-y-3 px-4 pb-2">
                <Link
                  href="/signin"
                  className="block w-full py-2 px-4 text-center text-base font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="block w-full py-2 px-4 text-center text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 