import React, { useState } from 'react';
import { StudentAccount, StudentClass } from '../types';
import {
  getStoredStudentAccounts,
  saveStudentAccounts,
  saveCurrentStudentSession,
} from '../services/storageService';
import { saveCloudStudents } from '../services/cloudService';
import {
  User,
  Lock,
  Phone,
  GraduationCap,
  Sparkles,
  X,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (student: StudentAccount) => void;
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login form state
  const [loginIdOrPhone, setLoginIdOrPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regRoll, setRegRoll] = useState('');
  const [regClass, setRegClass] = useState<StudentClass>('Class 3');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regPhotoUrl, setRegPhotoUrl] = useState('');

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setRegPhotoUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const accounts = getStoredStudentAccounts();
    const query = loginIdOrPhone.trim().toLowerCase();

    // Find student by ID or Phone or Roll
    const found = accounts.find(
      (a) =>
        (a.studentId.toLowerCase() === query ||
          a.phone.trim() === query ||
          a.roll.trim() === query) &&
        a.password.trim() === loginPassword.trim()
    );

    if (found) {
      saveCurrentStudentSession(found);
      onLoginSuccess(found);
      onClose();
    } else {
      setError(
        'স্টুডেন্ট আইডি/ফোন অথবা পাসওয়ার্ড সঠিক নয়। যদি এখনো একাউন্ট না খুলে থাকেন, তবে "নতুন একাউন্ট খুলুন" ট্যাবে ক্লিক করুন।'
      );
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!regName.trim() || !regRoll.trim() || !regPassword.trim()) {
      setError('অনুগ্রহ করে নাম, রোল এবং পাসওয়ার্ড সঠিকভাবে পূরণ করুন।');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('উভয় পাসওয়ার্ড একই হতে হবে।');
      return;
    }

    const accounts = getStoredStudentAccounts();

    // Check if ID or Roll already registered in same class
    const cleanId = regStudentId.trim() || `FQS-${new Date().getFullYear()}-${regRoll.padStart(2, '0')}`;
    const exists = accounts.find(
      (a) =>
        a.studentId.toLowerCase() === cleanId.toLowerCase() ||
        (a.roll === regRoll.trim() && a.class === regClass)
    );

    if (exists) {
      setError(
        `এই রোল নম্বর (${regRoll}) বা আইডির জন্য ইতিমধ্যে একাউন্ট খোলা আছে। অনুগ্রহ করে লগইন করুন।`
      );
      return;
    }

    const newStudent: StudentAccount = {
      id: `stu-${Date.now()}`,
      name: regName.trim(),
      studentId: cleanId,
      roll: regRoll.trim(),
      class: regClass,
      phone: regPhone.trim(),
      password: regPassword.trim(),
      createdAt: new Date().toISOString(),
      photoUrl: regPhotoUrl || undefined,
    };

    const updated = [newStudent, ...accounts];
    saveStudentAccounts(updated);
    saveCloudStudents(updated);
    saveCurrentStudentSession(newStudent);

    setSuccessMsg('আপনার স্টুডেন্ট একাউন্ট সফলভাবে তৈরি হয়েছে!');
    setTimeout(() => {
      onLoginSuccess(newStudent);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-stone-200 my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-900 rounded-full flex items-center justify-center mx-auto mb-2">
            <GraduationCap className="w-6 h-6 text-emerald-800" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">শিক্ষার্থী পোর্টাল</h3>
          <p className="text-xs text-stone-500 mt-0.5">
            ফুলকলি কুরআনিক স্কুল রেজাল্ট ও শিক্ষার্থী ড্যাশবোর্ড
          </p>
        </div>

        {/* Segment Tabs: Login vs Register */}
        <div className="flex rounded-xl bg-stone-100 p-1 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            স্টুডেন্ট লগইন (Login)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            নতুন একাউন্ট খুলুন (Register)
          </button>
        </div>

        {/* Error / Success Banners */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-xl text-xs flex items-start gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                স্টুডেন্ট আইডি / মোবাইল নম্বর / রোল
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="যেমন: FQS-2026-01 অথবা 017XXXXXXXX"
                  value={loginIdOrPhone}
                  onChange={(e) => setLoginIdOrPhone(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:bg-white"
                />
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                পাসওয়ার্ড / পিন কোড
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="পাসওয়ার্ড লিখুন..."
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:bg-white"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              <span>লগইন করে রেজাল্ট দেখুন</span>
            </button>

            <div className="pt-2 text-center text-xs text-stone-500">
              একাউন্ট নেই?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-emerald-800 font-bold underline cursor-pointer"
              >
                এখানে ক্লিক করে নতুন একাউন্ট খুলুন
              </button>
            </div>

            {/* Quick Demo Credentials hint */}
            <div className="mt-3 p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-[11px] text-stone-600">
              <span className="font-semibold text-stone-800">নমুনা টেস্ট লগইন:</span>
              <div className="mt-0.5">
                আইডি: <code className="font-mono font-bold text-emerald-800">FQS-2026-01</code> | পাসওয়ার্ড: <code className="font-mono font-bold">123</code>
              </div>
            </div>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                শিক্ষার্থীর পূর্ণ নাম *
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: মুহাম্মাদ তাহমিদ ইসলাম"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  শ্রেণি *
                </label>
                <select
                  value={regClass}
                  onChange={(e) => setRegClass(e.target.value as StudentClass)}
                  className="w-full px-2.5 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 font-medium"
                >
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

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  রোল নম্বর *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: 01"
                  value={regRoll}
                  onChange={(e) => setRegRoll(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  স্টুডেন্ট আইডি (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="FQS-2026-XX"
                  value={regStudentId}
                  onChange={(e) => setRegStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  অভিভাবকের ফোন *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  পাসওয়ার্ড তৈরি করুন *
                </label>
                <input
                  type="password"
                  required
                  placeholder="গোপন পাসওয়ার্ড"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  পাসওয়ার্ড নিশ্চিত করুন *
                </label>
                <input
                  type="password"
                  required
                  placeholder="পুনরায় পাসওয়ার্ড"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900"
                />
              </div>
            </div>

            {/* Optional Photo upload */}
            <div className="pt-1">
              <label className="block text-[11px] font-semibold text-stone-700 mb-1 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                <span>প্রোফাইল ছবি (গ্যালারি থেকে নির্বাচন, ঐচ্ছিক):</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="w-full text-xs text-stone-600 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-emerald-800 file:text-white cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-3 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>একাউন্ট তৈরি সম্পন্ন করুন</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
