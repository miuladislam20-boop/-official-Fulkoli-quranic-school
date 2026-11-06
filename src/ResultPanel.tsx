import React, { useState, useMemo } from 'react';
import { StudentResult, SchoolInfo, ExamType } from '../types';
import { toBengaliNumber } from '../utils/gradeCalculator';
import { exportResultToWord } from '../services/storageService';
import { SchoolLogo } from './common/SchoolLogo';
import {
  Search,
  Printer,
  Award,
  CheckCircle2,
  XCircle,
  FileText,
  Calendar,
  User,
  GraduationCap,
  Sparkles,
  Download,
} from 'lucide-react';

interface ResultPanelProps {
  results: StudentResult[];
  schoolInfo: SchoolInfo;
  initialSearchQuery?: { studentId?: string; roll?: string; studentClass?: string };
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  results,
  schoolInfo,
  initialSearchQuery,
}) => {
  const [searchTerm, setSearchTerm] = useState(
    initialSearchQuery?.studentId || initialSearchQuery?.roll || ''
  );
  const [selectedClass, setSelectedClass] = useState<string>(
    initialSearchQuery?.studentClass || 'All'
  );
  const [selectedExamType, setSelectedExamType] = useState<string>('All');
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);

  // Filter matched results
  const matchingResults = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return results.filter((r) => {
      const matchSearch =
        !term ||
        r.studentId.toLowerCase().includes(term) ||
        r.roll.toLowerCase().includes(term) ||
        r.name.toLowerCase().includes(term);

      const matchClass = selectedClass === 'All' || r.class === selectedClass;
      const matchExam = selectedExamType === 'All' || r.examType === selectedExamType;

      return matchSearch && matchClass && matchExam;
    });
  }, [results, searchTerm, selectedClass, selectedExamType]);

  // Active result to display in full marksheet
  const activeResult = useMemo(() => {
    if (selectedResultId) {
      const found = results.find((r) => r.id === selectedResultId);
      if (found) return found;
    }
    return matchingResults.length > 0 ? matchingResults[0] : null;
  }, [results, selectedResultId, matchingResults]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-8 sm:py-12 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 no-print">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>ডিজিটাল ফলাফল ও মার্কশিট পোর্টাল</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
            শিক্ষার্থী পরীক্ষার ফলাফল অনুসন্ধান
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            সাপ্তাহিক মূল্যায়ন, মাসিক পরীক্ষা ও বার্ষিক পরীক্ষার বিষয়ভিত্তিক পূর্ণাঙ্গ ফলাফল
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs mb-8 no-print">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
            {/* Search Input */}
            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                স্টুডেন্ট আইডি / রোল নম্বর / নাম
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="যেমন: FQS-2026-01 অথবা 01 অথবা তাহমিদ"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:bg-white"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Class Filter */}
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-stone-700 mb-1">শ্রেণি</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:bg-white"
              >
                <option value="All">সকল শ্রেণি</option>
                <option value="Play Group">Play Group</option>
                <option value="Nursery">Nursery</option>
                <option value="KG">KG</option>
                <option value="Class 1">Class 1</option>
                <option value="Class 2">Class 2</option>
                <option value="Class 3">Class 3</option>
                <option value="Class 4">Class 4</option>
                <option value="Class 5">Class 5</option>
                <option value="Hifz Section">Hifz Section</option>
              </select>
            </div>

            {/* Exam Type Segment */}
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-stone-700 mb-1">পরীক্ষার ধরন</label>
              <select
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:bg-white font-medium"
              >
                <option value="All">সকল পরীক্ষা</option>
                <option value="Monthly">মাসিক পরীক্ষা (Monthly)</option>
                <option value="Weekly">সাপ্তাহিক পরীক্ষা (Weekly)</option>
                <option value="Annual">বার্ষিক পরীক্ষা (Annual)</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Tags / Hints */}
          <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
            <div>
              পাওয়া গেছে: <span className="font-semibold text-stone-800">{matchingResults.length}</span> টি ফলাফল রেকর্ড
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-emerald-700 hover:text-emerald-900 underline font-medium cursor-pointer"
              >
                অনুসন্ধান রিসেট করুন
              </button>
            )}
          </div>
        </div>

        {/* Results Area */}
        {activeResult ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* If multiple results match, list on left sidebar */}
            {matchingResults.length > 1 && (
              <div className="lg:col-span-4 space-y-3 no-print">
                <h3 className="text-sm font-bold text-stone-800 px-1">
                  শিক্ষার্থীর পরীক্ষার তালিকা ({matchingResults.length})
                </h3>
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {matchingResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedResultId(item.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                        activeResult.id === item.id
                          ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                          : 'bg-white border-stone-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                        <span className="font-semibold text-emerald-800">{item.class}</span>
                        <span>{item.examType} Exam</span>
                      </div>
                      <div className="font-bold text-stone-900 text-sm">{item.name}</div>
                      <div className="flex items-center justify-between text-xs text-stone-600 mt-2">
                        <span>আইডি: {item.studentId} | রোল: {item.roll}</span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                            item.resultStatus === 'Pass'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          গ্রেড: {item.grade}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Official Marksheet Document (Printable) */}
            <div
              className={`${
                matchingResults.length > 1 ? 'lg:col-span-8' : 'lg:col-span-12'
              } print-card bg-white rounded-2xl border-2 border-emerald-800/80 shadow-md p-6 sm:p-8 relative`}
            >
              {/* Marksheet Print Header */}
              <div className="text-center pb-6 border-b-2 border-emerald-900/20">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <SchoolLogo
                    src={schoolInfo.logoUrl}
                    alt="School Logo"
                    className="w-14 h-14 rounded-full object-cover border border-emerald-700/30"
                    fallbackSize="lg"
                  />
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-emerald-950 tracking-tight">
                      {schoolInfo.nameBangla}
                    </h1>
                    <div className="text-xs sm:text-sm font-semibold text-amber-800 tracking-wider">
                      {schoolInfo.name}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-stone-600 mt-1">
                  {schoolInfo.address} | ফোন: {schoolInfo.phone}
                </div>
                <div className="inline-block mt-3 px-4 py-1 bg-emerald-900 text-white text-xs sm:text-sm font-bold tracking-wide rounded-md">
                  অফিসিয়াল একাডেমিক মার্কশিট ও প্রগ্রেস রিপোর্ট
                </div>
              </div>

              {/* Student Metadata Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 px-4 my-5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <div>
                  <span className="text-stone-500 block">শিক্ষার্থীর নাম</span>
                  <span className="font-bold text-stone-900 text-sm">{activeResult.name}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">স্টুডেন্ট আইডি (ID)</span>
                  <span className="font-semibold text-emerald-900">{activeResult.studentId}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">শ্রেণি ও রোল</span>
                  <span className="font-semibold text-stone-900">
                    {activeResult.class} | রোল: {toBengaliNumber(activeResult.roll)} ({activeResult.roll})
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">পরীক্ষার ধরন ও সাল</span>
                  <span className="font-semibold text-stone-900">
                    {activeResult.examType === 'Weekly'
                      ? 'সাপ্তাহিক পরীক্ষা'
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
                      <th className="py-2.5 px-3 border border-emerald-800 text-center">পূর্ণমান (Full)</th>
                      <th className="py-2.5 px-3 border border-emerald-800 text-center">প্রাপ্ত নম্বর (Marks)</th>
                      <th className="py-2.5 px-3 border border-emerald-800 text-center">শতকরা (%)</th>
                      <th className="py-2.5 px-3 border border-emerald-800 text-center">গ্রেড (Grade)</th>
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
                        মোট যোগফল:
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

              {/* Total & Grade Summary Cards */}
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
                  <div className="text-[11px] text-stone-500">চূড়ান্ত ফলাফল</div>
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

              {/* Action Bar (No-Print) */}
              <div className="mt-8 pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
                <div className="text-xs text-stone-500">
                  তারিখ: {new Date().toLocaleDateString('bn-BD')} | সনদ যাচাইকৃত
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => exportResultToWord(activeResult, schoolInfo)}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                    title="মাইক্রোসফট ওয়ার্ড (.doc) ফাইল হিসেবে মার্কশিটটি ডাউনলোড করুন"
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
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-base mb-1">কোনো ফলাফল পাওয়া যায়নি</h3>
            <p className="text-xs text-stone-600 mb-6">
              অনুগ্রহ করে শিক্ষার্থীর সঠিক রোল নম্বর বা স্টুডেন্ট আইডি দিয়ে পুনরায় অনুসন্ধান করুন।
            </p>
            <div className="bg-stone-50 p-4 rounded-lg text-xs text-left text-stone-600 space-y-1 mb-4 border border-stone-200">
              <div className="font-semibold text-stone-800">উদাহরণ হিসেবে দেখতে পারেন:</div>
              <div>• স্টুডেন্ট আইডি: <span className="font-mono text-emerald-800 font-semibold">FQS-2026-01</span> (তাহমিদ ইসলাম)</div>
              <div>• রোল নম্বর: <span className="font-mono text-emerald-800 font-semibold">02</span> (ফাতিমা জান্নাত, ৫ম শ্রেণি)</div>
            </div>
            <button
              onClick={() => {
                setSearchTerm('01');
                setSelectedClass('All');
                setSelectedExamType('All');
              }}
              className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            >
              নমুনা রেজাল্ট দেখুন (রোল ০১)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
