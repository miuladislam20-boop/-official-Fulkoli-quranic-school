import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  writeBatch,
  onSnapshot,
  WriteBatch,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  SchoolInfo,
  Teacher,
  Notice,
  StudentResult,
  AdmissionApplication,
  StudentAccount,
} from '../types';
import {
  initialSchoolInfo,
  initialTeachers,
  initialNotices,
  initialResults,
} from '../data/initialData';

const COLLECTIONS = {
  SCHOOL: 'schoolInfo',
  TEACHERS: 'teachers',
  RESULTS: 'results',
  NOTICES: 'notices',
  APPLICATIONS: 'applications',
  STUDENTS: 'students',
  SETTINGS: 'settings',
};

// Helper: Safely commit large batches in chunks of 400 (Firestore limit is 500)
async function commitInChunks(operations: Array<(batch: WriteBatch) => void>): Promise<void> {
  const CHUNK_SIZE = 400;
  for (let i = 0; i < operations.length; i += CHUNK_SIZE) {
    const chunk = operations.slice(i, i + CHUNK_SIZE);
    const batch = writeBatch(db);
    for (const op of chunk) {
      op(batch);
    }
    await batch.commit();
  }
}

// ----------------- SCHOOL INFO -----------------
export async function syncCloudSchoolInfo(): Promise<SchoolInfo | null> {
  try {
    const docRef = doc(db, COLLECTIONS.SCHOOL, 'main');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...initialSchoolInfo, ...(snap.data() as SchoolInfo) };
    } else {
      // Seed initial data to cloud on first setup
      await setDoc(docRef, initialSchoolInfo);
      return initialSchoolInfo;
    }
  } catch (err) {
    console.warn('Cloud sync error for schoolInfo, using local cache:', err);
    return null;
  }
}

export async function saveCloudSchoolInfo(info: SchoolInfo): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.SCHOOL, 'main');
    await setDoc(docRef, info);
  } catch (err) {
    console.error('Failed to save schoolInfo to cloud:', err);
  }
}

export function subscribeToCloudSchoolInfo(callback: (info: SchoolInfo) => void): Unsubscribe {
  try {
    const docRef = doc(db, COLLECTIONS.SCHOOL, 'main');
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          callback({ ...initialSchoolInfo, ...(snap.data() as SchoolInfo) });
        }
      },
      (err) => {
        console.warn('onSnapshot error for schoolInfo:', err);
      }
    );
  } catch {
    return () => {};
  }
}

// ----------------- TEACHERS -----------------
export async function syncCloudTeachers(): Promise<Teacher[] | null> {
  try {
    const colRef = collection(db, COLLECTIONS.TEACHERS);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list: Teacher[] = [];
      snap.forEach((d) => list.push(d.data() as Teacher));
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      return list;
    } else {
      // Seed initial teachers
      const ops: Array<(b: WriteBatch) => void> = initialTeachers.map((t) => (b) => {
        b.set(doc(db, COLLECTIONS.TEACHERS, t.id), t);
      });
      await commitInChunks(ops);
      return initialTeachers;
    }
  } catch (err) {
    console.warn('Cloud sync error for teachers:', err);
    return null;
  }
}

export async function saveCloudTeachers(teachers: Teacher[]): Promise<void> {
  try {
    const colRef = collection(db, COLLECTIONS.TEACHERS);
    const snap = await getDocs(colRef);
    const ops: Array<(b: WriteBatch) => void> = [];

    // Delete existing
    snap.forEach((d) => {
      ops.push((b) => b.delete(d.ref));
    });

    // Add updated
    teachers.forEach((t) => {
      ops.push((b) => b.set(doc(db, COLLECTIONS.TEACHERS, t.id), t));
    });

    await commitInChunks(ops);
  } catch (err) {
    console.error('Failed to save teachers to cloud:', err);
  }
}

export function subscribeToCloudTeachers(callback: (teachers: Teacher[]) => void): Unsubscribe {
  try {
    const colRef = collection(db, COLLECTIONS.TEACHERS);
    return onSnapshot(
      colRef,
      (snap) => {
        if (!snap.empty) {
          const list: Teacher[] = [];
          snap.forEach((d) => list.push(d.data() as Teacher));
          list.sort((a, b) => (a.order || 0) - (b.order || 0));
          callback(list);
        }
      },
      (err) => {
        console.warn('onSnapshot error for teachers:', err);
      }
    );
  } catch {
    return () => {};
  }
}

// ----------------- RESULTS -----------------
export async function syncCloudResults(): Promise<StudentResult[] | null> {
  try {
    const colRef = collection(db, COLLECTIONS.RESULTS);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list: StudentResult[] = [];
      snap.forEach((d) => list.push(d.data() as StudentResult));
      return list;
    } else {
      // Seed initial results
      const ops: Array<(b: WriteBatch) => void> = initialResults.map((r) => (b) => {
        b.set(doc(db, COLLECTIONS.RESULTS, r.id), r);
      });
      await commitInChunks(ops);
      return initialResults;
    }
  } catch (err) {
    console.warn('Cloud sync error for results:', err);
    return null;
  }
}

export async function saveCloudResults(results: StudentResult[]): Promise<void> {
  try {
    const colRef = collection(db, COLLECTIONS.RESULTS);
    const snap = await getDocs(colRef);
    const ops: Array<(b: WriteBatch) => void> = [];

    // Delete existing
    snap.forEach((d) => {
      ops.push((b) => b.delete(d.ref));
    });

    // Add updated results
    results.forEach((r) => {
      ops.push((b) => b.set(doc(db, COLLECTIONS.RESULTS, r.id), r));
    });

    await commitInChunks(ops);
  } catch (err) {
    console.error('Failed to save results to cloud:', err);
  }
}

export function subscribeToCloudResults(callback: (results: StudentResult[]) => void): Unsubscribe {
  try {
    const colRef = collection(db, COLLECTIONS.RESULTS);
    return onSnapshot(
      colRef,
      (snap) => {
        if (!snap.empty) {
          const list: StudentResult[] = [];
          snap.forEach((d) => list.push(d.data() as StudentResult));
          callback(list);
        }
      },
      (err) => {
        console.warn('onSnapshot error for results:', err);
      }
    );
  } catch {
    return () => {};
  }
}

// ----------------- NOTICES -----------------
export async function syncCloudNotices(): Promise<Notice[] | null> {
  try {
    const colRef = collection(db, COLLECTIONS.NOTICES);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list: Notice[] = [];
      snap.forEach((d) => list.push(d.data() as Notice));
      return list;
    } else {
      const ops: Array<(b: WriteBatch) => void> = initialNotices.map((n) => (b) => {
        b.set(doc(db, COLLECTIONS.NOTICES, n.id), n);
      });
      await commitInChunks(ops);
      return initialNotices;
    }
  } catch (err) {
    console.warn('Cloud sync error for notices:', err);
    return null;
  }
}

export async function saveCloudNotices(notices: Notice[]): Promise<void> {
  try {
    const colRef = collection(db, COLLECTIONS.NOTICES);
    const snap = await getDocs(colRef);
    const ops: Array<(b: WriteBatch) => void> = [];

    snap.forEach((d) => {
      ops.push((b) => b.delete(d.ref));
    });

    notices.forEach((n) => {
      ops.push((b) => b.set(doc(db, COLLECTIONS.NOTICES, n.id), n));
    });

    await commitInChunks(ops);
  } catch (err) {
    console.error('Failed to save notices to cloud:', err);
  }
}

export function subscribeToCloudNotices(callback: (notices: Notice[]) => void): Unsubscribe {
  try {
    const colRef = collection(db, COLLECTIONS.NOTICES);
    return onSnapshot(
      colRef,
      (snap) => {
        if (!snap.empty) {
          const list: Notice[] = [];
          snap.forEach((d) => list.push(d.data() as Notice));
          callback(list);
        }
      },
      (err) => {
        console.warn('onSnapshot error for notices:', err);
      }
    );
  } catch {
    return () => {};
  }
}

// ----------------- APPLICATIONS -----------------
export async function syncCloudApplications(): Promise<AdmissionApplication[] | null> {
  try {
    const colRef = collection(db, COLLECTIONS.APPLICATIONS);
    const snap = await getDocs(colRef);
    const list: AdmissionApplication[] = [];
    snap.forEach((d) => list.push(d.data() as AdmissionApplication));
    return list;
  } catch (err) {
    console.warn('Cloud sync error for applications:', err);
    return null;
  }
}

export async function saveCloudApplications(apps: AdmissionApplication[]): Promise<void> {
  try {
    const colRef = collection(db, COLLECTIONS.APPLICATIONS);
    const snap = await getDocs(colRef);
    const ops: Array<(b: WriteBatch) => void> = [];

    snap.forEach((d) => {
      ops.push((b) => b.delete(d.ref));
    });

    apps.forEach((a) => {
      ops.push((b) => b.set(doc(db, COLLECTIONS.APPLICATIONS, a.id), a));
    });

    await commitInChunks(ops);
  } catch (err) {
    console.error('Failed to save applications to cloud:', err);
  }
}

// ----------------- STUDENTS -----------------
export async function syncCloudStudents(): Promise<StudentAccount[] | null> {
  try {
    const colRef = collection(db, COLLECTIONS.STUDENTS);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list: StudentAccount[] = [];
      snap.forEach((d) => list.push(d.data() as StudentAccount));
      return list;
    }
    return null;
  } catch (err) {
    console.warn('Cloud sync error for students:', err);
    return null;
  }
}

export async function saveCloudStudents(students: StudentAccount[]): Promise<void> {
  try {
    const colRef = collection(db, COLLECTIONS.STUDENTS);
    const snap = await getDocs(colRef);
    const ops: Array<(b: WriteBatch) => void> = [];

    snap.forEach((d) => {
      ops.push((b) => b.delete(d.ref));
    });

    students.forEach((s) => {
      ops.push((b) => b.set(doc(db, COLLECTIONS.STUDENTS, s.id), s));
    });

    await commitInChunks(ops);
  } catch (err) {
    console.error('Failed to save students to cloud:', err);
  }
}

// ----------------- ADMIN PASSWORD -----------------
export async function syncCloudAdminPassword(): Promise<string | null> {
  try {
    const docRef = doc(db, COLLECTIONS.SETTINGS, 'security');
    const snap = await getDoc(docRef);
    if (snap.exists() && snap.data().adminPass) {
      return snap.data().adminPass as string;
    } else {
      await setDoc(docRef, { adminPass: 'kingkobra@me!3' });
      return 'kingkobra@me!3';
    }
  } catch (err) {
    console.warn('Cloud sync error for adminPass:', err);
    return null;
  }
}

export async function saveCloudAdminPassword(pass: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.SETTINGS, 'security');
    await setDoc(docRef, { adminPass: pass }, { merge: true });
  } catch (err) {
    console.error('Failed to save admin pass to cloud:', err);
  }
}
