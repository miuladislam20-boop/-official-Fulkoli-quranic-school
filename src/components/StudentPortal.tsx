import React, { useState, useMemo } from 'react';
import { StudentAccount, StudentResult, SchoolInfo } from '../types';
import {
  saveStudentAccounts,
  getStoredStudentAccounts,
  saveCurrentStudentSession,
  exportResultToWord,
} from '../services/storageService';
import { toBengaliNumber } from '../utils/gradeCalculator';
import { SchoolLogo } from './common/SchoolLogo';
import {
  User,
  GraduationCap,
  Award,
  Calendar,
  Printer,
  FileText,
  LogOut,
  Key,
  Phone,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface StudentPortalProps {
  student: StudentAccount;
  results: StudentResult[];
  schoolInfo: SchoolInfo;
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  student,
  results,
  schoolInfo,
  onLogout,
  onNavigateHome,
}) => {
  // Find all results matching this student
  const studentResults = useMemo(() => {
    return results.filter((r) => {
      const matchId =
        r.studentId &&
        student.studentId &&
        r.studentId.toLowerCase() === student.studentId.toLowerCase();

      const matchRollClass =
        r.roll.trim() === student.roll.trim() &&
        r.class.toLowerCase() === student.class.toLowerCase();

      const matchName =
        r.name.trim().toLowerCase() === student.name.trim().toLowerCase();

      return matchId || matchRollClass || matchName;
    });
  }, [results, student]);

  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);

  const activeResult = useMemo(() => {
    if (selectedResultId) {
      const found = studentResults.find((r) => r.id === selectedResultId);
      if (found) return found;
    }
    return studentResults.length > 0 ? studentResults[0] : null;
  }, [studentResults, selectedResultId]);

  // Password change state
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passMsg, setPassMsg] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;

    const all = getStoredStudentAccounts();
    const updated = all.map((s) =>
      s.id === student.id ? { ...s, password: newPassword.trim() } : s
    );
    saveStudentAccounts(updated);
    saveCurrentStudentSession({ ...student, password: newPassword.trim() });

    setPassMsg('পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!');
    setNewPassword('');
    setTimeout(() => {
      setIsChangingPass(false);
      setPassMsg('');
    }, 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-8 sm:py-12 bg-stone-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Student Welcome Header Card */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 no-print">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 border-2 border-amber-400 overflow-hidden shrink-0 flex items-center justify-center shadow-md">
              {student.photoUrl ? (
                <img
                  src={student.photoUrl}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-emerald-200" />
              )}
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>ব্যক্তিগত শিক্ষার্থী ড্যাশবোর্ড</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                আসসালামু আলাইকুম, {student.name}!
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-200 mt-1">
                <span>শ্রেণি: {student.class}</span>
                <span aria-hidden="true">·</span>
                <span>রোল: {toBengaliNumber(student.roll)}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">আইডি: {student.studentId}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsChangingPass(!isChangingPass)}
              className="px-3 py-2 bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 text-xs font-semibold rounded-lg transition-colors border border-emerald-700/60 flex items-center gap-1.5 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-amber-300" />
              <span>পাসওয়ার্ড পরিবর্তন</span>
            </button>
            <button
              onClick={onLogout}
              className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-red-300" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>

        {/* Password change modal / dropdown */}
        {isChangingPass && (
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm mb-6 max-w-md ml-auto no-print">
            <h4 className="text-xs font-bold text-stone-900 mb-2">নতুন পাসওয়ার্ড নির্ধারণ করুন</h4>
            {passMsg && (
              <div className="text-xs text-emerald-800 bg-emerald-50 p-2 rounded mb-2">
                {passMsg}
              </div>
            )}
            <form onSubmit={handlePasswordChange} className="flex items-center gap-2">
              <input
                type="password"
                required
                placeholder="নতুন পাসওয়ার্ড"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-900 cursor-pointer"
              >
                সংরক্ষণ
              </button>
            </form>
          </div>
        )}

        {/* Main Content: Left Column (Exams list) + Right Column (Full Marksheet) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Student Virtual ID Card & Available Exams */}
          <div className="lg:col-span-4 space-y-6 no-print">
            {/* Digital Student ID Badge Card */}
            <div className="bg-white rounded-2xl border-2 border-emerald-800 p-5 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-2 bg-emerald-800" />
              <SchoolLogo
                src={schoolInfo.logoUrl}
                alt="School Logo"
                className="w-12 h-12 rounded-full mx-auto mb-2 object-cover border border-emerald-300"
                fallbackSize="md"
              />
              <div className="text-xs font-bold text-emerald-950 uppercase tracking-tight">
                {schoolInfo.nameBangla}
              </div>
              <div className="text-[10px] text-stone-500 mb-4">ডিজিটাল স্টুডেন্ট কার্ড</div>

              <div className="space-y-1.5 text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200 text-left">
                <div className="flex justify-between">
                  <span className="text-stone-500">নাম:</span>
                  <span className="font-bold text-stone-900">{student.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">স্টুডেন্ট আইডি:</span>
                  <span className="font-mono font-bold text-emerald-900">{student.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">শ্রেণি ও রোল:</span>
                  <span className="font-semibold text-stone-800">
                    {student.class} | রোল: {toBengaliNumber(student.roll)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">মোবাইল:</span>
                  <span className="font-mono text-stone-800">{student.phone}</span>
                </div>
              </div>
            </div>

            {/* List of Student's Exams */}
            <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>আমার পরীক্ষার ফলাফলসমূহ</span>
                <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                  {studentResults.length} টি পরীক্ষা
                </span>
              </h3>

              {studentResults.length > 0 ? (
                <div className="space-y-2">
                  {studentResults.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedResultId(r.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        activeResult?.id === r.id
                          ? 'bg-emerald-50 border-emerald-600 shadow-xs'
                          : 'bg-white border-stone-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-stone-900">
                          {r.examType === 'Weekly'
                            ? 'সাপ্তাহিক মূল্যায়ন'
                            : r.examType === 'Monthly'
                            ? 'মাসিক পরীক্ষা'
                            : 'বার্ষিক পরীক্ষা'}
                        </span>
                        <span className="text-stone-500 font-mono">{r.year}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-stone-600">
                        <span>মোট: {toBengaliNumber(r.totalMarks)}/{toBengaliNumber(r.totalFullMarks)}</span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                            r.resultStatus === 'Pass'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          গ্রেড: {r.grade}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-stone-500 py-4 text-center">
                  আপনার আইডিতে এখনো কোনো পরীক্ষার ফলাফল যুক্ত করা হয়নি। রেজাল্ট প্রকাশ হলে এখানে সরাসরি দেখতে পাবেন।
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Full Official Marksheet Display */}
          <div className="lg:col-span-8">
            {activeResult ? (
              <div className="print-card bg-white rounded-2xl border-2 border-emerald-800/80 shadow-md p-6 sm:p-8 relative">
                {/* Official Marksheet Header */}
                <div className="text-center pb-6 border-b-2 border-emerald-900/20">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <SchoolLogo
                      src={schoolInfo.logoUrl}
                      alt="School Logo"
                      className="w-14 h-14 rounded-full object-cover border border-emerald-700/30"
                      fallbackSize="lg"
                    />
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 tracking-tight">
                        {schoolInfo.nameBangla}
                      </h2>
                      <div className="text-xs sm:text-sm font-semibold text-amber-800 tracking-wider">
                        {schoolInfo.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-stone-600 mt-1">
                    {schoolInfo.address} | ফোন: {schoolInfo.phone}
                  </div>
                  <div className="inline-block mt-3 px-4 py-1 bg-emerald-900 text-white text-xs sm:text-sm font-bold tracking-wide rounded-md">
                    শিক্ষার্থী একাডেমিক মার্কশিট ও প্রগ্রেস রিপোর্ট
                  </div>
                </div>

                {/* Student Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 px-4 my-5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                  <div>
                    <span className="text-stone-500 block">শিক্ষার্থীর নাম</span>
                    <span className="font-bold text-stone-900 text-sm">{activeResult.name}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">স্টুডেন্ট আইডি (ID)</span>
                    <span className="font-semibold text-emerald-900 font-mono">
                      {activeResult.studentId}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">শ্রেণি ও রোল</span>
                    <span className="font-semibold text-stone-900">
                      {activeResult.class} | রোল: {toBengaliNumber(activeResult.roll)} ({activeResult.roll})
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">পরীক্ষার ধরন</span>
                    <span className="font-semibold text-stone-900">
                      {activeResult.examType === 'Weekly'
                        ? 'সাপ্তাহিক মূল্যায়ন'
                        : activeResult.examType === 'Monthly'
                        ? 'মাসিক পরীক্ষা'
                        : 'বার্ষিক পরীক্ষা'}{' '}
                      ({activeResult.year})
                    </span>
                  </div>
                </div>

                {/* Subject-Wise Marks Table */}
                <div className="overflow-x-auto my-6">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-emerald-900 text-white text-xs font-semibold">
                        <th className="py-2.5 px-3 border border-emerald-800">ক্রমিক</th>
                        <th className="py-2.5 px-3 border border-emerald-800">বিষয় (Subject)</th>
                        <th className="py-2.5 px-3 border border-emerald-800 text-center">পূর্ণমান</th>
                        <th className="py-2.5 px-3 border border-emerald-800 text-center">প্রাপ্ত নম্বর</th>
                        <th className="py-2.5 px-3 border border-emerald-800 text-center">শতকরা (%)</th>
                        <th className="py-2.5 px-3 border border-emerald-800 text-center">গ্রেড</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {activeResult.subjects.map((sub, idx) => {
                        const subPercent =
                          sub.fullMarks > 0
                            ? Number(((sub.marks / sub.fullMarks) * 100).toFixed(1))
                            : 0;
                        let subGrade = 'F';
                        if (subPercent >= 80) subGrade = 'A+';
                        else if (subPercent >= 70) subGrade = 'A';
                        else if (subPercent >= 60) subGrade = 'A-';
                        else if (subPercent >= 50) subGrade = 'B';
                        else if (subPercent >= 40) subGrade = 'C';
                        else if (subPercent >= 33) subGrade = 'D';

                        return (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                            <td className="py-2.5 px-3 border border-stone-200 text-stone-600 font-mono text-center">
                              {toBengaliNumber(idx + 1)}
                            </td>
                            <td className="py-2.5 px-3 border border-stone-200 font-semibold text-stone-800">
                              {sub.subjectName}
                            </td>
                            <td className="py-2.5 px-3 border border-stone-200 text-center font-mono tabular-nums text-stone-600">
                              {toBengaliNumber(sub.fullMarks)} ({sub.fullMarks})
                            </td>
                            <td className="py-2.5 px-3 border border-stone-200 text-center font-bold font-mono tabular-nums text-emerald-950">
                              {toBengaliNumber(sub.marks)} ({sub.marks})
                            </td>
                            <td className="py-2.5 px-3 border border-stone-200 text-center font-mono tabular-nums text-stone-700">
                              {toBengaliNumber(subPercent)}%
                            </td>
                            <td className="py-2.5 px-3 border border-stone-200 text-center font-bold">
                              <span
                                className={`px-2 py-0.5 rounded text-xs ${
                                  subGrade === 'F' ? 'text-red-700 bg-red-50' : 'text-emerald-800 bg-emerald-50'
                                }`}
                              >
                                {subGrade}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-stone-100 font-bold text-stone-900 border-t-2 border-stone-300">
                        <td colSpan={2} className="py-3 px-3 border border-stone-300 text-right">
                          মোট ফলাফল:
                        </td>
                        <td className="py-3 px-3 border border-stone-300 text-center font-mono tabular-nums">
                          {toBengaliNumber(activeResult.totalFullMarks)}
                        </td>
                        <td className="py-3 px-3 border border-stone-300 text-center text-emerald-900 text-base font-mono tabular-nums">
                          {toBengaliNumber(activeResult.totalMarks)}
                        </td>
                        <td className="py-3 px-3 border border-stone-300 text-center font-mono tabular-nums">
                          {toBengaliNumber(activeResult.percentage)}%
                        </td>
                        <td className="py-3 px-3 border border-stone-300 text-center text-emerald-900 text-base">
                          {activeResult.grade}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Score Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
                    <div className="text-[11px] text-stone-500">মোট প্রাপ্ত নম্বর</div>
                    <div className="text-xl font-bold text-emerald-900 font-mono">
                      {toBengaliNumber(activeResult.totalMarks)} / {toBengaliNumber(activeResult.totalFullMarks)}
                    </div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
                    <div className="text-[11px] text-stone-500">শতকরা হার</div>
                    <div className="text-xl font-bold text-stone-900 font-mono">
                      {toBengaliNumber(activeResult.percentage)}%
                    </div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
                    <div className="text-[11px] text-stone-500">লেটার গ্রেড ও জিপিএ</div>
                    <div className="text-xl font-bold text-amber-700">
                      {activeResult.grade} ({toBengaliNumber(activeResult.gradePoint.toFixed(2))})
                    </div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
                    <div className="text-[11px] text-stone-500">ফলাফল</div>
                    <div className="text-xl font-bold flex items-center justify-center gap-1">
                      {activeResult.resultStatus === 'Pass' ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-5 h-5" />
                          <span>কৃতকার্য</span>
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center gap-1">
                          <XCircle className="w-5 h-5" />
                          <span>অকৃতকার্য</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remarks */}
                {activeResult.remarks && (
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-950 mb-6">
                    <span className="font-bold">শিক্ষকের মূল্যায়ন ও মন্তব্য: </span>
                    <span>{activeResult.remarks}</span>
                  </div>
                )}

                {/* Signatures & Seal Area */}
                <div className="pt-12 mt-6 border-t border-dashed border-stone-300 grid grid-cols-3 gap-4 text-center text-xs text-stone-600">
                  <div>
                    <div className="w-24 h-0.5 bg-stone-400 mx-auto mb-1.5" />
                    <span>শ্রেণি শিক্ষকের স্বাক্ষর</span>
                  </div>
                  <div>
                    <div className="w-16 h-16 rounded-full border-2 border-emerald-900/30 mx-auto flex items-center justify-center text-[10px] text-emerald-900 font-bold uppercase tracking-tight">
                      স্কুল সিলমোহর
                    </div>
                  </div>
                  <div>
                    <div className="w-24 h-0.5 bg-stone-400 mx-auto mb-1.5" />
                    <span className="font-semibold text-stone-900">অধ্যক্ষ / প্রধান শিক্ষক</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
                  <div className="text-xs text-stone-500">
                    তারিখ: {new Date().toLocaleDateString('bn-BD')} | সনদ যাচাইকৃত
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => exportResultToWord(activeResult, schoolInfo)}
                      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                      title="মার্কশিট Word (.doc) ফাইল হিসেবে ডাউনলোড করুন"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-200" />
                      <span>Word ফাইলে ডাউনলোড (.doc)</span>
                    </button>

                    <button
                      onClick={handlePrint}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-300" />
                      <span>প্রিন্ট মার্কশিট (Print)</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-xs">
                <BookOpen className="w-12 h-12 text-stone-400 mx-auto mb-3" />
                <h3 className="font-bold text-stone-900 text-base mb-1">
                  কোনো পরীক্ষার ফলাফল নির্বাচিত করা হয়নি
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  বামপাশের তালিকা থেকে আপনি যে পরীক্ষার ফলাফল দেখতে চান সেটিতে ক্লিক করুন।
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
