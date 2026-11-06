import React, { useState } from 'react';
import { SchoolInfo } from '../types';
import { Search, Phone, BookOpen, GraduationCap, Award, MapPin, Sparkles } from 'lucide-react';

interface HeroProps {
  schoolInfo: SchoolInfo;
  onSearchStudent: (query: { studentId?: string; roll?: string; studentClass?: string }) => void;
  onNavigate: (tab: string) => void;
  onOpenStudentAuth?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  schoolInfo,
  onSearchStudent,
  onNavigate,
  onOpenStudentAuth,
}) => {
  const [quickQuery, setQuickQuery] = useState('');
  const [quickClass, setQuickClass] = useState('All');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    onSearchStudent({
      studentId: quickQuery.trim(),
      roll: quickQuery.trim(),
      studentClass: quickClass === 'All' ? undefined : quickClass,
    });
    onNavigate('results');
  };

  return (
    <section className="relative overflow-hidden bg-stone-900 text-white">
      {/* Background Image with Dark Emerald Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={schoolInfo.bannerUrl}
          alt="Fulkoli Quranic School Campus"
          className="w-full h-full object-cover opacity-35 filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/80 to-stone-950/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: School Title & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            {schoolInfo.tagline ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-amber-400/40 text-xs font-semibold text-amber-300 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{schoolInfo.tagline}</span>
              </div>
            ) : null}

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              {schoolInfo.nameBangla}
              <span className="block text-xl sm:text-2xl text-emerald-200 font-normal mt-2">
                {schoolInfo.name}
              </span>
            </h1>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              {schoolInfo.aboutHistory || 'সততা, সুশিক্ষা ও হিফজুল কুরআনের সমন্বয়ে আদর্শ মানুষ গড়ার বিশ্বস্ত প্রতিষ্ঠান।'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('admission')}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-semibold text-sm rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                <span>নতুন ভর্তি বিজ্ঞপ্তি ২০২৭</span>
              </button>

              <a
                href={`tel:${schoolInfo.phone}`}
                className="px-4 py-2.5 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 font-medium text-sm rounded-lg border border-emerald-700/60 transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>কল করুন: {schoolInfo.phone}</span>
              </a>
            </div>

            {/* Quiet feature metrics */}
            <div className="pt-4 border-t border-emerald-800/60 grid grid-cols-3 gap-4 text-xs text-stone-300">
              <div>
                <div className="font-semibold text-white text-base">১০০%</div>
                <div className="text-stone-400">বিশুদ্ধ কুরআন তেলাওয়াত</div>
              </div>
              <div>
                <div className="font-semibold text-white text-base">প্লে—৫ম</div>
                <div className="text-stone-400">জাতীয় শিক্ষাক্রম ও আরবি</div>
              </div>
              <div>
                <div className="font-semibold text-white text-base">ডিজিটাল</div>
                <div className="text-stone-400">অনলাইন রেজাল্ট ও মার্কশিট</div>
              </div>
            </div>
          </div>

          {/* Right Column: Instant Student Result Search Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl shadow-xl p-6 text-stone-900 border border-stone-100">
              <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-base">শিক্ষার্থী ফলাফল অনুসন্ধান</h3>
                  <p className="text-xs text-stone-500">স্টুডেন্ট আইডি অথবা রোল দিয়ে খুঁজুন</p>
                </div>
              </div>

              <form onSubmit={handleQuickSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    স্টুডেন্ট আইডি অথবা রোল নম্বর
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="যেমন: FQS-2026-01 অথবা 01"
                      value={quickQuery}
                      onChange={(e) => setQuickQuery(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all"
                      required
                    />
                    <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    শ্রেণি (ঐচ্ছিক)
                  </label>
                  <select
                    value={quickClass}
                    onChange={(e) => setQuickClass(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:bg-white"
                  >
                    <option value="All">সকল শ্রেণি</option>
                    <option value="Play Group">Play Group (প্লে গ্রুপ)</option>
                    <option value="Nursery">Nursery (নার্সারি)</option>
                    <option value="KG">KG (কেজি)</option>
                    <option value="Class 1">Class 1 (১ম শ্রেণি)</option>
                    <option value="Class 2">Class 2 (২য় শ্রেণি)</option>
                    <option value="Class 3">Class 3 (৩য় শ্রেণি)</option>
                    <option value="Class 4">Class 4 (৪র্থ শ্রেণি)</option>
                    <option value="Class 5">Class 5 (৫ম শ্রেণি)</option>
                    <option value="Hifz Section">Hifz Section (হিফজ শাখা)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <Search className="w-4 h-4 text-amber-300" />
                  <span>মার্কশিট অনুসন্ধান করুন</span>
                </button>
              </form>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <button
                  type="button"
                  onClick={onOpenStudentAuth}
                  className="text-amber-700 hover:text-amber-900 font-bold underline cursor-pointer"
                >
                  স্টুডেন্ট একাউন্ট খুলুন / লগইন
                </button>
                <button
                  onClick={() => onNavigate('results')}
                  className="text-emerald-700 hover:text-emerald-900 font-semibold underline cursor-pointer"
                >
                  বিস্তারিত রেজাল্ট পেজ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
