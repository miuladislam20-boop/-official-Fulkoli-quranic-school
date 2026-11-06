import React from 'react';
import { SchoolInfo } from '../types';
import { Phone, MapPin, Mail, Award, ArrowUp } from 'lucide-react';
import { SchoolLogo } from './common/SchoolLogo';

interface FooterProps {
  schoolInfo: SchoolInfo;
  onNavigate: (tab: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ schoolInfo, onNavigate, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-stone-800">
          {/* Col 1: Brand & Identity */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <SchoolLogo
                src={schoolInfo.logoUrl}
                alt="Fulkoli Logo"
                className="w-12 h-12 rounded-full object-cover border border-emerald-500/30"
                fallbackSize="lg"
              />
              <div>
                <div className="text-lg font-bold text-white tracking-tight">
                  {schoolInfo.nameBangla}
                </div>
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  {schoolInfo.name}
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm line-clamp-3">
              {schoolInfo.aboutHistory}
            </p>

            <div className="flex items-center gap-2 text-xs text-stone-400">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>ইআইআইএন / রেজি: {schoolInfo.eiinNumber}</span>
              <span aria-hidden="true">·</span>
              <span>স্থাপিত {schoolInfo.established}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">দ্রুত লিংক</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  হোম পেজ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('results')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  অনলাইন রেজাল্ট ও মার্কশিট
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('teachers')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  শিক্ষক-শিক্ষিকাবৃন্দ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admission')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  ভর্তি বিজ্ঞপ্তি ও ফরম
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('notices')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  নোটিশ বোর্ড
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  স্কুলের পরিচিতি ও ইতিহাস
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Address */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">যোগাযোগ ও ঠিকানা</h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{schoolInfo.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${schoolInfo.phone}`} className="hover:text-white font-mono">
                  {schoolInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{schoolInfo.email}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/88${schoolInfo.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors"
              >
                <span>WhatsApp-এ মেসেজ পাঠান</span>
              </a>
            </div>
          </div>
        </div>

        {/* Quiet Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {schoolInfo.established}—{new Date().getFullYear()} {schoolInfo.nameBangla} ({schoolInfo.name})। সর্বস্বত্ব সংরক্ষিত।
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              অ্যাডমিন পোর্টাল
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <span>উপরে যান</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
