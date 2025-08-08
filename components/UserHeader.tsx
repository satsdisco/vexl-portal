'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { vexlBrand } from '@/lib/vexl-brand-manual';
import { Menu, Home, Settings, LogIn } from 'lucide-react';
import { useState } from 'react';

export default function UserHeader() {
  const { isSignedIn, user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header 
      className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b"
      style={{ borderColor: vexlBrand.colors.gray[800] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link 
            href="/" 
            className="flex items-center gap-2 font-bold text-xl"
          >
            <span style={{ color: vexlBrand.colors.primary.yellow }}>Vexl</span>
            <span className="text-white">Portal</span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                {/* Quick Links */}
                <nav className="hidden md:flex items-center gap-4">
                  <Link 
                    href="/dashboard"
                    className="text-gray-300 hover:text-white transition"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/workshop"
                    className="text-gray-300 hover:text-white transition"
                  >
                    Workshops
                  </Link>
                  <Link 
                    href="/admin/builder"
                    className="text-gray-300 hover:text-white transition"
                  >
                    Builder
                  </Link>
                </nav>

                {/* User Button */}
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: 'w-10 h-10',
                      userButtonPopoverCard: 'bg-gray-900 border-gray-800',
                      userButtonPopoverActionButton: 'hover:bg-gray-800',
                    }
                  }}
                />

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-800"
                >
                  <Menu size={20} />
                </button>
              </>
            ) : (
              <Link
                href="/sign-in"
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition"
                style={{
                  backgroundColor: vexlBrand.colors.primary.yellow,
                  color: vexlBrand.colors.primary.black,
                }}
              >
                <LogIn size={18} />
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isSignedIn && menuOpen && (
          <nav className="md:hidden py-4 border-t" style={{ borderColor: vexlBrand.colors.gray[800] }}>
            <div className="flex flex-col gap-2">
              <Link 
                href="/dashboard"
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded transition"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/workshop"
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded transition"
                onClick={() => setMenuOpen(false)}
              >
                Workshops
              </Link>
              <Link 
                href="/admin/builder"
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded transition"
                onClick={() => setMenuOpen(false)}
              >
                Builder
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}