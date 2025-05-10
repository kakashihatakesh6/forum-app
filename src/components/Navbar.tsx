"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiHome, FiMessageSquare, FiCompass, FiUser, FiLogOut, FiLogIn, FiUserPlus } from "react-icons/fi";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-card border-b border-border sticky top-0 z-20 transition-all duration-300 ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text hover:from-primary-hover hover:to-accent transition-all duration-300">
                <motion.span 
                  whileHover={{ scale: 1.05 }} 
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="flex items-center"
                >
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                  >
                    <path 
                      d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" 
                      stroke="url(#gradient)" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                        <stop stopColor="var(--primary)" />
                        <stop offset="1" stopColor="var(--accent)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  Forum App
                </motion.span>
              </Link>
            </div>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300 ${
                  isActive('/') 
                    ? 'border-primary text-foreground' 
                    : 'border-transparent text-secondary hover:border-border hover:text-foreground'
                }`}
              >
                <motion.span 
                  whileHover={{ y: -2 }} 
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="flex items-center"
                >
                  <FiHome className="mr-1.5" />
                  Home
                </motion.span>
              </Link>
              <Link
                href="/forums"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300 ${
                  isActive('/forums') 
                    ? 'border-primary text-foreground' 
                    : 'border-transparent text-secondary hover:border-border hover:text-foreground'
                }`}
              >
                <motion.span 
                  whileHover={{ y: -2 }} 
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="flex items-center"
                >
                  <FiMessageSquare className="mr-1.5" />
                  Forums
                </motion.span>
              </Link>
              <Link
                href="/newhome"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300 ${
                  isActive('/newhome') 
                    ? 'border-primary text-foreground' 
                    : 'border-transparent text-secondary hover:border-border hover:text-foreground'
                }`}
              >
                <motion.span 
                  whileHover={{ y: -2 }} 
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="flex items-center"
                >
                  <FiCompass className="mr-1.5" />
                  Explore
                </motion.span>
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {status === "authenticated" ? (
              <div className="flex items-center space-x-6">
                <motion.span 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-sm text-gray-700 bg-gray-50 px-3 py-1 rounded-full"
                >
                  Hello, {session.user.name || session.user.email}
                </motion.span>
                <Link
                  href="/profile"
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                >
                  <motion.span 
                    whileHover={{ scale: 1.05 }} 
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="flex items-center"
                  >
                    <FiUser className="mr-1.5" />
                    Profile
                  </motion.span>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => signOut()}
                  className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors duration-200 flex items-center cursor-pointer"
                >
                  <FiLogOut className="mr-1.5" />
                  Sign out
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/signin"
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                >
                  <motion.span 
                    whileHover={{ scale: 1.05 }} 
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="flex items-center"
                  >
                    <FiLogIn className="mr-1.5" />
                    Sign in
                  </motion.span>
                </Link>
                <Link
                  href="/signup"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200"
                  >
                    <FiUserPlus className="mr-1.5" />
                    Sign up
                  </motion.div>
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <motion.svg 
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="block h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </motion.svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="sm:hidden bg-card border-b border-border shadow-lg overflow-hidden"
          >
            <div className="pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-200 ${
                  isActive('/') 
                    ? 'border-primary text-primary bg-primary-light' 
                    : 'border-transparent text-foreground hover:bg-muted hover:border-secondary hover:text-foreground'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }} className="flex items-center">
                  <FiHome className="mr-2" />
                  Home
                </motion.div>
              </Link>
              <Link
                href="/forums"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-200 ${
                  isActive('/forums') 
                    ? 'border-primary text-primary bg-primary-light' 
                    : 'border-transparent text-foreground hover:bg-muted hover:border-secondary hover:text-foreground'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }} className="flex items-center">
                  <FiMessageSquare className="mr-2" />
                  Forums
                </motion.div>
              </Link>
              <Link
                href="/newhome"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-200 ${
                  isActive('/newhome') 
                    ? 'border-primary text-primary bg-primary-light' 
                    : 'border-transparent text-foreground hover:bg-muted hover:border-secondary hover:text-foreground'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }} className="flex items-center">
                  <FiCompass className="mr-2" />
                  Explore
                </motion.div>
              </Link>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {status === "authenticated" ? (
                <div className="space-y-1">
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 py-2 text-sm text-gray-700 bg-gray-50 mx-3 rounded-md"
                  >
                    {session.user.name || session.user.email}
                  </motion.div>
                  <Link
                    href="/profile"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }} className="flex items-center">
                      <FiUser className="mr-2" />
                      Profile
                    </motion.div>
                  </Link>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-red-300 hover:text-red-700 transition-all duration-200"
                  >
                    <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }} className="flex items-center">
                      <FiLogOut className="mr-2" />
                      Sign out
                    </motion.div>
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-3 px-4 pb-2">
                  <Link
                    href="/signin"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="block w-full py-2 px-4 text-center text-base font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
                    >
                      <FiLogIn className="mr-2" />
                      Sign in
                    </motion.div>
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="block w-full py-2 px-4 text-center text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center"
                    >
                      <FiUserPlus className="mr-2" />
                      Sign up
                    </motion.div>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
} 