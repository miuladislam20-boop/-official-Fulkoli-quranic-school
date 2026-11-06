import React, { useState } from 'react';
import { SchoolInfo, AdmissionApplication } from '../types';
import { getStoredApplications, saveApplications } from '../services/storageService';
import { saveCloudApplications } from '../services/cloudService';
import {
  GraduationCap,
  Calendar,
  CheckCircle,
  FileCheck,
  Phone,
  Send,
  Download,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface AdmissionSectionProps {
  schoolInfo: SchoolInfo;
}

export const AdmissionSection: React.FC<AdmissionSectionProps> = ({ schoolInfo }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    motherName: '',
    phone: '',
    targetClass: 'Play Group',
    dob: '',
    address: 'ফুলবাড়ী, বগুড়া',
  });

  const [submittedApp, setSubmittedApp] = useState<AdmissionApplication | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName.trim() || !formData.phone.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newApp: AdmissionApplication = {
        id: `APP-${Date.now().toString().slice(-6)}`,
        studentName: formData.studentName.trim(),
        fatherName: formData.fatherName.trim(),
        motherName: formData.motherName.trim(),
        phone: formData.phone.trim(),
        targetClass: formData.targetClass,
        dob: formData.dob,
        address: formData.address.trim(),
        submittedAt: new Date().toISOString(),
        status: 'pending',
      };

      const existing = getStoredApplications();
      const updatedList = [newApp, ...existing];
      saveApplications(updatedList);
      saveCloudApplications(updatedList);

      setSubmittedApp(newApp);
      setIsSubmitting(false);
    }, 400);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="py-10 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
            <span>শিক্ষাবর্ষ ২০২৭ এ নতুন ভর্তি</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            ভর্তি বিজ্ঞপ্তি ও অনলাইন আবেদন
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            প্লে গ্রুপ থেকে ৫ম শ্রেণি এবং হিফজুল কুরআন বিভাগে সীমিত আসনে শিক্ষার্থী ভর্তি চলছে
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Admission Notice & Guidelines */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-stone-50 rounded-2xl p-6 sm:p-7 border border-stone-200">
              <h3 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-700" />
                <span>ভর্তি সংক্রান্ত নিয়মাবলী ও তথ্যাবলী</span>
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">ভর্তির সময়সীমা: </span>
                    <span>ফরম বিতরণ ও জমা প্রতিদিন সকাল ৮:০০ টা হতে বিকাল ৪:০০ টা পর্যন্ত।</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 mb-2">শাখা ও শ্রেণি বিন্যাস:</h4>
                  <ul className="grid grid-cols-2 gap-2 text-xs">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                      <span>প্লে গ্রুপ (Play Group)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                      <span>নার্সারি (Nursery)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                      <span>কেজি (KG)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                      <span>১ম থেকে ৫ম শ্রেণি</span>
                    </li>
                    <li className="flex items-center gap-1.5 col-span-2 text-emerald-900 font-semibold">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                      <span>হিফজুল কুরআন ও নাজেরা শাখা (বিশেষ যত্নসহ)</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2 border-t border-stone-200">
                  <h4 className="font-bold text-stone-900 mb-1.5">প্রয়োজনীয় কাগজপত্র:</h4>
                  <ul className="space-y-1 text-xs text-stone-600 list-disc list-inside">
                    <li>শিক্ষার্থীর অনলাইন জন্ম নিবন্ধন সনদের ফটোকপি।</li>
                    <li>পাসপোর্ট সাইজের রঙিন ছবি (২ কপি)।</li>
                    <li>পিতা ও মাতার জাতীয় পরিচয়পত্রের ফটোকপি।</li>
                    <li>পূর্ববর্তী স্কুলের ছাড়পত্র / প্রত্যয়নপত্র (যদি থাকে)।</li>
                  </ul>
                </div>

                <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
                  <span className="text-stone-500">সরাসরি অফিসে যোগাযোগের ঠিকানা:</span>
                  <span className="font-semibold text-stone-800">{schoolInfo.address}</span>
                </div>
              </div>
            </div>

            {/* Quick Contact Card */}
            <div className="bg-emerald-900 text-white rounded-xl p-5 flex items-center justify-between">
              <div>
                <div className="text-xs text-emerald-200">ভর্তি তথ্যের জন্য সরাসরি কল করুন</div>
                <div className="text-lg font-bold font-mono tracking-wide">{schoolInfo.phone}</div>
              </div>
              <a
                href={`tel:${schoolInfo.phone}`}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
            </div>
          </div>

          {/* Right Column: Online Admission Form or Confirmation Slip */}
          <div className="lg:col-span-6">
            {submittedApp ? (
              <div className="bg-white rounded-2xl border-2 border-emerald-800 p-6 sm:p-8 shadow-md">
                <div className="text-center pb-4 border-b border-stone-200">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900">ভর্তি আবেদন সফলভাবে গৃহীত হয়েছে!</h3>
                  <p className="text-xs text-stone-500 mt-1">
                    ফুলকলি কুরআনিক স্কুল কর্তৃপক্ষ শীঘ্রই আপনার সাথে ফোনে যোগাযোগ করবে।
                  </p>
                </div>

                {/* Admission Slip Details */}
                <div className="my-5 p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-stone-500">আবেদন ট্র্যাকিং নম্বর (App ID):</span>
                    <span className="font-bold text-emerald-900 font-mono">{submittedApp.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">শিক্ষার্থীর নাম:</span>
                    <span className="font-bold text-stone-900">{submittedApp.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">আবেদিত শ্রেণি:</span>
                    <span className="font-semibold text-stone-800">{submittedApp.targetClass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">পিতার নাম:</span>
                    <span className="text-stone-800">{submittedApp.fatherName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">অভিভাবকের মোবাইল:</span>
                    <span className="font-mono text-stone-800">{submittedApp.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">আবেদনের তারিখ:</span>
                    <span className="text-stone-700">
                      {new Date(submittedApp.submittedAt).toLocaleDateString('bn-BD')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handlePrintSlip}
                    className="flex-1 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>ভর্তি স্লিপ প্রিন্ট করুন</span>
                  </button>
                  <button
                    onClick={() => {
                      setSubmittedApp(null);
                      setFormData({
                        studentName: '',
                        fatherName: '',
                        motherName: '',
                        phone: '',
                        targetClass: 'Play Group',
                        dob: '',
                        address: 'ফুলবাড়ী, বগুড়া',
                      });
                    }}
                    className="py-2.5 px-4 border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    নতুন আবেদন করুন
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-stone-900">অনলাইন প্রাথমিক ভর্তি ফরম</h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    সহজে ঘরে বসেই আপনার সন্তানের প্রাথমিক ভর্তি ফরম পূরণ করুন
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      শিক্ষার্থীর পূর্ণ নাম *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: মুহাম্মাদ তাহমিদ ইসলাম"
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        পিতার নাম *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="পিতার নাম"
                        value={formData.fatherName}
                        onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        মাতার নাম
                      </label>
                      <input
                        type="text"
                        placeholder="মাতার নাম"
                        value={formData.motherName}
                        onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        অভিভাবকের মোবাইল নম্বর *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="যেমন: 017XXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        ভর্তি হতে ইচ্ছুক শ্রেণি *
                      </label>
                      <select
                        value={formData.targetClass}
                        onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                      >
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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        জন্ম তারিখ (ঐচ্ছিক)
                      </label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        বর্তমান ঠিকানা *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="যেমন: ফুলবাড়ী, বগুড়া"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>{isSubmitting ? 'জমা দেওয়া হচ্ছে...' : 'ভর্তি আবেদন সাবমিট করুন'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
