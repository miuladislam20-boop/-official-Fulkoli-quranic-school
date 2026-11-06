/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  SchoolInfo,
  Teacher,
  Notice,
  StudentResult,
  AdmissionApplication,
  StudentAccount,
} from './types';
import {
  getStoredSchoolInfo,
  getStoredTeachers,
  getStoredNotices,
  getStoredResults,
  getStoredApplications,
  getCurrentStudentSession,
  saveCurrentStudentSession,
} from './services/storageService';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ResultPanel } from './components/ResultPanel';
import { TeachersSection } from './components/TeachersSection';
import { NoticeBoard } from './components/NoticeBoard';
import { AdmissionSection } from './components/AdmissionSection';
import { AboutSection } from './components/AboutSection';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { StudentAuthModal } from './components/StudentAuthModal';
import { StudentPortal } from './components/StudentPortal';
import { Footer } from './components/Footer';
import { Phone, MessageCircle } from 'lucide-react';

export default function App() {
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(getStoredSchoolInfo);
  const [teachers, setTeachers] = useState<Teacher[]>(getStoredTeachers);
  const [notices, setNotices] = useState<Notice[]>(getStoredNotices);
  const [results, setResults] = useState<StudentResult[]>(getStoredResults);
  const [applications, setApplications] = useState<AdmissionApplication[]>(
    getStoredApplications
  );

  const [activeTab, setActiveTab] = useState<string>('home');

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('fqs_admin_auth') === 'true';
  });
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);

  // Student authentication state
  const [loggedInStudent, setLoggedInStudent] = useState<StudentAccount | null>(
    getCurrentStudentSession
  );
  const [studentAuthModalOpen, setStudentAuthModalOpen] = useState<boolean>(false);

  const [initialSearchQuery, setInitialSearchQuery] = useState<
    { studentId?: string; roll?: string; studentClass?: string } | undefined
  >(undefined);

  // Admin handlers
  const handleAdminSuccess = () => {
    setIsAdminLoggedIn(true);
    sessionStorage.setItem('fqs_admin_auth', 'true');
    setActiveTab('admin');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('fqs_admin_auth');
    if (activeTab === 'admin') {
      setActiveTab('home');
    }
  };

  // Student handlers
  const handleStudentLoginSuccess = (student: StudentAccount) => {
    setLoggedInStudent(student);
    saveCurrentStudentSession(student);
    setActiveTab('student-portal');
  };

  const handleStudentLogout = () => {
    setLoggedInStudent(null);
    saveCurrentStudentSession(null);
    if (activeTab === 'student-portal') {
      setActiveTab('home');
    }
  };

  const handleHeroSearch = (query: {
    studentId?: string;
    roll?: string;
    studentClass?: string;
  }) => {
    setInitialSearchQuery(query);
    setActiveTab('results');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Header */}
      <Header
        schoolInfo={schoolInfo}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminModal={() => setAdminModalOpen(true)}
        onLogoutAdmin={handleAdminLogout}
        loggedInStudent={loggedInStudent}
        onOpenStudentAuth={() => setStudentAuthModalOpen(true)}
        onLogoutStudent={handleStudentLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <Hero
              schoolInfo={schoolInfo}
              onSearchStudent={handleHeroSearch}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenStudentAuth={() => setStudentAuthModalOpen(true)}
            />
            {/* Quick Result Preview / Lookup on Home */}
            <ResultPanel
              results={results}
              schoolInfo={schoolInfo}
              initialSearchQuery={initialSearchQuery}
            />
            {/* Teachers spotlight */}
            <TeachersSection
              teachers={teachers}
              schoolInfo={schoolInfo}
              isAdminLoggedIn={isAdminLoggedIn}
              onOpenAdminModal={() => setAdminModalOpen(true)}
            />
            {/* Admission Circular banner on Home */}
            <AdmissionSection schoolInfo={schoolInfo} />
            {/* Notice Board on Home */}
            <NoticeBoard notices={notices} schoolInfo={schoolInfo} />
            {/* School History & Vision on Home */}
            <AboutSection schoolInfo={schoolInfo} />
          </>
        )}

        {/* Student Personalized Portal */}
        {activeTab === 'student-portal' && (
          loggedInStudent ? (
            <StudentPortal
              student={loggedInStudent}
              results={results}
              schoolInfo={schoolInfo}
              onLogout={handleStudentLogout}
              onNavigateHome={() => setActiveTab('home')}
            />
          ) : (
            <div className="py-16 text-center max-w-md mx-auto">
              <h3 className="font-bold text-lg text-stone-900 mb-2">স্টুডেন্ট লগইন প্রয়োজন</h3>
              <p className="text-xs text-stone-600 mb-4">
                আপনার ফলাফল দেখতে অনুগ্রহ করে স্টুডেন্ট একাউন্টে লগইন করুন অথবা নতুন একাউন্ট তৈরি করুন।
              </p>
              <button
                onClick={() => setStudentAuthModalOpen(true)}
                className="px-4 py-2 bg-emerald-800 text-white font-semibold text-xs rounded-lg hover:bg-emerald-900 cursor-pointer"
              >
                লগইন বা একাউন্ট খুলুন
              </button>
            </div>
          )
        )}

        {activeTab === 'results' && (
          <ResultPanel
            results={results}
            schoolInfo={schoolInfo}
            initialSearchQuery={initialSearchQuery}
          />
        )}

        {activeTab === 'teachers' && (
          <TeachersSection
            teachers={teachers}
            schoolInfo={schoolInfo}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenAdminModal={() => setAdminModalOpen(true)}
          />
        )}

        {activeTab === 'admission' && <AdmissionSection schoolInfo={schoolInfo} />}

        {activeTab === 'notices' && (
          <NoticeBoard notices={notices} schoolInfo={schoolInfo} />
        )}

        {activeTab === 'about' && <AboutSection schoolInfo={schoolInfo} />}

        {activeTab === 'admin' && (
          <AdminPanel
            schoolInfo={schoolInfo}
            setSchoolInfo={setSchoolInfo}
            teachers={teachers}
            setTeachers={setTeachers}
            notices={notices}
            setNotices={setNotices}
            results={results}
            setResults={setResults}
            applications={applications}
            setApplications={setApplications}
            onLogout={handleAdminLogout}
          />
        )}
      </main>

      {/* Floating Quick Action Contacts (Call & WhatsApp) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5 no-print">
        <a
          href={`https://wa.me/88${schoolInfo.phone.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp Message"
          className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
          title="WhatsApp-এ যোগাযোগ করুন"
        >
          <MessageCircle className="w-6 h-6" />
        </a>

        <a
          href={`tel:${schoolInfo.phone}`}
          aria-label="Direct Call"
          className="w-12 h-12 bg-emerald-900 hover:bg-emerald-950 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 border-2 border-amber-400"
          title={`সরাসরি কল করুন (${schoolInfo.phone})`}
        >
          <Phone className="w-5 h-5 text-amber-300" />
        </a>
      </div>

      {/* Admin Login Dialog */}
      <AdminLoginModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onSuccess={handleAdminSuccess}
      />

      {/* Student Auth (Login / Register) Dialog */}
      <StudentAuthModal
        isOpen={studentAuthModalOpen}
        onClose={() => setStudentAuthModalOpen(false)}
        onLoginSuccess={handleStudentLoginSuccess}
      />

      {/* Footer */}
      <Footer
        schoolInfo={schoolInfo}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => {
          if (isAdminLoggedIn) {
            setActiveTab('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            setAdminModalOpen(true);
          }
        }}
      />
    </div>
  );
}
