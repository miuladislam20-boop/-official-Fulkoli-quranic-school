import React, { useState, useEffect } from 'react';
import { SchoolLogo } from './common/SchoolLogo';
import {
  SchoolInfo,
  Teacher,
  Notice,
  StudentResult,
  AdmissionApplication,
  SubjectMark,
  StudentClass,
  ExamType,
} from '../types';
import {
  saveSchoolInfo,
  saveTeachers,
  saveNotices,
  saveResults,
  saveApplications,
  exportFullBackup,
  restoreFullBackup,
  exportResultsToExcel,
  downloadExcelTemplate,
  parseExcelResults,
  saveAdminPassword,
  exportResultToWord,
  exportAllResultsToWord,
} from '../services/storageService';
import { computeResultStats, toBengaliNumber } from '../utils/gradeCalculator';
import {
  Plus,
  Trash2,
  Edit2,
  FileSpreadsheet,
  Download,
  Upload,
  Save,
  CheckCircle,
  AlertCircle,
  Phone,
  Image as ImageIcon,
  Key,
  Database,
  Users,
  Bell,
  GraduationCap,
  X,
  Search,
  CheckSquare,
  Square,
  RefreshCw,
  FileText,
} from 'lucide-react';

interface AdminPanelProps {
  schoolInfo: SchoolInfo;
  setSchoolInfo: React.Dispatch<React.SetStateAction<SchoolInfo>>;
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  notices: Notice[];
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
  results: StudentResult[];
  setResults: React.Dispatch<React.SetStateAction<StudentResult[]>>;
  applications: AdmissionApplication[];
  setApplications: React.Dispatch<React.SetStateAction<AdmissionApplication[]>>;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  schoolInfo,
  setSchoolInfo,
  teachers,
  setTeachers,
  notices,
  setNotices,
  results,
  setResults,
  applications,
  setApplications,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<
    'results' | 'teachers' | 'notices' | 'admissions' | 'settings'
  >('results');

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  // Custom in-app confirmation modal (NEVER use window.confirm which is blocked in iframes!)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    title: string;
    message: string;
    confirmBtnText?: string;
    onConfirm: () => void;
  } | null>(null);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  // ----------------- RESULTS MANAGEMENT STATE -----------------
  const [resultSearch, setResultSearch] = useState('');
  const [resultClassFilter, setResultClassFilter] = useState('All');
  const [selectedResultIds, setSelectedResultIds] = useState<string[]>([]);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [editingResultId, setEditingResultId] = useState<string | null>(null);

  const [resultForm, setResultForm] = useState<{
    studentId: string;
    roll: string;
    name: string;
    class: StudentClass;
    examType: ExamType;
    year: string;
    termOrMonth: string;
    subjects: SubjectMark[];
    remarks: string;
  }>({
    studentId: '',
    roll: '',
    name: '',
    class: 'Class 3',
    examType: 'Monthly',
    year: '2026',
    termOrMonth: 'মাসিক পরীক্ষা',
    subjects: [
      { subjectName: 'বাংলা', marks: 85, fullMarks: 100 },
      { subjectName: 'ইংরেজি', marks: 90, fullMarks: 100 },
      { subjectName: 'গণিত', marks: 80, fullMarks: 100 },
      { subjectName: 'আরবি ও কুরআন', marks: 95, fullMarks: 100 },
    ],
    remarks: '',
  });

  const handleOpenAddResult = () => {
    setEditingResultId(null);
    setResultForm({
      studentId: `FQS-${new Date().getFullYear()}-${String(results.length + 1).padStart(2, '0')}`,
      roll: String(results.length + 1),
      name: '',
      class: 'Class 3',
      examType: 'Monthly',
      year: new Date().getFullYear().toString(),
      termOrMonth: 'মাসিক মূল্যায়ন',
      subjects: [
        { subjectName: 'বাংলা', marks: 80, fullMarks: 100 },
        { subjectName: 'ইংরেজি', marks: 80, fullMarks: 100 },
        { subjectName: 'গণিত', marks: 80, fullMarks: 100 },
        { subjectName: 'আরবি ও কুরআন', marks: 90, fullMarks: 100 },
      ],
      remarks: '',
    });
    setIsResultModalOpen(true);
  };

  const handleOpenEditResult = (r: StudentResult) => {
    setEditingResultId(r.id);
    setResultForm({
      studentId: r.studentId,
      roll: r.roll,
      name: r.name,
      class: r.class as StudentClass,
      examType: r.examType,
      year: r.year,
      termOrMonth: r.termOrMonth || '',
      subjects: [...r.subjects],
      remarks: r.remarks || '',
    });
    setIsResultModalOpen(true);
  };

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultForm.name.trim() || !resultForm.roll.trim()) {
      showNotification('অনুগ্রহ করে শিক্ষার্থীর নাম ও রোল নম্বর লিখুন', 'error');
      return;
    }

    const stats = computeResultStats(resultForm.subjects);

    if (editingResultId) {
      const updated = results.map((r) =>
        r.id === editingResultId
          ? {
              ...r,
              ...resultForm,
              ...stats,
            }
          : r
      );
      setResults(updated);
      saveResults(updated);
      showNotification('ফলাফল সফলভাবে আপডেট করা হয়েছে।');
    } else {
      const newRecord: StudentResult = {
        id: `res-${Date.now()}`,
        ...resultForm,
        ...stats,
      };
      const updated = [newRecord, ...results];
      setResults(updated);
      saveResults(updated);
      showNotification('নতুন ফলাফল সফলভাবে যোগ করা হয়েছে।');
    }
    setIsResultModalOpen(false);
  };

  // Safe In-App Delete Single Result
  const handleDeleteResult = (r: StudentResult) => {
    setDeleteConfirm({
      title: 'ফলাফল মুছে ফেলুন',
      message: `আপনি কি "${r.name}" (রোল: ${r.roll}, শ্রেণি: ${r.class})-এর ফলাফলটি স্থায়ীভাবে মুছে ফেলতে চান?`,
      confirmBtnText: 'হ্যাঁ, ফলাফল মুছুন',
      onConfirm: () => {
        const updated = results.filter((item) => item.id !== r.id);
        setResults(updated);
        saveResults(updated);
        setSelectedResultIds((prev) => prev.filter((id) => id !== r.id));
        setDeleteConfirm(null);
        showNotification('ফলাফল সফলভাবে মুছে ফেলা হয়েছে।');
      },
    });
  };

  // Safe In-App Bulk Delete Selected Results
  const handleDeleteSelectedResults = () => {
    if (selectedResultIds.length === 0) return;
    setDeleteConfirm({
      title: 'নির্বাচিত ফলাফলগুলো মুছে ফেলুন',
      message: `আপনি কি নির্বাচিত ${selectedResultIds.length} জন শিক্ষার্থীর ফলাফল একসাথে মুছে ফেলতে চান?`,
      confirmBtnText: `নির্বাচিত ${selectedResultIds.length} টি মুছুন`,
      onConfirm: () => {
        const updated = results.filter((r) => !selectedResultIds.includes(r.id));
        setResults(updated);
        saveResults(updated);
        setSelectedResultIds([]);
        setDeleteConfirm(null);
        showNotification(`${selectedResultIds.length} টি ফলাফল সফলভাবে মুছে ফেলা হয়েছে।`);
      },
    });
  };

  // Safe In-App Clear All Results (Demo wipe)
  const handleClearAllResults = () => {
    if (results.length === 0) return;
    setDeleteConfirm({
      title: 'সকল ফলাফল মুছে ফেলুন',
      message:
        'আপনি কি তালিকার সকল শিক্ষার্থীর ফলাফল মুছে ফেলে একদম নতুন বা খালি করতে চান? এটি করার আগে প্রয়োজন হলে "বর্তমান রেজাল্ট এক্সেল ডাউনলোড" করে নিতে পারেন।',
      confirmBtnText: 'হ্যাঁ, সবগুলো মুছে খালি করুন',
      onConfirm: () => {
        setResults([]);
        saveResults([]);
        setSelectedResultIds([]);
        setDeleteConfirm(null);
        showNotification('সকল ফলাফল তালিকা সফলভাবে খালি করা হয়েছে।');
      },
    });
  };

  // Selection toggle
  const handleToggleSelectResult = (id: string) => {
    setSelectedResultIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllResults = (listToSelect: StudentResult[]) => {
    if (selectedResultIds.length === listToSelect.length && listToSelect.length > 0) {
      setSelectedResultIds([]);
    } else {
      setSelectedResultIds(listToSelect.map((r) => r.id));
    }
  };

  // Add subject to current form
  const handleAddSubjectToForm = () => {
    setResultForm({
      ...resultForm,
      subjects: [...resultForm.subjects, { subjectName: 'নতুন বিষয়', marks: 80, fullMarks: 100 }],
    });
  };

  const handleRemoveSubjectFromForm = (idx: number) => {
    const updated = resultForm.subjects.filter((_, i) => i !== idx);
    setResultForm({ ...resultForm, subjects: updated });
  };

  // Excel Upload Handler
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await parseExcelResults(file);
      if (imported.length === 0) {
        showNotification('এক্সেল ফাইলে কোনো ডেটা পাওয়া যায়নি।', 'error');
        return;
      }

      const merged = [...imported, ...results];
      setResults(merged);
      saveResults(merged);
      showNotification(
        `এক্সেল থেকে সফলভাবে ${imported.length} জন শিক্ষার্থীর ফলাফল যোগ করা হয়েছে!`
      );
    } catch {
      showNotification('এক্সেল ফাইল পড়তে সমস্যা হয়েছে। অনুগ্রহ করে নমুনা টেমপ্লেটটি মিলিয়ে দেখুন।', 'error');
    }
    e.target.value = '';
  };

  // ----------------- TEACHERS STATE -----------------
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    designation: '',
    mobile: '01716326885',
    qualifications: '',
    subjectSpeciality: '',
    photoUrl: '',
  });

  const handleOpenAddTeacher = () => {
    setEditingTeacherId(null);
    setTeacherForm({
      name: '',
      designation: 'সহকারী শিক্ষক',
      mobile: schoolInfo.phone,
      qualifications: 'ফাজিল / বি.এ',
      subjectSpeciality: '',
      photoUrl: '',
    });
    setIsTeacherModalOpen(true);
  };

  const handleOpenEditTeacher = (t: Teacher) => {
    setEditingTeacherId(t.id);
    setTeacherForm({
      name: t.name,
      designation: t.designation,
      mobile: t.mobile,
      qualifications: t.qualifications,
      subjectSpeciality: t.subjectSpeciality || '',
      photoUrl: t.photoUrl || '',
    });
    setIsTeacherModalOpen(true);
  };

  const handleTeacherPhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setTeacherForm((prev) => ({ ...prev, photoUrl: base64 }));
      showNotification('ছবি গ্যালারি থেকে নির্বাচন সম্পন্ন হয়েছে!');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherForm.name.trim()) {
      showNotification('শিক্ষকের নাম লিখুন', 'error');
      return;
    }

    if (editingTeacherId) {
      const updated = teachers.map((t) =>
        t.id === editingTeacherId ? { ...t, ...teacherForm } : t
      );
      setTeachers(updated);
      saveTeachers(updated);
      showNotification('শিক্ষকের তথ্য আপডেট করা হয়েছে।');
    } else {
      const newT: Teacher = {
        id: `t-${Date.now()}`,
        ...teacherForm,
        order: teachers.length + 1,
      };
      const updated = [...teachers, newT];
      setTeachers(updated);
      saveTeachers(updated);
      showNotification('নতুন শিক্ষক সফলভাবে যুক্ত করা হয়েছে।');
    }
    setIsTeacherModalOpen(false);
  };

  const handleDeleteTeacher = (t: Teacher) => {
    setDeleteConfirm({
      title: 'শিক্ষক মুছে ফেলুন',
      message: `আপনি কি "${t.name}" (${t.designation})-কে শিক্ষক তালিকা থেকে মুছে ফেলতে চান?`,
      confirmBtnText: 'হ্যাঁ, শিক্ষক মুছুন',
      onConfirm: () => {
        const updated = teachers.filter((item) => item.id !== t.id);
        setTeachers(updated);
        saveTeachers(updated);
        setDeleteConfirm(null);
        showNotification('শিক্ষক সফলভাবে মুছে ফেলা হয়েছে।');
      },
    });
  };

  const handleClearAllTeachers = () => {
    if (teachers.length === 0) return;
    setDeleteConfirm({
      title: 'সকল শিক্ষক মুছে ফেলুন',
      message: 'আপনি কি শিক্ষক তালিকার সবাইকে মুছে ফেলতে চান?',
      confirmBtnText: 'হ্যাঁ, সকল শিক্ষক মুছুন',
      onConfirm: () => {
        setTeachers([]);
        saveTeachers([]);
        setDeleteConfirm(null);
        showNotification('শিক্ষক তালিকা খালি করা হয়েছে।');
      },
    });
  };

  // ----------------- NOTICES STATE -----------------
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    category: 'সাধারণ' as Notice['category'],
    date: new Date().toISOString().slice(0, 10),
    details: '',
    isImportant: false,
  });

  const handleOpenAddNotice = () => {
    setEditingNoticeId(null);
    setNoticeForm({
      title: '',
      category: 'সাধারণ',
      date: new Date().toISOString().slice(0, 10),
      details: '',
      isImportant: false,
    });
    setIsNoticeModalOpen(true);
  };

  const handleOpenEditNotice = (n: Notice) => {
    setEditingNoticeId(n.id);
    setNoticeForm({
      title: n.title,
      category: n.category,
      date: n.date,
      details: n.details,
      isImportant: !!n.isImportant,
    });
    setIsNoticeModalOpen(true);
  };

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title.trim()) return;

    if (editingNoticeId) {
      const updated = notices.map((n) =>
        n.id === editingNoticeId ? { ...n, ...noticeForm } : n
      );
      setNotices(updated);
      saveNotices(updated);
      showNotification('নোটিশ আপডেট করা হয়েছে।');
    } else {
      const newN: Notice = {
        id: `n-${Date.now()}`,
        ...noticeForm,
      };
      const updated = [newN, ...notices];
      setNotices(updated);
      saveNotices(updated);
      showNotification('নতুন নোটিশ প্রকাশিত হয়েছে।');
    }
    setIsNoticeModalOpen(false);
  };

  const handleDeleteNotice = (n: Notice) => {
    setDeleteConfirm({
      title: 'নোটিশ মুছে ফেলুন',
      message: `আপনি কি "${n.title}" নোটিশটি মুছে ফেলতে চান?`,
      confirmBtnText: 'হ্যাঁ, নোটিশ মুছুন',
      onConfirm: () => {
        const updated = notices.filter((item) => item.id !== n.id);
        setNotices(updated);
        saveNotices(updated);
        setDeleteConfirm(null);
        showNotification('নোটিশ সফলভাবে মুছে ফেলা হয়েছে।');
      },
    });
  };

  const handleClearAllNotices = () => {
    if (notices.length === 0) return;
    setDeleteConfirm({
      title: 'সকল নোটিশ মুছে ফেলুন',
      message: 'আপনি কি নোটিশ বোর্ডের সকল নোটিশ মুছে ফেলতে চান?',
      confirmBtnText: 'হ্যাঁ, সকল নোটিশ মুছুন',
      onConfirm: () => {
        setNotices([]);
        saveNotices([]);
        setDeleteConfirm(null);
        showNotification('নোটিশ বোর্ড খালি করা হয়েছে।');
      },
    });
  };

  // ----------------- ADMISSION APPS STATE -----------------
  const handleUpdateAppStatus = (
    id: string,
    status: 'pending' | 'approved' | 'rejected'
  ) => {
    const updated = applications.map((a) => (a.id === id ? { ...a, status } : a));
    setApplications(updated);
    saveApplications(updated);
    showNotification(`আবেদনের স্ট্যাটাস পরিবর্তিত: ${status}`);
  };

  const handleDeleteApplication = (app: AdmissionApplication) => {
    setDeleteConfirm({
      title: 'আবেদন মুছে ফেলুন',
      message: `আপনি কি "${app.studentName}" (শ্রেণি: ${app.targetClass})-এর ভর্তি আবেদনটি মুছে ফেলতে চান?`,
      confirmBtnText: 'হ্যাঁ, আবেদন মুছুন',
      onConfirm: () => {
        const updated = applications.filter((a) => a.id !== app.id);
        setApplications(updated);
        saveApplications(updated);
        setDeleteConfirm(null);
        showNotification('ভর্তি আবেদন মুছে ফেলা হয়েছে।');
      },
    });
  };

  // ----------------- SCHOOL SETTINGS STATE -----------------
  const [settingsForm, setSettingsForm] = useState({ ...schoolInfo });
  const [newAdminPass, setNewAdminPass] = useState('');

  useEffect(() => {
    setSettingsForm({ ...schoolInfo });
  }, [schoolInfo]);

  const handleLogoPhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSettingsForm((prev) => ({ ...prev, logoUrl: base64 }));
      showNotification('স্কুল লোগো ছবি নির্বাচন সম্পন্ন হয়েছে! নিচে "সকল সেটিংস সংরক্ষণ করুন" বাটনে ক্লিক করুন।');
    };
    reader.readAsDataURL(file);
  };

  const handleBannerPhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSettingsForm((prev) => ({ ...prev, bannerUrl: base64 }));
      showNotification('স্কুল ব্যানার ছবি নির্বাচন সম্পন্ন হয়েছে!');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSchoolInfo(settingsForm);
    saveSchoolInfo(settingsForm);
    if (newAdminPass.trim()) {
      saveAdminPassword(newAdminPass.trim());
      setNewAdminPass('');
    }
    showNotification('স্কুলের তথ্য, লোগো ও সেটিংস সফলভাবে সংরক্ষিত হয়েছে।');
  };

  const handleRestoreBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = restoreFullBackup(content);
      if (res.success) {
        window.location.reload();
      } else {
        showNotification(res.message, 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filtered results for view
  const filteredResults = results.filter((r) => {
    const matchClass = resultClassFilter === 'All' || r.class === resultClassFilter;
    const matchTerm =
      !resultSearch.trim() ||
      r.studentId.toLowerCase().includes(resultSearch.toLowerCase()) ||
      r.roll.toLowerCase().includes(resultSearch.toLowerCase()) ||
      r.name.toLowerCase().includes(resultSearch.toLowerCase());
    return matchClass && matchTerm;
  });

  return (
    <div className="py-8 bg-stone-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Admin Top Dashboard Bar */}
        <div className="bg-emerald-950 text-white rounded-2xl p-6 mb-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>ফুলকলি কুরআনিক স্কুল</span>
              <span aria-hidden="true">·</span>
              <span>এডমিন কন্ট্রোল প্যানেল</span>
            </div>
            <h1 className="text-2xl font-bold">স্কুল ম্যানেজমেন্ট ড্যাশবোর্ড</h1>
            <p className="text-xs text-stone-300 mt-1">
              ফলাফল ব্যবস্থাপনা, শিক্ষক তালিকা, নোটিশ বোর্ড ও ওয়েবসাইট তথ্য পরিবর্তন
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportFullBackup}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="সম্পূর্ণ ওয়েবসাইটের ডেটা ব্যাকআপ ডাউনলোড"
            >
              <Database className="w-3.5 h-3.5 text-amber-300" />
              <span>Full Backup (JSON)</span>
            </button>
            <button
              onClick={onLogout}
              className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              লগআউট
            </button>
          </div>
        </div>

        {/* Global Notification Banner */}
        {notification && (
          <div
            className={`p-4 rounded-xl mb-6 flex items-center gap-2 text-sm font-medium ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                : 'bg-red-50 text-red-900 border border-red-300'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-700 shrink-0" />
            )}
            <span>{notification.text}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-300 pb-3 mb-6 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'results'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>ফলাফল ও এক্সেল ({results.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'teachers'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>শিক্ষক পরিষদ ({teachers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'notices'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>নোটিশ বোর্ড ({notices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('admissions')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'admissions'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>ভর্তি আবেদনসমূহ ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>স্কুল সেটিংস ও ব্যাকআপ</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: RESULTS & EXCEL MANAGEMENT                              */}
        {/* ============================================================== */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Excel tools */}
              <div className="flex flex-wrap items-center gap-2">
                <label className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs">
                  <Upload className="w-3.5 h-3.5 text-amber-300" />
                  <span>Excel আপলোড করুন (.xlsx/.csv)</span>
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleExcelUpload}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={() => exportResultsToExcel(results)}
                  className="px-3.5 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>রেজাল্ট এক্সেল ডাউনলোড</span>
                </button>

                <button
                  onClick={() => exportAllResultsToWord(results, schoolInfo)}
                  className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="সকল শিক্ষার্থীর রেজাল্ট একসাথে Word (.doc) ফাইলে ডাউনলোড করুন"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-200" />
                  <span>Word ফাইলে রেজাল্ট (.doc)</span>
                </button>

                <button
                  onClick={downloadExcelTemplate}
                  className="px-3 py-2 border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                  <span>নমুনা ফরম্যাট ডাউনলোড</span>
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {results.length > 0 && (
                  <button
                    onClick={handleClearAllResults}
                    className="px-3 py-2 border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    title="সকল ডেমো ফলাফল মুছে নতুন করে শুরু করতে"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>সবগুলো ডিলিট করুন</span>
                  </button>
                )}

                <button
                  onClick={handleOpenAddResult}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন ফলাফল যোগ করুন</span>
                </button>
              </div>
            </div>

            {/* Filter & Bulk Delete Action Bar */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="রোল, নাম বা আইডি খুঁজুন..."
                    value={resultSearch}
                    onChange={(e) => setResultSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-600 font-medium">শ্রেণি:</span>
                  <select
                    value={resultClassFilter}
                    onChange={(e) => setResultClassFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
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
              </div>

              {/* Bulk actions */}
              {selectedResultIds.length > 0 && (
                <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-300 text-xs">
                  <span className="font-semibold text-amber-900">
                    {selectedResultIds.length} টি ফলাফল নির্বাচিত
                  </span>
                  <button
                    onClick={handleDeleteSelectedResults}
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>নির্বাচিতগুলো ডিলিট করুন</span>
                  </button>
                </div>
              )}
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-50 text-stone-700 border-b border-stone-200 font-semibold">
                      <th className="py-3 px-3 w-10 text-center">
                        <button
                          type="button"
                          onClick={() => handleSelectAllResults(filteredResults)}
                          className="text-stone-600 hover:text-emerald-800 cursor-pointer"
                          title="সবগুলো নির্বাচন করুন"
                        >
                          {selectedResultIds.length === filteredResults.length &&
                          filteredResults.length > 0 ? (
                            <CheckSquare className="w-4 h-4 text-emerald-800" />
                          ) : (
                            <Square className="w-4 h-4 text-stone-400" />
                          )}
                        </button>
                      </th>
                      <th className="py-3 px-3">রোল</th>
                      <th className="py-3 px-3">স্টুডেন্ট আইডি</th>
                      <th className="py-3 px-3">নাম</th>
                      <th className="py-3 px-3">শ্রেণি</th>
                      <th className="py-3 px-3">পরীক্ষা</th>
                      <th className="py-3 px-3 text-center">মোট নম্বর</th>
                      <th className="py-3 px-3 text-center">শতকরা</th>
                      <th className="py-3 px-3 text-center">গ্রেড</th>
                      <th className="py-3 px-3 text-center">ফলাফল</th>
                      <th className="py-3 px-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredResults.map((r) => {
                      const isSelected = selectedResultIds.includes(r.id);
                      return (
                        <tr
                          key={r.id}
                          className={`transition-colors ${
                            isSelected ? 'bg-amber-50/60' : 'hover:bg-stone-50'
                          }`}
                        >
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectResult(r.id)}
                              className="rounded text-emerald-800 cursor-pointer"
                            />
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-stone-900">
                            {toBengaliNumber(r.roll)} ({r.roll})
                          </td>
                          <td className="py-2.5 px-3 font-mono text-stone-600">{r.studentId}</td>
                          <td className="py-2.5 px-3 font-bold text-stone-900">{r.name}</td>
                          <td className="py-2.5 px-3 text-stone-700">{r.class}</td>
                          <td className="py-2.5 px-3 text-stone-600">
                            {r.examType} ({r.year})
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-950">
                            {r.totalMarks} / {r.totalFullMarks}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-stone-700">
                            {r.percentage}%
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-amber-700">
                            {r.grade}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                r.resultStatus === 'Pass'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {r.resultStatus === 'Pass' ? 'Pass' : 'Fail'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => exportResultToWord(r, schoolInfo)}
                                className="p-1.5 text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded cursor-pointer"
                                title="এই শিক্ষার্থীর মার্কশিট Word ফাইলে ডাউনলোড করুন"
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenEditResult(r)}
                                className="p-1.5 text-stone-600 hover:text-emerald-800 rounded hover:bg-stone-100 cursor-pointer"
                                title="সম্পাদনা"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteResult(r)}
                                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded cursor-pointer"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredResults.length === 0 && (
                      <tr>
                        <td colSpan={11} className="py-8 text-center text-stone-500">
                          কোনো ফলাফল পাওয়া যায়নি। নতুন ফলাফল যোগ করুন অথবা এক্সেল ফাইল আপলোড করুন।
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: TEACHERS MANAGEMENT                                     */}
        {/* ============================================================== */}
        {activeTab === 'teachers' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-stone-900 text-base">শিক্ষক ও স্টাফ পরিচালনা</h3>
                <p className="text-xs text-stone-500">
                  সরাসরি মোবাইল বা কম্পিউটার গ্যালারি থেকে ছবি আপলোড করে শিক্ষক তথ্য নিয়ন্ত্রণ করুন
                </p>
              </div>
              <div className="flex items-center gap-2">
                {teachers.length > 0 && (
                  <button
                    onClick={handleClearAllTeachers}
                    className="px-3 py-2 border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    সকল শিক্ষক মুছুন
                  </button>
                )}
                <button
                  onClick={handleOpenAddTeacher}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>নতুন শিক্ষক যোগ করুন</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 overflow-hidden shrink-0 flex items-center justify-center">
                        {t.photoUrl ? (
                          <img
                            src={t.photoUrl}
                            alt={t.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="w-6 h-6 text-emerald-800" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-stone-900 text-sm truncate">{t.name}</h4>
                        <p className="text-xs font-semibold text-emerald-800 truncate">
                          {t.designation}
                        </p>
                        <p className="text-[11px] text-stone-500 truncate">{t.subjectSpeciality}</p>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-stone-600 pt-2 border-t border-stone-100">
                      <div>যোগ্যতা: {t.qualifications}</div>
                      <div>মোবাইল: {t.mobile}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100 mt-4">
                    <button
                      onClick={() => handleOpenEditTeacher(t)}
                      className="px-3 py-1.5 text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 rounded font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>সম্পাদনা</span>
                    </button>
                    <button
                      onClick={() => handleDeleteTeacher(t)}
                      className="px-3 py-1.5 text-xs text-red-700 bg-red-50 hover:bg-red-100 rounded font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>মুছুন</span>
                    </button>
                  </div>
                </div>
              ))}
              {teachers.length === 0 && (
                <div className="col-span-full bg-white p-8 rounded-xl border border-stone-200 text-center text-stone-500 text-sm">
                  বর্তমানে কোনো শিক্ষকের তথ্য নেই। "নতুন শিক্ষক যোগ করুন" বাটনে ক্লিক করে যোগ করতে পারেন।
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: NOTICES MANAGEMENT                                      */}
        {/* ============================================================== */}
        {activeTab === 'notices' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-stone-900 text-base">নোটিশ বোর্ড পরিচালনা</h3>
                <p className="text-xs text-stone-500">
                  পরীক্ষা, ভর্তি ও ছুটির নোটিশ প্রকাশ, সম্পাদনা বা মুছে ফেলুন
                </p>
              </div>
              <div className="flex items-center gap-2">
                {notices.length > 0 && (
                  <button
                    onClick={handleClearAllNotices}
                    className="px-3 py-2 border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    সকল নোটিশ মুছুন
                  </button>
                )}
                <button
                  onClick={handleOpenAddNotice}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>নতুন নোটিশ লিখুন</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {notices.map((n) => (
                <div
                  key={n.id}
                  className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {n.category}
                      </span>
                      <span className="text-stone-400 font-mono">{n.date}</span>
                      {n.isImportant && (
                        <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                          জরুরি নোটিশ
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-stone-900 text-base">{n.title}</h4>
                    <p className="text-xs text-stone-600 line-clamp-2">{n.details}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenEditNotice(n)}
                      className="px-3 py-1.5 text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 rounded font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>সম্পাদনা</span>
                    </button>
                    <button
                      onClick={() => handleDeleteNotice(n)}
                      className="px-3 py-1.5 text-xs text-red-700 bg-red-50 hover:bg-red-100 rounded font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>মুছুন</span>
                    </button>
                  </div>
                </div>
              ))}
              {notices.length === 0 && (
                <div className="bg-white p-8 rounded-xl border border-stone-200 text-center text-stone-500 text-sm">
                  কোনো নোটিশ নেই। নতুন নোটিশ যুক্ত করুন।
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: ADMISSION APPLICATIONS                                  */}
        {/* ============================================================== */}
        {activeTab === 'admissions' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-base">অনলাইন ভর্তি আবেদন তালিকা</h3>
                <p className="text-xs text-stone-500">
                  অভিভাবকদের পূরণকৃত অনলাইন প্রাথমিক ভর্তি আবেদনসমূহ
                </p>
              </div>
              <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                মোট আবেদন: {applications.length}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-50 text-stone-700 border-b border-stone-200 font-semibold">
                      <th className="py-3 px-3">ট্র্যাকিং আইডি</th>
                      <th className="py-3 px-3">শিক্ষার্থীর নাম</th>
                      <th className="py-3 px-3">শ্রেণি</th>
                      <th className="py-3 px-3">পিতার নাম</th>
                      <th className="py-3 px-3">মোবাইল</th>
                      <th className="py-3 px-3">ঠিকানা</th>
                      <th className="py-3 px-3">তারিখ</th>
                      <th className="py-3 px-3">স্ট্যাটাস</th>
                      <th className="py-3 px-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-stone-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-900">
                          {app.id}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-stone-900">{app.studentName}</td>
                        <td className="py-2.5 px-3 text-stone-800 font-medium">
                          {app.targetClass}
                        </td>
                        <td className="py-2.5 px-3 text-stone-700">{app.fatherName}</td>
                        <td className="py-2.5 px-3 font-mono">
                          <a
                            href={`tel:${app.phone}`}
                            className="text-emerald-800 underline font-semibold flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{app.phone}</span>
                          </a>
                        </td>
                        <td className="py-2.5 px-3 text-stone-600">{app.address}</td>
                        <td className="py-2.5 px-3 text-stone-500 font-mono">
                          {new Date(app.submittedAt).toLocaleDateString('bn-BD')}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              app.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : app.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {app.status === 'approved'
                              ? 'অনুমোদিত'
                              : app.status === 'rejected'
                              ? 'বাতিল'
                              : 'অপেক্ষমাণ'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleUpdateAppStatus(app.id, 'approved')}
                              className="px-2 py-1 text-[11px] bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded font-semibold cursor-pointer"
                            >
                              অনুমোদন
                            </button>
                            <button
                              onClick={() => handleUpdateAppStatus(app.id, 'rejected')}
                              className="px-2 py-1 text-[11px] bg-amber-50 text-amber-800 hover:bg-amber-100 rounded font-semibold cursor-pointer"
                            >
                              বাতিল
                            </button>
                            <button
                              onClick={() => handleDeleteApplication(app)}
                              className="p-1 text-red-600 hover:text-red-800 rounded hover:bg-red-50 cursor-pointer"
                              title="আবেদন মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {applications.length === 0 && (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-stone-500">
                          এখনো কোনো অনলাইন ভর্তি আবেদন জমা পড়েনি।
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: SCHOOL SETTINGS & FULL BACKUP                           */}
        {/* ============================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Settings Form */}
              <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-stone-200 shadow-xs">
                <h3 className="font-bold text-stone-900 text-base mb-4 pb-2 border-b border-stone-200">
                  স্কুলের মৌলিক তথ্য পরিবর্তন
                </h3>

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  {/* School Logo & Campus Banner Upload from Gallery */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
                    {/* School Logo */}
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-800" />
                        <span>স্কুলের লোগো (Gallery থেকে আপলোড):</span>
                      </label>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="w-16 h-16 rounded-full bg-white border-2 border-emerald-600/30 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                          <SchoolLogo
                            src={settingsForm.logoUrl}
                            alt="School Logo"
                            className="w-full h-full object-cover"
                            fallbackSize="lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoPhotoFile}
                            className="w-full text-xs text-stone-600 file:mr-2 file:py-1.5 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-800 file:text-white hover:file:bg-emerald-900 cursor-pointer"
                          />
                          <p className="text-[11px] text-stone-500 mt-1">
                            মোবাইল বা পিসি গ্যালারি থেকে নিজের স্কুলের আসল লোগো ছবি দিন
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Campus Banner Image */}
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
                        <span>হোম পেজ ব্যানার / ক্যাম্পাস ছবি:</span>
                      </label>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="w-20 h-14 rounded-lg bg-white border border-stone-300 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                          {settingsForm.bannerUrl ? (
                            <img
                              src={settingsForm.bannerUrl}
                              alt="Campus Banner"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-stone-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBannerPhotoFile}
                            className="w-full text-xs text-stone-600 file:mr-2 file:py-1.5 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-stone-800 file:text-white hover:file:bg-stone-900 cursor-pointer"
                          />
                          <p className="text-[11px] text-stone-500 mt-1">
                            ক্যাম্পাস বা প্রধান ফটকের ছবি
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        স্কুলের নাম (বাংলা)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.nameBangla}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, nameBangla: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        স্কুলের নাম (ইংরেজি)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.name}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, name: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      হোম পেজের শীর্ষ স্লোগান / ট্যাগলাইন (Hero Tagline)
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: দ্বীনি ও আধুনিক শিক্ষার এক অনন্য সমন্বয়"
                      value={settingsForm.tagline || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, tagline: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        প্রতিষ্ঠার সাল
                      </label>
                      <input
                        type="text"
                        value={settingsForm.established}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, established: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        যোগাযোগের মোবাইল নম্বর
                      </label>
                      <input
                        type="tel"
                        value={settingsForm.phone}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, phone: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        ইমেইল এড্রেস
                      </label>
                      <input
                        type="email"
                        value={settingsForm.email}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, email: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      ঠিকানা (Address)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.address}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, address: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      স্কুলের পরিচিতি ও ইতিহাস
                    </label>
                    <textarea
                      rows={3}
                      value={settingsForm.aboutHistory}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, aboutHistory: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        অধ্যক্ষ / প্রধান শিক্ষকের নাম
                      </label>
                      <input
                        type="text"
                        value={settingsForm.headmasterName}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, headmasterName: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        নতুন অ্যাডমিন পাসওয়ার্ড
                      </label>
                      <input
                        type="password"
                        placeholder="পাসওয়ার্ড পরিবর্তন করতে লিখুন"
                        value={newAdminPass}
                        onChange={(e) => setNewAdminPass(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      অধ্যক্ষের বাণী
                    </label>
                    <textarea
                      rows={2}
                      value={settingsForm.headmasterMessage}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, headmasterMessage: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Save className="w-4 h-4 text-amber-300" />
                    <span>সকল সেটিংস সংরক্ষণ করুন</span>
                  </button>
                </form>
              </div>

              {/* Backup & Restore Vault */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs">
                  <h3 className="font-bold text-stone-900 text-sm mb-3 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-emerald-800" />
                    <span>ফুল ডাটা ব্যাকআপ ও রিস্টোর ভল্ট</span>
                  </h3>
                  <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                    স্কুলের সমস্ত ফলাফল, শিক্ষক, নোটিশ এবং সেটিংস কখনো হারাবে না। যেকোনো সময় সম্পূর্ণ ডেটার ব্যাকআপ ডাউনলোড করে রাখতে পারবেন।
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={exportFullBackup}
                      className="w-full py-2.5 px-4 bg-emerald-900 hover:bg-emerald-950 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Download className="w-4 h-4 text-amber-300" />
                      <span>1-Click Full Backup (JSON)</span>
                    </button>

                    <div className="pt-3 border-t border-stone-200">
                      <label className="block text-xs font-bold text-stone-800 mb-1.5">
                        সংরক্ষিত ব্যাকআপ ফাইল রিস্টোর করুন:
                      </label>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleRestoreBackupFile}
                        className="w-full text-xs text-stone-600 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-stone-800 file:text-white cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Info Box */}
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 text-xs text-amber-950 space-y-2">
                  <div className="font-bold flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-amber-700" />
                    <span>অ্যাডমিন নিরাপত্তা নির্দেশিকা</span>
                  </div>
                  <p className="leading-relaxed text-amber-900">
                    অ্যাডমিন পাসওয়ার্ড সম্পূর্ণ গোপন রাখুন। প্রয়োজন হলে উপরে নতুন পাসওয়ার্ড লিখে সংরক্ষণ করতে পারেন।
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* CUSTOM IN-APP DELETE CONFIRMATION MODAL (100% Reliable!)       */}
        {/* ============================================================== */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-stone-200">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-stone-900 text-center mb-2">
                {deleteConfirm.title}
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 text-center leading-relaxed mb-6">
                {deleteConfirm.message}
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 px-4 border border-stone-300 text-stone-700 font-semibold text-xs rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={deleteConfirm.onConfirm}
                  className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  {deleteConfirm.confirmBtnText || 'হ্যাঁ, মুছে ফেলুন'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Result Add / Edit Modal */}
        {isResultModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative border border-stone-200 my-8">
              <button
                onClick={() => setIsResultModalOpen(false)}
                className="absolute right-4 top-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
                {editingResultId ? 'ফলাফল তথ্য সম্পাদনা' : 'নতুন শিক্ষার্থী ফলাফল যোগ'}
              </h3>

              <form onSubmit={handleSaveResult} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      স্টুডেন্ট আইডি *
                    </label>
                    <input
                      type="text"
                      required
                      value={resultForm.studentId}
                      onChange={(e) =>
                        setResultForm({ ...resultForm, studentId: e.target.value })
                      }
                      placeholder="যেমন: FQS-2026-01"
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      রোল নম্বর *
                    </label>
                    <input
                      type="text"
                      required
                      value={resultForm.roll}
                      onChange={(e) => setResultForm({ ...resultForm, roll: e.target.value })}
                      placeholder="যেমন: 01"
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      শিক্ষার্থীর নাম *
                    </label>
                    <input
                      type="text"
                      required
                      value={resultForm.name}
                      onChange={(e) => setResultForm({ ...resultForm, name: e.target.value })}
                      placeholder="যেমন: মুহাম্মাদ তাহমিদ"
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">শ্রেণি</label>
                    <select
                      value={resultForm.class}
                      onChange={(e) =>
                        setResultForm({
                          ...resultForm,
                          class: e.target.value as StudentClass,
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
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
                      পরীক্ষার ধরন
                    </label>
                    <select
                      value={resultForm.examType}
                      onChange={(e) =>
                        setResultForm({
                          ...resultForm,
                          examType: e.target.value as ExamType,
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg font-medium"
                    >
                      <option value="Monthly">Monthly (মাসিক পরীক্ষা)</option>
                      <option value="Weekly">Weekly (সাপ্তাহিক মূল্যায়ন)</option>
                      <option value="Annual">Annual (বার্ষিক পরীক্ষা)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">সাল</label>
                    <input
                      type="text"
                      value={resultForm.year}
                      onChange={(e) => setResultForm({ ...resultForm, year: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Subject-Wise Marks */}
                <div className="pt-2 border-t border-stone-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-stone-900">
                      বিষয়ভিত্তিক নম্বর তালিকা (স্বয়ংক্রিয় মোট ও গ্রেড হিসাব হবে):
                    </label>
                    <button
                      type="button"
                      onClick={handleAddSubjectToForm}
                      className="text-xs text-emerald-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>নতুন বিষয় যোগ করুন</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {resultForm.subjects.map((sub, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-stone-50 p-2 rounded-lg border border-stone-200">
                        <input
                          type="text"
                          value={sub.subjectName}
                          onChange={(e) => {
                            const updated = [...resultForm.subjects];
                            updated[idx].subjectName = e.target.value;
                            setResultForm({ ...resultForm, subjects: updated });
                          }}
                          placeholder="বিষয়ের নাম"
                          className="flex-1 px-2.5 py-1 text-xs bg-white border border-stone-300 rounded"
                        />
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] text-stone-500">প্রাপ্ত:</span>
                          <input
                            type="number"
                            value={sub.marks}
                            onChange={(e) => {
                              const updated = [...resultForm.subjects];
                              updated[idx].marks = Number(e.target.value);
                              setResultForm({ ...resultForm, subjects: updated });
                            }}
                            className="w-16 px-2 py-1 text-xs bg-white border border-stone-300 rounded text-center font-bold"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] text-stone-500">পূর্ণমান:</span>
                          <input
                            type="number"
                            value={sub.fullMarks}
                            onChange={(e) => {
                              const updated = [...resultForm.subjects];
                              updated[idx].fullMarks = Number(e.target.value);
                              setResultForm({ ...resultForm, subjects: updated });
                            }}
                            className="w-16 px-2 py-1 text-xs bg-white border border-stone-300 rounded text-center text-stone-600"
                          />
                        </div>
                        {resultForm.subjects.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSubjectFromForm(idx)}
                            className="p-1 text-stone-400 hover:text-red-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {(() => {
                    const stats = computeResultStats(resultForm.subjects);
                    return (
                      <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
                        <span>
                          মোট প্রাপ্ত: <b>{stats.totalMarks}</b> / {stats.totalFullMarks}
                        </span>
                        <span>
                          শতকরা: <b>{stats.percentage}%</b>
                        </span>
                        <span>
                          গ্রেড: <b>{stats.grade}</b>
                        </span>
                        <span>
                          ফলাফল:{' '}
                          <b className={stats.resultStatus === 'Pass' ? 'text-emerald-800' : 'text-red-700'}>
                            {stats.resultStatus}
                          </b>
                        </span>
                      </div>
                    );
                  })()}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    শিক্ষকের মূল্যায়ন / মন্তব্য (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={resultForm.remarks}
                    onChange={(e) => setResultForm({ ...resultForm, remarks: e.target.value })}
                    placeholder="যেমন: মাশাআল্লাহ! অত্যন্ত সন্তোষজনক ফলাফল।"
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsResultModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-50 cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    {editingResultId ? 'পরিবর্তন সংরক্ষণ করুন' : 'ফলাফল সংরক্ষণ করুন'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Teacher Add/Edit Modal */}
        {isTeacherModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-stone-200">
              <button
                onClick={() => setIsTeacherModalOpen(false)}
                className="absolute right-4 top-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
                {editingTeacherId ? 'শিক্ষকের তথ্য সম্পাদনা' : 'নতুন শিক্ষক যোগ করুন'}
              </h3>

              <form onSubmit={handleSaveTeacher} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    শিক্ষকের নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={teacherForm.name}
                    onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                    placeholder="যেমন: মাওলানা মোহাম্মাদ আব্দুল্লাহ"
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      পদবি *
                    </label>
                    <input
                      type="text"
                      required
                      value={teacherForm.designation}
                      onChange={(e) =>
                        setTeacherForm({ ...teacherForm, designation: e.target.value })
                      }
                      placeholder="যেমন: সিনিয়র শিক্ষক"
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      মোবাইল নম্বর (Call Now) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={teacherForm.mobile}
                      onChange={(e) => setTeacherForm({ ...teacherForm, mobile: e.target.value })}
                      placeholder="01716326885"
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      শিক্ষাগত যোগ্যতা
                    </label>
                    <input
                      type="text"
                      value={teacherForm.qualifications}
                      onChange={(e) =>
                        setTeacherForm({ ...teacherForm, qualifications: e.target.value })
                      }
                      placeholder="যেমন: কামিল, এম.এ"
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      বিষয় / বিভাগ
                    </label>
                    <input
                      type="text"
                      value={teacherForm.subjectSpeciality}
                      onChange={(e) =>
                        setTeacherForm({ ...teacherForm, subjectSpeciality: e.target.value })
                      }
                      placeholder="যেমন: কুরআন ও আরবি"
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                    <span>সরাসরি Gallery থেকে ছবি নির্বাচন করুন (কোনো লিঙ্ক লিখতে হবে না):</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleTeacherPhotoFile}
                    className="w-full text-xs text-stone-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-800 file:text-white hover:file:bg-emerald-900 cursor-pointer"
                  />
                  {teacherForm.photoUrl && (
                    <div className="mt-2 flex items-center gap-3">
                      <img
                        src={teacherForm.photoUrl}
                        alt="Preview"
                        className="w-12 h-12 rounded-full object-cover border border-emerald-500"
                      />
                      <span className="text-xs text-emerald-800 font-semibold">
                        ছবি সফলভাবে সংযুক্ত হয়েছে!
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsTeacherModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-50 cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Notice Add / Edit Modal */}
        {isNoticeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-stone-200">
              <button
                onClick={() => setIsNoticeModalOpen(false)}
                className="absolute right-4 top-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
                {editingNoticeId ? 'নোটিশ সম্পাদনা' : 'নতুন নোটিশ প্রকাশ'}
              </h3>

              <form onSubmit={handleSaveNotice} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    নোটিশের শিরোনাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={noticeForm.title}
                    onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                    placeholder="যেমন: ২০২৭ শিক্ষাবর্ষে নতুন শিক্ষার্থী ভর্তি বিজ্ঞপ্তি"
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      ক্যাটাগরি
                    </label>
                    <select
                      value={noticeForm.category}
                      onChange={(e) =>
                        setNoticeForm({
                          ...noticeForm,
                          category: e.target.value as Notice['category'],
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                    >
                      <option value="ভর্তি">ভর্তি</option>
                      <option value="পরীক্ষা">পরীক্ষা</option>
                      <option value="ছুটি">ছুটি</option>
                      <option value="সাধারণ">সাধারণ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">তারিখ</label>
                    <input
                      type="date"
                      value={noticeForm.date}
                      onChange={(e) => setNoticeForm({ ...noticeForm, date: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    বিস্তারিত বিবরণ *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={noticeForm.details}
                    onChange={(e) => setNoticeForm({ ...noticeForm, details: e.target.value })}
                    placeholder="নোটিশের বিস্তারিত বক্তব্য..."
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isImportant"
                    checked={noticeForm.isImportant}
                    onChange={(e) =>
                      setNoticeForm({ ...noticeForm, isImportant: e.target.checked })
                    }
                    className="rounded text-emerald-800"
                  />
                  <label htmlFor="isImportant" className="text-xs font-semibold text-stone-800 cursor-pointer">
                    জরুরি নোটিশ হিসেবে পিন করুন
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsNoticeModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-50 cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    প্রকাশ করুন
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
