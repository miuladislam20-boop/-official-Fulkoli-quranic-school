import React from 'react';
import { SchoolInfo } from '../types';
import { BookOpen, Check, Award, Heart, ShieldCheck, MapPin, Phone } from 'lucide-react';

interface AboutSectionProps {
  schoolInfo: SchoolInfo;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ schoolInfo }) => {
  const highlights = [
    'বিশুদ্ধ মাখরাজ ও তাজবীদ সহকারে সহীহ কুরআন শিক্ষা ও হিফজ।',
    'জাতীয় শিক্ষাক্রম অনুসারে মানসম্মত বাংলা, ইংরেজি ও গণিত শিক্ষা।',
    'শিশুর মানসিক ও শারীরিক বিকাশে আনন্দঘন পাঠদান পদ্ধতি।',
    'অভিজ্ঞ, স্নেহশীল ও নিবেদিতপ্রাণ শিক্ষক-শিক্ষিকা পরিষদ।',
    'নিয়মিত সাপ্তাহিক মূল্যায়ন ও মাসিক পরীক্ষার মাধ্যমে প্রগ্রেস পর্যবেক্ষণ।',
    'সুশৃঙ্খল পরিবেশ, সিসি ক্যামেরা ও সার্বক্ষণিক নিরাপত্তা ব্যবস্থা।',
  ];

  return (
    <div className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
            আমাদের প্রতিষ্ঠান সম্পর্কে
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {schoolInfo.nameBangla} পরিচিতি ও আদর্শ
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            {schoolInfo.address}-এ {schoolInfo.established} সাল থেকে আলোর দিশারী
          </p>
        </div>

        {/* 2-Column Story Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <div className="lg:col-span-6 space-y-5">
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
              কুরআনিক অনুশাসন ও আধুনিক জ্ঞান—দুইয়ের মেলবন্ধনে আমাদের পথচলা
            </h3>
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              {schoolInfo.aboutHistory}
            </p>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              আজকের শিশুই আগামী দিনের ভবিষ্যৎ। আমরা প্রতিটি ছাত্র-ছাত্রীকে কেবল পুঁথিগত বিদ্যায় নয়, বরং সততা, বিনয়, পিতা-মাতার প্রতি দায়িত্ববোধ ও খাঁটি দেশপ্রেমে উদ্বুদ্ধ করে গড়ে তুলি।
            </p>

            {/* Highlights List */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-stone-700">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="p-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-md">
              <img
                src={schoolInfo.learningSceneUrl}
                alt="Students studying at Fulkoli Quranic School"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent p-5 text-white">
                <div className="text-xs text-amber-300 font-semibold mb-1">
                  আনন্দময় পাঠদান ও আন্তরিক তত্ত্বাবধান
                </div>
                <div className="text-sm font-bold">
                  ফুলকলি কুরআনিক স্কুল শ্রেণিকক্ষ দৃশ্য
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Principal Message Box */}
        <div className="bg-stone-50 rounded-2xl p-6 sm:p-8 border border-stone-200 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-16 h-16 rounded-full bg-emerald-900 text-amber-400 flex items-center justify-center font-bold text-2xl shrink-0">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              অধ্যক্ষের বাণী
            </div>
            <p className="text-stone-700 text-sm leading-relaxed italic">
              "{schoolInfo.headmasterMessage}"
            </p>
            <div className="pt-2 text-xs">
              <div className="font-bold text-stone-900">{schoolInfo.headmasterName}</div>
              <div className="text-stone-500">প্রধান শিক্ষক ও অধ্যক্ষ, {schoolInfo.nameBangla}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
