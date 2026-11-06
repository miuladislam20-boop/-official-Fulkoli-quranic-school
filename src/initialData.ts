import { SchoolInfo, Teacher, Notice, StudentResult } from '../types';
import { computeResultStats } from '../utils/gradeCalculator';
import heroBannerImg from '../assets/images/hero_school_campus_1793926973739.jpg';
import learningSceneImg from '../assets/images/school_learning_scene_1793926974423.jpg';

export const initialSchoolInfo: SchoolInfo = {
  name: 'Fulkoli Quranic School',
  nameBangla: 'ফুলকলি কুরআনিক স্কুল',
  established: '২০১৭',
  address: 'ফুলবাড়ী, দক্ষিণপাড়া, টিলা মসজিদ, বগুড়া',
  phone: '01716326885',
  altPhone: '01716326885',
  email: 'fulkoli.quranic.school@gmail.com',
  eiinNumber: 'FQS-BOG-2017',
  tagline: 'দ্বীনি ও আধুনিক শিক্ষার এক অনন্য সমন্বয়',
  aboutHistory:
    'ফুলকলি কুরআনিক স্কুল ২০১৭ সালে বগুড়ার ফুলবাড়ী দক্ষিণপাড়া টিলা মসজিদ সংলগ্ন মনোরম ও নিরিবিলি পরিবেশে প্রতিষ্ঠিত হয়। এটি প্লে গ্রুপ থেকে পঞ্চম শ্রেণি এবং হিফজুল কুরআন বিভাগ পর্যন্ত পাঠদানকারী একটি নির্ভরযোগ্য আদর্শ বিদ্যাপীঠ। এখানে বিশুদ্ধ কুরআন তেলাওয়াত, তাজবীদ ও আমলের পাশাপাশি সাধারণ জাতীয় শিক্ষাক্রম (বাংলা, ইংরেজি, গণিত, বিজ্ঞান ও তথ্যপ্রযুক্তি)-এ শিশুদের সুদক্ষ ও চরিত্রবান মানুষ হিসেবে গড়ে তোলা হয়।',
  classesOffered: [
    'Play Group (প্লে গ্রুপ)',
    'Nursery (নার্সারি)',
    'KG (কেজি)',
    'Class 1 (১ম শ্রেণি)',
    'Class 2 (২য় শ্রেণি)',
    'Class 3 (৩য় শ্রেণি)',
    'Class 4 (৪র্থ শ্রেণি)',
    'Class 5 (৫ম শ্রেণি)',
    'Hifz Section (হিফজুল কুরআন বিভাগ)',
  ],
  bannerUrl: heroBannerImg || '/images/hero_school_campus_1793926973739.jpg',
  logoUrl: '/images/school_emblem_logo_1793926973566.jpg',
  learningSceneUrl: learningSceneImg || '/images/school_learning_scene_1793926974423.jpg',
  headmasterName: 'মাওলানা মোঃ আব্দুল্লাহ আল মামুন',
  headmasterMessage:
    'বিসমিল্লাহির রাহমানির রাহিম। ফুলকলি কুরআনিক স্কুলে আমরা প্রতিটি শিশুকে আমানত হিসেবে গ্রহণ করি। আমাদের লক্ষ্য শিশুদের অন্তরে মহান আল্লাহর ভয়, রাসুলুল্লাহ (সা.)-এর সুন্নাহর ভালোবাসা এবং আধুনিক যুগের প্রয়োজনীয় জ্ঞান সৃষ্টি করা। সুশৃঙ্খল পরিবেশ ও সার্বক্ষণিক তদারকিতে আপনাদের সন্তানদের উজ্জ্বল ভবিষ্যৎ গঠনে আমরা বদ্ধপরিকর।',
};

export const initialTeachers: Teacher[] = [
  {
    id: 't-1',
    name: 'মাওলানা মোঃ আব্দুল্লাহ আল মামুন',
    designation: 'অধ্যক্ষ ও প্রধান শিক্ষক',
    mobile: '01716326885',
    qualifications: 'কামিল (হাদিস), এম.এ (ইসলামিক স্টাডিজ)',
    subjectSpeciality: 'কুরআন ও হাদিস বিভাগ',
    order: 1,
  },
  {
    id: 't-2',
    name: 'হাফেজ ক্বারী মোঃ জাহিদুল ইসলাম',
    designation: 'হিফজুল কুরআন বিভাগীয় প্রধান',
    mobile: '01716326885',
    qualifications: 'হাফেজে কুরআন, হুসনুল ক্বিরাত (আন্তর্জাতিক সনদ)',
    subjectSpeciality: 'হিফজ ও তাজবীদ',
    order: 2,
  },
  {
    id: 't-3',
    name: 'মোঃ রফিকুল ইসলাম',
    designation: 'সিনিয়র শিক্ষক (ইংরেজি ও গণিত)',
    mobile: '01716326885',
    qualifications: 'বি.এসসি (অনার্স), এম.এসসি (গণিত)',
    subjectSpeciality: 'গণিত ও বিজ্ঞান',
    order: 3,
  },
  {
    id: 't-4',
    name: 'মাওলানা মোঃ আহসান হাবীব',
    designation: 'সহকারী শিক্ষক (আরবি ও ইসলামিয়াত)',
    mobile: '01716326885',
    qualifications: 'দাওরায়ে হাদিস (তাকমিল), ফাজিল',
    subjectSpeciality: 'আরবি ভাষা ও আকাঈদ',
    order: 4,
  },
  {
    id: 't-5',
    name: 'মোছাঃ ফাতেমা খাতুন',
    designation: 'শিক্ষিকা (প্রাথমিক ও নার্সারি বিভাগ)',
    mobile: '01716326885',
    qualifications: 'বি.এ (অনার্স), এম.এ (বাংলা সাহিত্য)',
    subjectSpeciality: 'বাংলা ও অঙ্কন',
    order: 5,
  },
  {
    id: 't-6',
    name: 'হাফেজ মোঃ তানভীর আহমেদ',
    designation: 'নাজেরা ও নুরানি শিক্ষক',
    mobile: '01716326885',
    qualifications: 'হাফেজে কুরআন, নুরানি মুয়াল্লিম প্রশিক্ষণপ্রাপ্ত',
    subjectSpeciality: 'নুরানি কায়দা ও আমপারা',
    order: 6,
  },
];

export const initialNotices: Notice[] = [
  {
    id: 'n-1',
    title: '২০২৭ শিক্ষাবর্ষে প্লে থেকে ৫ম শ্রেণি ও হিফজ শাখায় নতুন শিক্ষার্থী ভর্তি চলছে',
    date: '2026-11-05',
    category: 'ভর্তি',
    details:
      'এতদ্বারা সম্মানিত অভিভাবকগণের অবগতির জন্য জানানো যাচ্ছে যে, ফুলকলি কুরআনিক স্কুলে ২০২৭ শিক্ষাবর্ষে প্লে গ্রুপ থেকে ৫ম শ্রেণি এবং হিফজুল কুরআন বিভাগে নতুন শিক্ষার্থী ভর্তি কার্যক্রম শুরু হয়েছে। ফরম সংগ্রহ ও জমা দেওয়ার শেষ তারিখ আগামী ২০ ডিসেম্বর ২০২৬। অনলাইন বা অফিস কক্ষ থেকে সরাসরি ফরম পূরণ করা যাবে।',
    isImportant: true,
  },
  {
    id: 'n-2',
    title: 'অক্টোবর মাসের মাসিক পরীক্ষার ফলাফল ও প্রগ্রেস রিপোর্ট প্রকাশ',
    date: '2026-10-31',
    category: 'পরীক্ষা',
    details:
      'সকল শ্রেণির শিক্ষার্থীদের অক্টোবর মাসের মাসিক পরীক্ষার ফলাফল আজ ওয়েবসাইটে ও নোটিশ বোর্ডে প্রকাশ করা হয়েছে। শিক্ষার্থীরা তাদের রোল অথবা স্টুডেন্ট আইডি দিয়ে ওয়েবসাইট থেকে সম্পূর্ণ মার্কশিট দেখতে ও প্রিন্ট করতে পারবে।',
    isImportant: true,
  },
  {
    id: 'n-3',
    title: 'বার্ষিক ক্রীড়া ও সাংস্কৃতিক প্রতিযোগিতা ২০২৬ সংক্রান্ত বিজ্ঞপ্তি',
    date: '2026-10-15',
    category: 'সাধারণ',
    details:
      'আগামী ১৫ নভেম্বর বিদ্যালয় প্রাঙ্গণে বার্ষিক ক্বিরাত, আজান, হামদ-নাত এবং মেধা যাচাই প্রতিযোগিতা অনুষ্ঠিত হবে। আগ্রহী শিক্ষার্থীদের নিজ নিজ শ্রেণি শিক্ষকের নিকট নাম তালিকাভুক্ত করার নির্দেশ দেওয়া হলো।',
    isImportant: false,
  },
  {
    id: 'n-4',
    title: 'হিফজুল কুরআন বিভাগের বিশেষ ছবক প্রদান ও দোয়া মাহফিল',
    date: '2026-09-28',
    category: 'সাধারণ',
    details:
      'হিফজুল কুরআন বিভাগের নতুন হাফেজ শিক্ষার্থীদের দস্তারবন্দী ও নতুন পারা শুরু উপলক্ষে বিশেষ দোয়া মাহফিল অনুষ্ঠিত হবে। সকল অভিভাবক ও শুভানুধ্যায়ীদের উপস্থিতি কামনা করা হচ্ছে।',
    isImportant: false,
  },
];

const sampleStudent1Subjects = [
  { subjectName: 'বাংলা', marks: 85, fullMarks: 100 },
  { subjectName: 'ইংরেজি', marks: 90, fullMarks: 100 },
  { subjectName: 'গণিত', marks: 80, fullMarks: 100 },
  { subjectName: 'আরবি ও কুরআন', marks: 95, fullMarks: 100 },
];
const s1Stats = computeResultStats(sampleStudent1Subjects);

const sampleStudent2Subjects = [
  { subjectName: 'বাংলা', marks: 92, fullMarks: 100 },
  { subjectName: 'ইংরেজি', marks: 88, fullMarks: 100 },
  { subjectName: 'গণিত', marks: 96, fullMarks: 100 },
  { subjectName: 'আরবি ও কুরআন', marks: 98, fullMarks: 100 },
  { subjectName: 'বিজ্ঞান', marks: 89, fullMarks: 100 },
];
const s2Stats = computeResultStats(sampleStudent2Subjects);

const sampleStudent3Subjects = [
  { subjectName: 'বাংলা', marks: 74, fullMarks: 100 },
  { subjectName: 'ইংরেজি', marks: 68, fullMarks: 100 },
  { subjectName: 'গণিত', marks: 78, fullMarks: 100 },
  { subjectName: 'আরবি ও কুরআন', marks: 82, fullMarks: 100 },
];
const s3Stats = computeResultStats(sampleStudent3Subjects);

const sampleStudent4WeeklySubjects = [
  { subjectName: 'বাংলা', marks: 23, fullMarks: 25 },
  { subjectName: 'ইংরেজি', marks: 22, fullMarks: 25 },
  { subjectName: 'গণিত', marks: 24, fullMarks: 25 },
  { subjectName: 'আরবি ও কুরআন', marks: 25, fullMarks: 25 },
];
const s4Stats = computeResultStats(sampleStudent4WeeklySubjects);

export const initialResults: StudentResult[] = [
  {
    id: 'res-1',
    studentId: 'FQS-2026-01',
    roll: '01',
    name: 'মুহাম্মাদ তাহমিদ ইসলাম',
    class: 'Class 3',
    examType: 'Monthly',
    year: '2026',
    termOrMonth: 'অক্টোবর মাসিক পরীক্ষা',
    subjects: sampleStudent1Subjects,
    ...s1Stats,
    remarks: 'মাশাআল্লাহ! অত্যন্ত চমৎকার ফলাফল ও পাঠোন্নতি।',
  },
  {
    id: 'res-2',
    studentId: 'FQS-2026-02',
    roll: '02',
    name: 'ফাতিমা জান্নাত মেহজাবিন',
    class: 'Class 5',
    examType: 'Monthly',
    year: '2026',
    termOrMonth: 'অক্টোবর মাসিক পরীক্ষা',
    subjects: sampleStudent2Subjects,
    ...s2Stats,
    remarks: 'অসাধারণ মেধার স্বাক্ষর! প্রথম স্থান অর্জন করেছে।',
  },
  {
    id: 'res-3',
    studentId: 'FQS-2026-03',
    roll: '03',
    name: 'আব্দুর রহমান তাসকিন',
    class: 'Class 3',
    examType: 'Monthly',
    year: '2026',
    termOrMonth: 'অক্টোবর মাসিক পরীক্ষা',
    subjects: sampleStudent3Subjects,
    ...s3Stats,
    remarks: 'ভালো ফল। ইংরেজি বিষয়ে আরও একটু মনোযোগ প্রয়োজন।',
  },
  {
    id: 'res-4',
    studentId: 'FQS-2026-01',
    roll: '01',
    name: 'মুহাম্মাদ তাহমিদ ইসলাম',
    class: 'Class 3',
    examType: 'Weekly',
    year: '2026',
    termOrMonth: 'সাপ্তাহিক মূল্যায়ন-৪',
    subjects: sampleStudent4WeeklySubjects,
    ...s4Stats,
    remarks: 'সাপ্তাহিক ধারাবাহিকতায় শ্রেষ্ঠত্ব প্রদর্শন।',
  },
  {
    id: 'res-5',
    studentId: 'FQS-2025-01',
    roll: '01',
    name: 'মুহাম্মাদ তাহমিদ ইসলাম',
    class: 'Class 2',
    examType: 'Annual',
    year: '2025',
    termOrMonth: 'বার্ষিক চূড়ান্ত পরীক্ষা',
    subjects: [
      { subjectName: 'বাংলা', marks: 88, fullMarks: 100 },
      { subjectName: 'ইংরেজি', marks: 85, fullMarks: 100 },
      { subjectName: 'গণিত', marks: 92, fullMarks: 100 },
      { subjectName: 'আরবি ও কুরআন', marks: 96, fullMarks: 100 },
    ],
    ...computeResultStats([
      { subjectName: 'বাংলা', marks: 88, fullMarks: 100 },
      { subjectName: 'ইংরেজি', marks: 85, fullMarks: 100 },
      { subjectName: 'গণিত', marks: 92, fullMarks: 100 },
      { subjectName: 'আরবি ও কুরআন', marks: 96, fullMarks: 100 },
    ]),
    remarks: 'পরবর্তী শ্রেণিতে মেধার ভিত্তিতে উত্তীর্ণ।',
  },
  {
    id: 'res-6',
    studentId: 'FQS-2026-10',
    roll: '10',
    name: 'আহনাফ সাদিক',
    class: 'Class 1',
    examType: 'Monthly',
    year: '2026',
    termOrMonth: 'অক্টোবর মাসিক পরীক্ষা',
    subjects: [
      { subjectName: 'বাংলা', marks: 80, fullMarks: 100 },
      { subjectName: 'ইংরেজি', marks: 82, fullMarks: 100 },
      { subjectName: 'গণিত', marks: 85, fullMarks: 100 },
      { subjectName: 'আরবি ও কুরআন', marks: 90, fullMarks: 100 },
    ],
    ...computeResultStats([
      { subjectName: 'বাংলা', marks: 80, fullMarks: 100 },
      { subjectName: 'ইংরেজি', marks: 82, fullMarks: 100 },
      { subjectName: 'গণিত', marks: 85, fullMarks: 100 },
      { subjectName: 'আরবি ও কুরআন', marks: 90, fullMarks: 100 },
    ]),
    remarks: 'সন্তোষজনক ফলাফল। নিয়মিত ক্লাসে উপস্থিতি প্রশংসনীয়।',
  },
];
