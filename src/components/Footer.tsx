import React from 'react';
import { Film, Shield, Clock, Award, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs mt-20">
      {/* Value props */}
      <div className="border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-rose-500">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">24/7 Instant Booking</h4>
              <p className="text-slate-400 mt-0.5">Real-time seat reservations & mobile tickets</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">100% Safe Payments</h4>
              <p className="text-slate-400 mt-0.5">Encrypted UPI, Cards, and Net Banking</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Verified Theatres</h4>
              <p className="text-slate-400 mt-0.5">IMAX, 4DX, Dolby Atmos & Premium Recliners</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-rose-500" />
          <span className="text-white font-semibold">BookShow Platform</span>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </div>
        <p className="flex items-center gap-1 text-slate-500">
          Built for seamless movie reservations
        </p>
      </div>
    </footer>
  );
}
