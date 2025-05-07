"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { dummyUser } from "@/lib/dummy-data"

export function UserNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(dummyUser)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLogin = () => {
    setIsLoggedIn(true)
    setUser(dummyUser)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleLogin}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          Log in
        </button>
        <button
          onClick={handleLogin}
          className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          Sign up
        </button>
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative h-8 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative h-8 w-8 overflow-hidden rounded-full">
          <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="h-full w-full object-cover" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-3">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="border-t border-gray-100"></div>
          <div className="p-1">
            <Link
              href="/profile"
              className="flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/my-forums"
              className="flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              My Forums
            </Link>
            <Link
              href="/settings"
              className="flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Settings
            </Link>
          </div>
          <div className="border-t border-gray-100"></div>
          <div className="p-1">
            <button
              onClick={handleLogout}
              className="flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
