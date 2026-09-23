'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Film,
  Tv,
  Calendar,
  Ticket,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  LogOut,
  PlusCircle,
} from 'lucide-react';
import { UserSession } from '@/types';
import AuthModal from '@/components/AuthModal';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setCurrentUser(data.user);
    } catch (e) {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Movies Catalog', href: '/admin/movies', icon: Film },
    { label: 'Screens & Theatres', href: '/admin/screens', icon: Tv },
    { label: 'Show Schedules', href: '/admin/shows', icon: Calendar },
    { label: 'Bookings & Audit', href: '/admin/bookings', icon: Ticket },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not an admin: show guard screen
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#080c14]">
        <div className="max-w-md w-full bg-[#0c121d] border border-white/[0.08] rounded-3xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/25 text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-black text-white tracking-tight">Admin Access Restricted</h2>
            <p className="text-xs text-slate-400">
              Only authorized Cinema Managers and Admins can add/remove movies, screens, and manage shows.
            </p>
          </div>

          <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/[0.06] text-xs text-left space-y-1">
            <span className="font-semibold text-slate-300 block text-[11px]">Seeded Admin Credentials:</span>
            <p className="text-slate-400">Email: <span className="text-amber-400 font-mono">admin@cinema.com</span></p>
            <p className="text-slate-400">Password: <span className="text-amber-400 font-mono">admin123</span></p>
          </div>

          <div className="flex flex-col gap-2.5 pt-1">
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2.5 rounded-xl shadow-md transition text-xs"
            >
              Sign In as Admin
            </button>
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </Link>
          </div>
        </div>

        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onSuccess={() => {
              setShowAuthModal(false);
              checkAdmin();
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c14] flex flex-col md:flex-row">
      {/* Sleek Admin Sidebar */}
      <aside className="w-full md:w-60 bg-[#0c121d] border-r border-white/[0.06] p-4 sm:p-5 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-black text-white">Admin Control</h2>
              <span className="text-[9px] text-slate-500 block -mt-0.5">Cinema Operations</span>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
                      : 'text-slate-400 hover:bg-white/[0.04] hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-white/[0.06] mt-6 space-y-2">
          <div className="px-3 py-2 bg-white/[0.02] rounded-xl border border-white/[0.04]">
            <span className="text-[9px] text-slate-500 uppercase font-bold block">Signed In</span>
            <span className="text-xs font-semibold text-white block truncate">{currentUser.name}</span>
            <span className="text-[9px] text-amber-400/80 font-mono">Role: ADMIN</span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customer View</span>
          </Link>
        </div>
      </aside>

      {/* Admin Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
