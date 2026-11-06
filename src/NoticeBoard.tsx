import React, { useState } from 'react';
import { Notice, SchoolInfo } from '../types';
import { Bell, Calendar, Search, ChevronRight, X, Pin } from 'lucide-react';

interface NoticeBoardProps {
  notices: Notice[];
  schoolInfo: SchoolInfo;
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({ notices, schoolInfo }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNotice, setActiveNotice] = useState<Notice | null>(null);

  const categories = ['All', 'পরীক্ষা', 'ভর্তি', 'ছুটি', 'সাধারণ'];

  const filteredNotices = notices.filter((n) => {
    const matchCat = selectedCategory === 'All' || n.category === selectedCategory;
    const matchSearch =
      !searchQuery.trim() ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="py-10 sm:py-14 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/60 px-3 py-1 rounded-full mb-2">
            <Bell className="w-3.5 h-3.5 text-emerald-700" />
            <span>অফিসিয়াল বিজ্ঞপ্তি ও নোটিশ বোর্ড</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
            স্কুল নোটিশ বোর্ড
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            ভর্তি, পরীক্ষা, ফলাফল এবং একাডেমিক কার্যক্রমের সর্বশেষ ঘোষণা
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat === 'All' ? 'সকল নোটিশ' : cat}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="নোটিশ খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Notices List */}
        <div className="space-y-3.5">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => setActiveNotice(notice)}
              className={`p-5 rounded-xl border transition-all cursor-pointer bg-white hover:border-emerald-400 hover:shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                notice.isImportant ? 'border-amber-300 bg-amber-50/20' : 'border-stone-200'
              }`}
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs">
                  {notice.isImportant && (
                    <span className="flex items-center gap-1 text-amber-700 font-semibold">
                      <Pin className="w-3 h-3 fill-amber-700" />
                      <span>জরুরি</span>
                    </span>
                  )}
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                    {notice.category}
                  </span>
                  <span className="text-stone-400" aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 text-stone-500 font-mono">
                    <Calendar className="w-3 h-3" />
                    <span>{notice.date}</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-900 hover:text-emerald-900 transition-colors">
                  {notice.title}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {notice.details}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-1 text-xs font-semibold text-emerald-800">
                <span>সম্পূর্ণ পড়ুন</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}

          {filteredNotices.length === 0 && (
            <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-500 text-sm">
              কোনো নোটিশ পাওয়া যায়নি।
            </div>
          )}
        </div>

        {/* Notice Details Modal */}
        {activeNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => setActiveNotice(null)}
                className="absolute right-4 top-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs mb-3">
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded">
                  {activeNotice.category}
                </span>
                <span className="text-stone-400" aria-hidden="true">·</span>
                <span className="text-stone-500 font-mono flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{activeNotice.date}</span>
                </span>
              </div>

              <h3 className="text-xl font-bold text-stone-900 mb-4 leading-snug">
                {activeNotice.title}
              </h3>

              <div className="text-stone-700 text-sm leading-relaxed whitespace-pre-line bg-stone-50 p-4 rounded-xl border border-stone-200 mb-6 max-h-96 overflow-y-auto">
                {activeNotice.details}
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500 pt-3 border-t border-stone-200">
                <span>{schoolInfo.nameBangla} · {schoolInfo.address}</span>
                <button
                  onClick={() => setActiveNotice(null)}
                  className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
