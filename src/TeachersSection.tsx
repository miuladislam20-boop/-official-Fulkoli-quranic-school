import React from 'react';
import { Teacher, SchoolInfo } from '../types';
import { Phone, Award, User, GraduationCap } from 'lucide-react';

interface TeachersSectionProps {
  teachers: Teacher[];
  schoolInfo: SchoolInfo;
  onOpenAdminModal?: () => void;
  isAdminLoggedIn?: boolean;
}

export const TeachersSection: React.FC<TeachersSectionProps> = ({
  teachers,
  schoolInfo,
  onOpenAdminModal,
  isAdminLoggedIn,
}) => {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-stone-200">
          <div>
            <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
              আমাদের শিক্ষক পরিষদ
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              সম্মানিত শিক্ষক ও শিক্ষিকাবৃন্দ
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              কুরআন-সুন্নাহ ও আধুনিক শিক্ষায় সুদক্ষ, যত্নশীল ও নিবেদিতপ্রাণ শিক্ষকমণ্ডলী দ্বারা পাঠদান পরিচালিত হয়।
            </p>
          </div>
          {isAdminLoggedIn ? (
            <div className="text-xs text-amber-700 font-semibold bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
              অ্যাডমিন মোড সক্রিয়: ড্যাশবোর্ড থেকে নতুন শিক্ষক যোগ বা ছবি পরিবর্তন করতে পারবেন
            </div>
          ) : (
            <a
              href={`tel:${schoolInfo.phone}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs rounded-lg transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>যোগাযোগ: {schoolInfo.phone}</span>
            </a>
          )}
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher, idx) => (
            <div
              key={teacher.id || idx}
              className="bg-stone-50 rounded-xl border border-stone-200 overflow-hidden hover:border-emerald-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  {/* Photo or Portrait fallback */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 border-2 border-emerald-700/20 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                    {teacher.photoUrl ? (
                      <img
                        src={teacher.photoUrl}
                        alt={teacher.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="text-emerald-800 font-bold text-lg flex items-center justify-center">
                        <User className="w-8 h-8 text-emerald-700/60" />
                      </div>
                    )}
                  </div>

                  {/* Teacher Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-stone-900 text-base leading-snug truncate">
                      {teacher.name}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                      {teacher.designation}
                    </p>
                    {teacher.subjectSpeciality && (
                      <div className="text-[11px] text-amber-800 font-medium mt-1">
                        {teacher.subjectSpeciality}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 pt-3 border-t border-stone-200">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{teacher.qualifications || 'উচ্চতর সনদপ্রাপ্ত'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="font-mono text-stone-700">{teacher.mobile || schoolInfo.phone}</span>
                  </div>
                </div>
              </div>

              {/* Action: Call Now Button */}
              <div className="p-3 bg-white border-t border-stone-200">
                <a
                  href={`tel:${teacher.mobile || schoolInfo.phone}`}
                  className="w-full py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-300" />
                  <span>Call Now (সরাসরি কল করুন)</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
