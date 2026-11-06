import { SubjectMark } from '../types';

export function calculateGradeAndPoint(percentage: number): { grade: string; gradePoint: number } {
  if (percentage >= 80) return { grade: 'A+', gradePoint: 5.0 };
  if (percentage >= 70) return { grade: 'A', gradePoint: 4.0 };
  if (percentage >= 60) return { grade: 'A-', gradePoint: 3.5 };
  if (percentage >= 50) return { grade: 'B', gradePoint: 3.0 };
  if (percentage >= 40) return { grade: 'C', gradePoint: 2.0 };
  if (percentage >= 33) return { grade: 'D', gradePoint: 1.0 };
  return { grade: 'F', gradePoint: 0.0 };
}

export function computeResultStats(subjects: SubjectMark[], passThresholdPercent = 33): {
  totalMarks: number;
  totalFullMarks: number;
  percentage: number;
  grade: string;
  gradePoint: number;
  resultStatus: 'Pass' | 'Fail';
} {
  if (!subjects || subjects.length === 0) {
    return {
      totalMarks: 0,
      totalFullMarks: 0,
      percentage: 0,
      grade: 'F',
      gradePoint: 0,
      resultStatus: 'Fail',
    };
  }

  const totalMarks = subjects.reduce((sum, s) => sum + (Number(s.marks) || 0), 0);
  const totalFullMarks = subjects.reduce((sum, s) => sum + (Number(s.fullMarks) || 100), 0);

  const percentage = totalFullMarks > 0 ? Number(((totalMarks / totalFullMarks) * 100).toFixed(2)) : 0;

  // Check if any subject is failed (obtained < 33% of full marks)
  const hasSubjectFail = subjects.some((s) => {
    const full = Number(s.fullMarks) || 100;
    const mark = Number(s.marks) || 0;
    return (mark / full) * 100 < passThresholdPercent;
  });

  const { grade, gradePoint } = calculateGradeAndPoint(percentage);
  const isPass = !hasSubjectFail && percentage >= passThresholdPercent;

  return {
    totalMarks,
    totalFullMarks,
    percentage,
    grade: isPass ? grade : 'F',
    gradePoint: isPass ? gradePoint : 0,
    resultStatus: isPass ? 'Pass' : 'Fail',
  };
}

export function toBengaliNumber(val: number | string | undefined | null): string {
  if (val === undefined || val === null) return '';
  const str = String(val);
  const banglaDigits: Record<string, string> = {
    '0': '০',
    '1': '১',
    '2': '২',
    '3': '৩',
    '4': '৪',
    '5': '৫',
    '6': '৬',
    '7': '৭',
    '8': '৮',
    '9': '৯',
    '.': '.',
    '%': '%',
  };

  return str
    .split('')
    .map((char) => banglaDigits[char] || char)
    .join('');
}
