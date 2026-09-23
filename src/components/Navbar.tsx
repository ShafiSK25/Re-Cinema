'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Menu,
  Search,
  MapPin,
  User,
  ShieldCheck,
  Ticket,
  LogOut,
  ChevronDown,
  X,
  Sparkles,
} from 'lucide-react';
import { UserSession } from '@/types';
import AuthModal from './AuthModal';
import FloatingSidebar from './FloatingSidebar';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      setCurrentUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      setShowUserDropdown(false);
      router.push('/');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <FloatingSidebar isAdmin={currentUser?.role === 'ADMIN'} />

      {/* Reference Image 2 Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#06080c]/95 backdrop-blur-xl border-b border-white/[0.06] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4 sm:gap-6">
            
            {/* Left: Hamburger & Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-400 hover:text-white p-1 transition"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link href="/" className="flex items-center gap-1.5 group">
                <span className="text-xl font-black italic tracking-tighter text-white">
                  Re:<span className="text-[#8cf202]">Cinema</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-[#8cf202] shadow-[0_0_8px_#8cf202] inline-block animate-pulse" />
              </Link>
            </div>

            {/* Center: Search Bar with ⌘ S Pill (Exactly as in Reference Image 2) */}
            <div className="flex-1 max-w-md hidden sm:block">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search movies, screens, theatres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
                    }
                  }}
                  className="w-full bg-[#0e1118] border border-white/[0.08] hover:border-white/[0.15] focus:border-[#8cf202]/70 rounded-lg pl-10 pr-14 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
                <div className="absolute right-2.5 flex items-center gap-1 text-[10px] text-slate-500 font-mono bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 rounded">
                  <span>⌘</span>
                  <span>S</span>
                </div>
              </div>
            </div>

            {/* Right: City Selector & Neon Green SIGN IN Button */}
            <div className="flex items-center gap-3">
              {/* City Selector */}
              <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-300 bg-[#0e1118] px-3 py-1.5 rounded-lg border border-white/[0.08]">
                <MapPin className="w-3.5 h-3.5 text-[#8cf202]" />
                <select
                  aria-label="Select City"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs font-medium"
                >
                  <option value="Mumbai" className="bg-[#0e1118] text-white">Mumbai</option>
                  <option value="Delhi-NCR" className="bg-[#0e1118] text-white">Delhi-NCR</option>
                  <option value="Bengaluru" className="bg-[#0e1118] text-white">Bengaluru</option>
                  <option value="Hyderabad" className="bg-[#0e1118] text-white">Hyderabad</option>
                  <option value="Chennai" className="bg-[#0e1118] text-white">Chennai</option>
                </select>
              </div>

              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 bg-[#0e1118] hover:bg-white/[0.06] border border-white/[0.08] px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                  >
                    <div className="w-5 h-5 rounded-md bg-[#8cf202] text-black font-black flex items-center justify-center text-[10px]">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline text-slate-200">{currentUser.name}</span>
                    {currentUser.role === 'ADMIN' && (
                      <span className="text-[9px] bg-[#8cf202]/20 text-[#8cf202] border border-[#8cf202]/30 px-1.5 py-0.2 rounded font-mono uppercase font-bold">
                        Admin
                      </span>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#0e1118] border border-white/[0.09] rounded-xl shadow-2xl py-1 z-50 animate-in fade-in">
                      <div className="px-3 py-2 border-b border-white/[0.06]">
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Logged in as</p>
                        <p className="text-xs font-semibold text-white truncate mt-0.5">{currentUser.email}</p>
                      </div>

                      {currentUser.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-amber-400 hover:bg-white/[0.04] transition"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Admin Control Center</span>
                        </Link>
                      )}

                      <Link
                        href="/my-bookings"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.04] transition"
                      >
                        <Ticket className="w-3.5 h-3.5 text-[#8cf202]" />
                        <span>My Bookings</span>
                      </Link>

                      <div className="border-t border-white/[0.06] my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* The Signature Neon Lime-Green SIGN IN button from Reference Image 2 */
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-[#8cf202] hover:bg-[#9eff00] text-black font-black text-xs px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(140,242,2,0.35)] transition-all hover:scale-102 uppercase tracking-wide flex items-center gap-1.5"
                >
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-[#0c0f16] border-b border-white/[0.08] px-4 pt-2 pb-4 space-y-2">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0e1118] border border-white/[0.08] rounded-lg pl-9 pr-4 py-2 text-xs text-white"
              />
            </div>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold uppercase text-slate-300 hover:bg-white/[0.04]"
            >
              Movies Catalog
            </Link>
            <Link
              href="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold uppercase text-slate-300 hover:bg-white/[0.04]"
            >
              My Bookings
            </Link>
            {currentUser?.role === 'ADMIN' && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-bold text-amber-400 hover:bg-white/[0.04]"
              >
                Admin Control Center
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            fetchUser();
          }}
        />
      )}
    </>
  );
}
