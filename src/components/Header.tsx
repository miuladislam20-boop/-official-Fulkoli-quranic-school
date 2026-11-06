import React, { useState } from 'react';
import { SchoolInfo, StudentAccount } from '../types';
import { Phone, Shield, Menu, X, BookOpen, User, LogOut, Sparkles } from 'lucide-react';
import { SchoolLogo } from './common/SchoolLogo';

interface HeaderProps {
  schoolInfo: SchoolInfo;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminLoggedIn: boolean;
  onOpenAdminModal: () => void;
  onLogoutAdmin: () => void;
  loggedInStudent: StudentAccount | null;
  onOpenStudentAuth: () => void;
  onLogoutStudent: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  schoolInfo,
  activeTab,
  setActiveTab,
  isAdminLoggedIn,
  onOpenAdminModal,
  onLogoutAdmin,
  loggedInStudent,
  onOpenStudentAuth,
  onLogoutStudent,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'হোম' },
    { id: 'results', label: 'ফলাফল (Result)' },
    { id: 'teachers', label: 'শিক্ষকবৃন্দ' },
    { id: 'admission', label: 'ভর্তি তথ্য' },
    { id: 'notices', label: 'নোটিশ' },
    { id: 'about', label: 'পরিচিতি' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs no-print">
      {/* Top micro contact bar */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">{schoolInfo.address}</span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span>স্থাপিত: {schoolInfo.established}</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${schoolInfo.phone}`}
              className="flex items-center gap-1.5 hover:text-white font-medium transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-300" />
              <span>{schoolInfo.phone}</span>
            </a>

            {/* Student Auth status on top bar */}
            {loggedInStudent ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('student-portal')}
                  className="text-amber-300 hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <User className="w-3 h-3" />
                  <span>{loggedInStudent.name} (আমার রেজাল্ট)</span>
                </button>
                <button
                  onClick={onLogoutStudent}
                  className="text-stone-400 hover:text-white text-[11px] underline cursor-pointer"
                >
                  লগআউট
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenStudentAuth}
                className="flex items-center gap-1 text-amber-300 hover:text-white transition-colors cursor-pointer font-medium"
              >
                <User className="w-3 h-3 text-amber-400" />
                <span>স্টুডেন্ট একাউন্ট</span>
              </button>
            )}

            {/* Admin toggle on top bar */}
            {isAdminLoggedIn ? (
              <button
                onClick={onLogoutAdmin}
                className="text-amber-200 hover:text-white underline cursor-pointer"
              >
                লগআউট (Admin)
              </button>
            ) : (
              <button
                onClick={onOpenAdminModal}
                className="flex items-center gap-1 text-emerald-300 hover:text-white transition-colors cursor-pointer"
              >
                <Shield className="w-3 h-3 text-amber-400" />
                <span className="hidden xs:inline">অ্যাডমিন</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Top Bar - strict 3-zone contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left focus:outline-hidden group cursor-pointer"
        >
          <SchoolLogo
            src={schoolInfo.logoUrl}
            alt="Fulkoli Logo"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-emerald-700/20 shadow-xs"
            fallbackSize="md"
          />
          <div className="leading-tight">
            <div className="text-base sm:text-lg font-bold text-emerald-950 tracking-tight whitespace-nowrap group-hover:text-emerald-800 transition-colors">
              {schoolInfo.nameBangla}
            </div>
            <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider whitespace-nowrap">
              {schoolInfo.name}
            </div>
          </div>
        </button>

        {/* Zone 2: Clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-700">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-emerald-800 py-1 border-b-2 cursor-pointer ${
                activeTab === link.id
                  ? 'border-emerald-700 text-emerald-900 font-semibold'
                  : 'border-transparent text-stone-600'
              }`}
            >
              {link.label}
            </button>
          ))}

          {loggedInStudent && (
            <button
              onClick={() => handleNavClick('student-portal')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer font-bold ${
                activeTab === 'student-portal'
                  ? 'border-amber-600 text-amber-900'
                  : 'border-transparent text-emerald-900'
              }`}
            >
              আমার পোর্টাল
            </button>
          )}

          {isAdminLoggedIn && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
                activeTab === 'admin'
                  ? 'border-amber-600 text-amber-900 font-bold'
                  : 'border-transparent text-amber-700 font-semibold'
              }`}
            >
              ড্যাশবোর্ড (Admin)
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Action buttons */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {loggedInStudent ? (
            <button
              onClick={() => handleNavClick('student-portal')}
              className="px-3.5 py-2 text-xs font-semibold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>আমার রেজাল্ট দেখুন</span>
            </button>
          ) : (
            <button
              onClick={onOpenStudentAuth}
              className="px-3.5 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-emerald-700" />
              <span>স্টুডেন্ট একাউন্ট</span>
            </button>
          )}

          <button
            onClick={() => handleNavClick('results')}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>ফলাফল খুঁজুন</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          {loggedInStudent ? (
            <button
              onClick={() => handleNavClick('student-portal')}
              className="px-2.5 py-1.5 text-xs font-semibold text-stone-900 bg-amber-400 rounded-lg whitespace-nowrap cursor-pointer"
            >
              আমার রেজাল্ট
            </button>
          ) : (
            <button
              onClick={onOpenStudentAuth}
              className="px-2.5 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-100 rounded-lg whitespace-nowrap cursor-pointer"
            >
              লগইন
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-700 hover:text-emerald-800 focus:outline-hidden"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-1 shadow-md">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                activeTab === link.id
                  ? 'bg-emerald-50 text-emerald-900 font-semibold'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              {link.label}
            </button>
          ))}

          {loggedInStudent ? (
            <button
              onClick={() => handleNavClick('student-portal')}
              className="w-full text-left px-3 py-2 text-sm rounded-md bg-amber-50 text-amber-950 font-bold flex items-center justify-between"
            >
              <span>আমার স্টুডেন্ট পোর্টাল ({loggedInStudent.name})</span>
              <User className="w-4 h-4 text-amber-600" />
            </button>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenStudentAuth();
              }}
              className="w-full text-left px-3 py-2 text-sm rounded-md bg-emerald-50 text-emerald-950 font-bold flex items-center justify-between"
            >
              <span>স্টুডেন্ট একাউন্ট খুলুন / লগইন করুন</span>
              <User className="w-4 h-4 text-emerald-700" />
            </button>
          )}

          {isAdminLoggedIn ? (
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full text-left px-3 py-2 text-sm rounded-md bg-stone-100 text-stone-900 font-bold"
            >
              অ্যাডমিন ড্যাশবোর্ড
            </button>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminModal();
              }}
              className="w-full text-left px-3 py-2 text-sm rounded-md text-stone-600 hover:bg-stone-50 flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span>অ্যাডমিন প্রবেশ</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
