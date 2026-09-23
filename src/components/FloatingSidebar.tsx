'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Search,
  Calendar,
  Ticket,
  Settings,
  Activity,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface FloatingSidebarProps {
  isAdmin?: boolean;
}

export default function FloatingSidebar({ isAdmin }: FloatingSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { label: 'Home', href: '/', icon: Home, exact: true },
    { label: 'Showtimes', href: '/#shows', icon: Calendar },
    { label: 'My Bookings', href: '/my-bookings', icon: Ticket },
    ...(isAdmin
      ? [{ label: 'Admin Panel', href: '/admin', icon: ShieldCheck }]
      : [{ label: 'Admin Login', href: '/admin', icon: Settings }]),
  ];

  return (
    <aside
      className={`fixed left-3 top-1/2 -translate-y-1/2 z-40 transition-all duration-300 hidden lg:flex flex-col items-center ${
        collapsed ? '-translate-x-12' : 'translate-x-0'
      }`}
    >
      <div className="relative bg-[#10131b]/95 backdrop-blur-xl border border-white/[0.1] rounded-full py-4 px-2 shadow-2xl flex flex-col items-center gap-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              title={item.label}
              className="relative p-2.5 rounded-full text-slate-400 hover:text-white transition-colors group"
            >
              {/* Neon Green Active indicator */}
              {isActive && (
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#8cf202] rounded-r-full shadow-[0_0_8px_#8cf202]" />
              )}
              <Icon
                className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-slate-400'
                }`}
              />

              {/* Tooltip on hover */}
              <span className="absolute left-full ml-3 px-2 py-1 bg-[#161a24] text-white text-[10px] font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/[0.08] shadow-lg">
                {item.label}
              </span>
            </Link>
          );
        })}

        <div className="w-5 h-[1px] bg-white/[0.08] my-1" />

        {/* Toggle Collapse */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand Dock' : 'Collapse Dock'}
          className="p-1.5 text-slate-500 hover:text-slate-300 transition"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>
    </aside>
  );
}
