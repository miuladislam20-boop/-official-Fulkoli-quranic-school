export type ExamType = 'Weekly' | 'Monthly' | 'Annual';

export type StudentClass =
  | 'Play Group'
  | 'Nursery'
  | 'KG'
  | 'Class 1'
  | 'Class 2'
  | 'Class 3'
  | 'Class 4'
  | 'Class 5'
  | 'Hifz Section';

export interface SubjectMark {
  subjectName: string;
  marks: number;
  fullMarks: number;
}

export interface StudentResult {
  id: string;
  studentId: string;
  roll: string;
  name: string;
  class: StudentClass | string;
  examType: ExamType;
  year: string;
  termOrMonth?: string;
  subjects: SubjectMark[];
  totalMarks: number;
  totalFullMarks: number;
  percentage: number;
  grade: string;
  gradePoint: number;
  resultStatus: 'Pass' | 'Fail';
  remarks?: string;
}

export interface Teacher {
  id: string;
  name: string;
  designation: string;
  mobile: string;
  photoUrl?: string;
  qualifications: string;
  subjectSpeciality?: string;
  order?: number;
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  category: 'পরীক্ষা' | 'ভর্তি' | 'ছুটি' | 'সাধারণ';
  details: string;
  isImportant?: boolean;
}

export interface AdmissionApplication {
  id: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  phone: string;
  targetClass: string;
  dob: string;
  address: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface SchoolInfo {
  name: string;
  nameBangla: string;
  established: string;
  address: string;
  phone: string;
  altPhone?: string;
  email: string;
  eiinNumber?: string;
  tagline: string;
  aboutHistory: string;
  classesOffered: string[];
  bannerUrl: string;
  logoUrl: string;
  learningSceneUrl: string;
  headmasterMessage: string;
  headmasterName: string;
}

export interface StudentAccount {
  id: string;
  name: string;
  studentId: string;
  roll: string;
  class: string;
  phone: string;
  password: string;
  createdAt: string;
  photoUrl?: string;
}

