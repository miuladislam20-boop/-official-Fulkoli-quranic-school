import * as XLSX from 'xlsx';
import {
  SchoolInfo,
  Teacher,
  Notice,
  StudentResult,
  AdmissionApplication,
  StudentAccount,
  ExamType,
  StudentClass,
} from '../types';
import {
  initialSchoolInfo,
  initialTeachers,
  initialNotices,
  initialResults,
} from '../data/initialData';
import { computeResultStats } from '../utils/gradeCalculator';

const KEYS = {
  SCHOOL: 'fqs_school_info_v1',
  TEACHERS: 'fqs_teachers_v1',
  NOTICES: 'fqs_notices_v1',
  RESULTS: 'fqs_results_v1',
  APPLICATIONS: 'fqs_applications_v1',
  STUDENTS: 'fqs_students_v1',
  STUDENT_SESSION: 'fqs_student_session_v1',
  ADMIN_PASS: 'fqs_admin_pass_v1',
};

// Safe local storage getters with defaults
export function getStoredSchoolInfo(): SchoolInfo {
  try {
    const raw = localStorage.getItem(KEYS.SCHOOL);
    if (!raw) return initialSchoolInfo;
    const parsed = JSON.parse(raw);

    // Sanitize any stale dev paths that start with /src/assets/
    if (parsed.logoUrl && (parsed.logoUrl.startsWith('/src/assets/') || !parsed.logoUrl)) {
      parsed.logoUrl = initialSchoolInfo.logoUrl;
    }
    if (parsed.bannerUrl && (parsed.bannerUrl.startsWith('/src/assets/') || !parsed.bannerUrl)) {
      parsed.bannerUrl = initialSchoolInfo.bannerUrl;
    }
    if (parsed.learningSceneUrl && (parsed.learningSceneUrl.startsWith('/src/assets/') || !parsed.learningSceneUrl)) {
      parsed.learningSceneUrl = initialSchoolInfo.learningSceneUrl;
    }

    return { ...initialSchoolInfo, ...parsed };
  } catch {
    return initialSchoolInfo;
  }
}

export function saveSchoolInfo(info: SchoolInfo): void {
  localStorage.setItem(KEYS.SCHOOL, JSON.stringify(info));
}

export function getStoredTeachers(): Teacher[] {
  try {
    const raw = localStorage.getItem(KEYS.TEACHERS);
    if (!raw) return initialTeachers;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialTeachers;
  } catch {
    return initialTeachers;
  }
}

export function saveTeachers(teachers: Teacher[]): void {
  localStorage.setItem(KEYS.TEACHERS, JSON.stringify(teachers));
}

export function getStoredNotices(): Notice[] {
  try {
    const raw = localStorage.getItem(KEYS.NOTICES);
    if (!raw) return initialNotices;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialNotices;
  } catch {
    return initialNotices;
  }
}

export function saveNotices(notices: Notice[]): void {
  localStorage.setItem(KEYS.NOTICES, JSON.stringify(notices));
}

export function getStoredResults(): StudentResult[] {
  try {
    const raw = localStorage.getItem(KEYS.RESULTS);
    if (!raw) return initialResults;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialResults;
  } catch {
    return initialResults;
  }
}

export function saveResults(results: StudentResult[]): void {
  localStorage.setItem(KEYS.RESULTS, JSON.stringify(results));
}

export function getStoredApplications(): AdmissionApplication[] {
  try {
    const raw = localStorage.getItem(KEYS.APPLICATIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveApplications(apps: AdmissionApplication[]): void {
  localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(apps));
}

const initialStudentAccounts: StudentAccount[] = [
  {
    id: 'stu-1',
    name: 'মুহাম্মাদ তাহমিদ ইসলাম',
    studentId: 'FQS-2026-01',
    roll: '01',
    class: 'Class 3',
    phone: '01716326885',
    password: '123',
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'stu-2',
    name: 'ফাতিমা জান্নাত মেহজাবিন',
    studentId: 'FQS-2026-02',
    roll: '02',
    class: 'Class 5',
    phone: '01716326885',
    password: '123',
    createdAt: '2026-01-12T10:00:00.000Z',
  },
];

export function getStoredStudentAccounts(): StudentAccount[] {
  try {
    const raw = localStorage.getItem(KEYS.STUDENTS);
    if (!raw) return initialStudentAccounts;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialStudentAccounts;
  } catch {
    return initialStudentAccounts;
  }
}

export function saveStudentAccounts(accounts: StudentAccount[]): void {
  localStorage.setItem(KEYS.STUDENTS, JSON.stringify(accounts));
}

export function getCurrentStudentSession(): StudentAccount | null {
  try {
    const raw = localStorage.getItem(KEYS.STUDENT_SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveCurrentStudentSession(student: StudentAccount | null): void {
  if (!student) {
    localStorage.removeItem(KEYS.STUDENT_SESSION);
  } else {
    localStorage.setItem(KEYS.STUDENT_SESSION, JSON.stringify(student));
  }
}

export function getStoredAdminPassword(): string {
  try {
    return localStorage.getItem(KEYS.ADMIN_PASS) || 'admin123';
  } catch {
    return 'admin123';
  }
}

export function saveAdminPassword(newPass: string): void {
  localStorage.setItem(KEYS.ADMIN_PASS, newPass);
}

// 1-Click JSON Backup & Restore for safe data keeping
export function exportFullBackup(): void {
  const backup = {
    school: getStoredSchoolInfo(),
    teachers: getStoredTeachers(),
    notices: getStoredNotices(),
    results: getStoredResults(),
    applications: getStoredApplications(),
    students: getStoredStudentAccounts(),
    backupDate: new Date().toISOString(),
    schoolName: 'Fulkoli Quranic School, Bogura',
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
  const dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute('href', dataStr);
  dlAnchorElem.setAttribute(
    'download',
    `Fulkoli_School_Backup_${new Date().toISOString().slice(0, 10)}.json`
  );
  dlAnchorElem.click();
}

export function restoreFullBackup(jsonData: string): { success: boolean; message: string } {
  try {
    const parsed = JSON.parse(jsonData);
    if (parsed.school) saveSchoolInfo(parsed.school);
    if (Array.isArray(parsed.teachers)) saveTeachers(parsed.teachers);
    if (Array.isArray(parsed.notices)) saveNotices(parsed.notices);
    if (Array.isArray(parsed.results)) saveResults(parsed.results);
    if (Array.isArray(parsed.applications)) saveApplications(parsed.applications);
    if (Array.isArray(parsed.students)) saveStudentAccounts(parsed.students);

    return { success: true, message: 'সকল ডেটা সফলভাবে রিস্টোর করা হয়েছে।' };
  } catch {
    return { success: false, message: 'ফাইলটি সঠিক ব্যাকআপ ফাইল নয়।' };
  }
}

// Word (.doc) Document Export for Marksheet
export function exportResultToWord(result: StudentResult, schoolInfo: SchoolInfo): void {
  const subjectRows = result.subjects
    .map((sub, idx) => {
      const subPercent =
        sub.fullMarks > 0 ? ((sub.marks / sub.fullMarks) * 100).toFixed(1) : '0';
      let subGrade = 'F';
      const numPercent = Number(subPercent);
      if (numPercent >= 80) subGrade = 'A+';
      else if (numPercent >= 70) subGrade = 'A';
      else if (numPercent >= 60) subGrade = 'A-';
      else if (numPercent >= 50) subGrade = 'B';
      else if (numPercent >= 40) subGrade = 'C';
      else if (numPercent >= 33) subGrade = 'D';

      return `
        <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f9fafb'};">
          <td style="border: 1px solid #cbd5e1; padding: 7px; text-align: center;">${idx + 1}</td>
          <td style="border: 1px solid #cbd5e1; padding: 7px; font-weight: bold;">${sub.subjectName}</td>
          <td style="border: 1px solid #cbd5e1; padding: 7px; text-align: center;">${sub.fullMarks}</td>
          <td style="border: 1px solid #cbd5e1; padding: 7px; text-align: center; font-weight: bold; color: #064e3b;">${sub.marks}</td>
          <td style="border: 1px solid #cbd5e1; padding: 7px; text-align: center;">${subPercent}%</td>
          <td style="border: 1px solid #cbd5e1; padding: 7px; text-align: center; font-weight: bold;">${subGrade}</td>
        </tr>
      `;
    })
    .join('');

  const wordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${result.name} - মার্কশিট</title>
      <style>
        body { font-family: 'SolaimanLipi', 'Kalpurush', 'Segoe UI', Arial, sans-serif; margin: 30px; color: #1e293b; }
        .header { text-align: center; border-bottom: 2px solid #064e3b; padding-bottom: 12px; margin-bottom: 20px; }
        .school-name-bn { font-size: 22pt; font-weight: bold; color: #064e3b; margin: 0; }
        .school-name-en { font-size: 13pt; font-weight: bold; color: #b45309; margin: 4px 0; }
        .school-address { font-size: 10pt; color: #475569; margin: 2px 0; }
        .doc-title { background-color: #064e3b; color: #ffffff; padding: 5px 15px; font-weight: bold; font-size: 11pt; display: inline-block; margin-top: 10px; border-radius: 4px; }
        .student-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; margin-top: 15px; }
        .student-table td { border: 1px solid #cbd5e1; padding: 6px 10px; font-size: 10pt; }
        .marks-table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px; }
        .marks-table th { background-color: #064e3b; color: #ffffff; border: 1px solid #064e3b; padding: 8px; font-size: 10.5pt; text-align: center; }
        .summary-grid { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px; }
        .summary-grid td { border: 1px solid #cbd5e1; padding: 10px; text-align: center; background-color: #f8fafc; }
        .summary-title { font-size: 9pt; color: #64748b; margin-bottom: 3px; }
        .summary-val { font-size: 14pt; font-weight: bold; color: #064e3b; }
        .remarks { background-color: #fef3c7; border: 1px solid #fde68a; padding: 8px 12px; font-size: 10pt; color: #78350f; margin-bottom: 35px; border-radius: 4px; }
        .sign-table { width: 100%; margin-top: 50px; border-collapse: collapse; }
        .sign-table td { text-align: center; font-size: 10pt; vertical-align: top; padding: 10px; }
        .sign-line { border-top: 1px dashed #64748b; width: 140px; margin: 0 auto 5px auto; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="school-name-bn">${schoolInfo.nameBangla}</div>
        <div class="school-name-en">${schoolInfo.name}</div>
        <div class="school-address">${schoolInfo.address} | ফোন: ${schoolInfo.phone} | স্থাপিত: ${schoolInfo.established}</div>
        <div class="doc-title">অফিসিয়াল শিক্ষার্থী মার্কশিট ও প্রগ্রেস রিপোর্ট</div>
      </div>

      <table class="student-table">
        <tr>
          <td style="width: 25%; background-color: #f1f5f9;"><strong>শিক্ষার্থীর নাম:</strong></td>
          <td style="width: 25%; font-weight: bold; color: #0f172a;">${result.name}</td>
          <td style="width: 25%; background-color: #f1f5f9;"><strong>স্টুডেন্ট আইডি:</strong></td>
          <td style="width: 25%; font-family: monospace; font-weight: bold;">${result.studentId}</td>
        </tr>
        <tr>
          <td style="background-color: #f1f5f9;"><strong>শ্রেণি ও শাখা:</strong></td>
          <td>${result.class}</td>
          <td style="background-color: #f1f5f9;"><strong>রোল নম্বর:</strong></td>
          <td style="font-weight: bold;">${result.roll}</td>
        </tr>
        <tr>
          <td style="background-color: #f1f5f9;"><strong>পরীক্ষার ধরন:</strong></td>
          <td>${result.examType === 'Weekly' ? 'সাপ্তাহিক মূল্যায়ন' : result.examType === 'Monthly' ? 'মাসিক পরীক্ষা' : 'বার্ষিক পরীক্ষা'}</td>
          <td style="background-color: #f1f5f9;"><strong>পরীক্ষার সাল ও মাস:</strong></td>
          <td>${result.termOrMonth || ''} (${result.year})</td>
        </tr>
      </table>

      <table class="marks-table">
        <thead>
          <tr>
            <th style="width: 8%;">ক্রমিক</th>
            <th style="text-align: left; padding-left: 10px;">বিষয় (Subject)</th>
            <th style="width: 15%;">পূর্ণমান (Full)</th>
            <th style="width: 15%;">প্রাপ্ত নম্বর</th>
            <th style="width: 15%;">শতকরা (%)</th>
            <th style="width: 15%;">গ্রেড (Grade)</th>
          </tr>
        </thead>
        <tbody>
          ${subjectRows}
          <tr style="background-color: #e2e8f0; font-weight: bold;">
            <td colspan="2" style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">সর্বমোট (Total):</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${result.totalFullMarks}</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; color: #064e3b; font-size: 11pt;">${result.totalMarks}</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${result.percentage}%</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; color: #064e3b; font-size: 11pt;">${result.grade}</td>
          </tr>
        </tbody>
      </table>

      <table class="summary-grid">
        <tr>
          <td style="width: 25%;">
            <div class="summary-title">মোট প্রাপ্ত নম্বর</div>
            <div class="summary-val">${result.totalMarks} / ${result.totalFullMarks}</div>
          </td>
          <td style="width: 25%;">
            <div class="summary-title">শতকরা হার</div>
            <div class="summary-val">${result.percentage}%</div>
          </td>
          <td style="width: 25%;">
            <div class="summary-title">লেটার গ্রেড ও জিপিএ</div>
            <div class="summary-val" style="color: #b45309;">${result.grade} (${result.gradePoint.toFixed(2)})</div>
          </td>
          <td style="width: 25%;">
            <div class="summary-title">চূড়ান্ত ফলাফল</div>
            <div class="summary-val" style="color: ${result.resultStatus === 'Pass' ? '#047857' : '#b91c1c'};">
              ${result.resultStatus === 'Pass' ? 'Pass (কৃতকার্য)' : 'Fail (অকৃতকার্য)'}
            </div>
          </td>
        </tr>
      </table>

      ${
        result.remarks
          ? `<div class="remarks"><strong>শিক্ষকের মূল্যায়ন / মন্তব্য:</strong> ${result.remarks}</div>`
          : ''
      }

      <table class="sign-table">
        <tr>
          <td style="width: 33%;">
            <div class="sign-line"></div>
            <div>শ্রেণি শিক্ষকের স্বাক্ষর</div>
          </td>
          <td style="width: 33%;">
            <div style="width: 70px; height: 70px; border: 2px solid #064e3b; border-radius: 50%; margin: 0 auto 5px auto; line-height: 70px; font-size: 8pt; color: #064e3b; font-weight: bold;">
              স্কুল সিল
            </div>
          </td>
          <td style="width: 33%;">
            <div class="sign-line"></div>
            <div><strong>অধ্যক্ষ / প্রধান শিক্ষক</strong></div>
            <div style="font-size: 8pt; color: #64748b;">${schoolInfo.nameBangla}</div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', wordHtml], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeName = result.name.replace(/[^a-zA-Z0-9\u0980-\u09FF_-]/g, '_');
  a.download = `${safeName}_Roll_${result.roll}_Marksheet.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Export All Results into a Word Document Tabular Report
export function exportAllResultsToWord(results: StudentResult[], schoolInfo: SchoolInfo): void {
  const allSubjectNames = Array.from(
    new Set(results.flatMap((r) => r.subjects.map((s) => s.subjectName)))
  );

  const tableHeaderSubjects = allSubjectNames
    .map((sub) => `<th style="border: 1px solid #064e3b; padding: 6px; font-size: 9pt;">${sub}</th>`)
    .join('');

  const rows = results
    .map((r, idx) => {
      const subjectCols = allSubjectNames
        .map((sub) => {
          const found = r.subjects.find((s) => s.subjectName === sub);
          return `<td style="border: 1px solid #cbd5e1; padding: 5px; text-align: center; font-size: 9pt;">${
            found ? found.marks : '-'
          }</td>`;
        })
        .join('');

      return `
        <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f9fafb'};">
          <td style="border: 1px solid #cbd5e1; padding: 5px; text-align: center;">${r.roll}</td>
          <td style="border: 1px solid #cbd5e1; padding: 5px; font-family: monospace;">${r.studentId}</td>
          <td style="border: 1px solid #cbd5e1; padding: 5px; font-weight: bold;">${r.name}</td>
          <td style="border: 1px solid #cbd5e1; padding: 5px;">${r.class}</td>
          <td style="border: 1px solid #cbd5e1; padding: 5px;">${r.examType}</td>
          ${subjectCols}
          <td style="border: 1px solid #cbd5e1; padding: 5px; text-align: center; font-weight: bold; color: #064e3b;">${r.totalMarks}/${r.totalFullMarks}</td>
          <td style="border: 1px solid #cbd5e1; padding: 5px; text-align: center;">${r.percentage}%</td>
          <td style="border: 1px solid #cbd5e1; padding: 5px; text-align: center; font-weight: bold; color: #b45309;">${r.grade}</td>
          <td style="border: 1px solid #cbd5e1; padding: 5px; text-align: center; font-weight: bold; color: ${
            r.resultStatus === 'Pass' ? '#047857' : '#b91c1c'
          };">${r.resultStatus}</td>
        </tr>
      `;
    })
    .join('');

  const wordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>সকল ফলাফল বিবরণী - ${schoolInfo.nameBangla}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 20px; font-size: 10pt; }
        .header { text-align: center; border-bottom: 2px solid #064e3b; padding-bottom: 10px; margin-bottom: 15px; }
        .school-title { font-size: 20pt; font-weight: bold; color: #064e3b; margin: 0; }
        .school-sub { font-size: 12pt; color: #b45309; font-weight: bold; margin: 3px 0; }
        .report-title { font-size: 12pt; font-weight: bold; background-color: #064e3b; color: white; display: inline-block; padding: 4px 12px; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { background-color: #064e3b; color: white; border: 1px solid #064e3b; padding: 6px; font-size: 9pt; }
        td { border: 1px solid #cbd5e1; padding: 5px; font-size: 9pt; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="school-title">${schoolInfo.nameBangla}</div>
        <div class="school-sub">${schoolInfo.name}</div>
        <div>${schoolInfo.address} | ফোন: ${schoolInfo.phone} | স্থাপিত: ${schoolInfo.established}</div>
        <div class="report-title">শিক্ষার্থীদের সামগ্রিক পরীক্ষার ফলাফল শিট (${results.length} জন)</div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 5%;">রোল</th>
            <th style="width: 10%;">আইডি</th>
            <th style="width: 18%;">নাম</th>
            <th style="width: 9%;">শ্রেণি</th>
            <th style="width: 8%;">পরীক্ষা</th>
            ${tableHeaderSubjects}
            <th style="width: 10%;">মোট নম্বর</th>
            <th style="width: 7%;">শতকরা</th>
            <th style="width: 6%;">গ্রেড</th>
            <th style="width: 7%;">ফলাফল</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', wordHtml], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Fulkoli_All_Results_${new Date().toISOString().slice(0, 10)}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Excel Export for Results
export function exportResultsToExcel(results: StudentResult[], filename = 'Fulkoli_Results.xlsx'): void {
  // Collect all unique subjects for headers
  const allSubjectNames = Array.from(
    new Set(results.flatMap((r) => r.subjects.map((s) => s.subjectName)))
  );

  const flatRows = results.map((r) => {
    const row: Record<string, string | number> = {
      'Student ID': r.studentId,
      'Roll': r.roll,
      'Name': r.name,
      'Class': r.class,
      'Exam Type': r.examType,
      'Year': r.year,
      'Term / Exam': r.termOrMonth || '',
    };

    // Add subject marks
    allSubjectNames.forEach((sub) => {
      const found = r.subjects.find((s) => s.subjectName === sub);
      row[sub] = found ? `${found.marks}/${found.fullMarks}` : '-';
    });

    row['Total Marks (মোট প্রাপ্ত)'] = r.totalMarks;
    row['Full Marks (মোট পূর্ণমান)'] = r.totalFullMarks;
    row['Percentage (শতকরা)'] = `${r.percentage}%`;
    row['Grade (গ্রেড)'] = r.grade;
    row['GPA'] = r.gradePoint.toFixed(2);
    row['Result (ফলাফল)'] = r.resultStatus;
    row['Remarks (মন্তব্য)'] = r.remarks || '';

    return row;
  });

  const ws = XLSX.utils.json_to_sheet(flatRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Results');
  XLSX.writeFile(wb, filename);
}

// Download Excel Template for easy mass entry
export function downloadExcelTemplate(): void {
  const sampleTemplateRows = [
    {
      'Student ID': 'FQS-2026-101',
      'Roll': '01',
      'Name': 'মুহাম্মাদ তাহমিদ ইসলাম',
      'Class': 'Class 3',
      'Exam Type': 'Monthly',
      'Year': '2026',
      'Term': 'অক্টোবর পরীক্ষা',
      'বাংলা': 85,
      'বাংলা পূর্ণমান': 100,
      'ইংরেজি': 90,
      'ইংরেজি পূর্ণমান': 100,
      'গণিত': 80,
      'গণিত পূর্ণমান': 100,
      'আরবি ও কুরআন': 95,
      'আরবি পূর্ণমান': 100,
      'মন্তব্য': 'মাশাআল্লাহ',
    },
    {
      'Student ID': 'FQS-2026-102',
      'Roll': '02',
      'Name': 'ফাতিমা জান্নাত',
      'Class': 'Class 3',
      'Exam Type': 'Monthly',
      'Year': '2026',
      'Term': 'অক্টোবর পরীক্ষা',
      'বাংলা': 78,
      'বাংলা পূর্ণমান': 100,
      'ইংরেজি': 82,
      'ইংরেজি পূর্ণমান': 100,
      'গণিত': 75,
      'গণিত পূর্ণমান': 100,
      'আরবি ও কুরআন': 88,
      'আরবি পূর্ণমান': 100,
      'মন্তব্য': 'উন্নত ফলাফল',
    },
  ];

  const ws = XLSX.utils.json_to_sheet(sampleTemplateRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template');
  XLSX.writeFile(wb, 'Fulkoli_Result_Template.xlsx');
}

// Parse uploaded Excel or CSV file
export async function parseExcelResults(file: File): Promise<StudentResult[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        const parsedResults: StudentResult[] = [];

        rows.forEach((row, idx) => {
          // Standardize column key search
          const findVal = (possibleKeys: string[]): any => {
            for (const key of Object.keys(row)) {
              const cleanKey = key.trim().toLowerCase();
              if (possibleKeys.some((p) => cleanKey.includes(p.toLowerCase()))) {
                return row[key];
              }
            }
            return '';
          };

          const studentId = String(findVal(['student id', 'studentid', 'আইডি', 'student_id']) || `FQS-${Date.now()}-${idx + 1}`).trim();
          const roll = String(findVal(['roll', 'রোল', 'roll no']) || `${idx + 1}`).trim();
          const name = String(findVal(['name', 'নাম', 'student name']) || 'শিক্ষার্থী').trim();
          const studentClass = (String(findVal(['class', 'শ্রেণি', 'শ্রেণী']) || 'Class 1').trim()) as StudentClass;
          const examType = (String(findVal(['exam type', 'exam', 'পরীক্ষা', 'ধরন']) || 'Monthly').trim()) as ExamType;
          const year = String(findVal(['year', 'সাল', 'বছর']) || new Date().getFullYear().toString()).trim();
          const term = String(findVal(['term', 'মাস', 'পরীক্ষার নাম', 'term / exam']) || '').trim();
          const remarks = String(findVal(['remarks', 'মন্তব্য']) || '').trim();

          // Extract subjects
          const subjectMarks: Array<{ subjectName: string; marks: number; fullMarks: number }> = [];

          // Known standard subject pairs
          const knownSubjects = [
            { name: 'বাংলা', markKeys: ['বাংলা', 'bangla'], fullKeys: ['বাংলা পূর্ণমান', 'bangla full'] },
            { name: 'ইংরেজি', markKeys: ['ইংরেজি', 'english'], fullKeys: ['ইংরেজি পূর্ণমান', 'english full'] },
            { name: 'গণিত', markKeys: ['গণিত', 'math', 'mathematics'], fullKeys: ['গণিত পূর্ণমান', 'math full'] },
            { name: 'আরবি ও কুরআন', markKeys: ['আরবি', 'arabic', 'কুরআন', 'quran'], fullKeys: ['আরবি পূর্ণমান', 'arabic full'] },
            { name: 'বিজ্ঞান', markKeys: ['বিজ্ঞান', 'science'], fullKeys: ['বিজ্ঞান পূর্ণমান', 'science full'] },
            { name: 'ইসলামিয়াত', markKeys: ['ইসলামিয়াত', 'islamiat', 'ধর্ম'], fullKeys: ['ইসলামিয়াত পূর্ণমান', 'religion full'] },
          ];

          for (const sub of knownSubjects) {
            const markVal = findVal(sub.markKeys);
            if (markVal !== '' && !isNaN(Number(markVal))) {
              const fullVal = findVal(sub.fullKeys);
              const full = !isNaN(Number(fullVal)) && Number(fullVal) > 0 ? Number(fullVal) : 100;
              subjectMarks.push({
                subjectName: sub.name,
                marks: Number(markVal),
                fullMarks: full,
              });
            }
          }

          // If no known subjects detected by specific name, inspect arbitrary remaining number columns
          if (subjectMarks.length === 0) {
            Object.keys(row).forEach((colName) => {
              const val = row[colName];
              const isMeta = ['id', 'roll', 'name', 'class', 'exam', 'year', 'term', 'total', 'grade', 'gpa', 'result', 'remarks'].some(
                (m) => colName.toLowerCase().includes(m)
              );
              if (!isMeta && typeof val === 'number') {
                subjectMarks.push({
                  subjectName: colName,
                  marks: val,
                  fullMarks: 100,
                });
              }
            });
          }

          // Fallback if none parsed
          if (subjectMarks.length === 0) {
            subjectMarks.push({ subjectName: 'সাধারণ মূল্যায়ন', marks: 80, fullMarks: 100 });
          }

          const stats = computeResultStats(subjectMarks);

          parsedResults.push({
            id: `excel-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
            studentId,
            roll,
            name,
            class: studentClass,
            examType,
            year,
            termOrMonth: term || `${examType} Exam`,
            subjects: subjectMarks,
            totalMarks: stats.totalMarks,
            totalFullMarks: stats.totalFullMarks,
            percentage: stats.percentage,
            grade: stats.grade,
            gradePoint: stats.gradePoint,
            resultStatus: stats.resultStatus,
            remarks,
          });
        });

        resolve(parsedResults);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
}
