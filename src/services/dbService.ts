import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  getDoc,
  limit,
  deleteDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase';

export const companiesCol = collection(db, 'companies');
export const diagnosticsCol = collection(db, 'diagnostics');
export const solutionsCol = collection(db, 'solutions');
export const indicatorsCol = collection(db, 'indicators');
export const coursesCol = collection(db, 'courses');

// CRM Operations
export const addCompany = async (companyData: any) => {
  const user = auth.currentUser;
  return await addDoc(companiesCol, {
    ...companyData,
    uid: user?.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const getCompanies = async (userId?: string) => {
  let q;
  if (userId) {
    // Sin orderBy para evitar requerir un índice compuesto en Firestore
    q = query(companiesCol, where('uid', '==', userId));
  } else {
    q = query(companiesCol, orderBy('createdAt', 'desc'));
  }
  const snapshot = await getDocs(q);
  let results = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
  
  // Ordenar en memoria si se filtró por usuario
  if (userId) {
    results.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    });
  }
  
  return results;
};

export const deleteCompany = async (id: string) => {
  const companyRef = doc(db, 'companies', id);
  return await deleteDoc(companyRef);
};

export const updateCompany = async (id: string, companyData: any) => {
  const companyRef = doc(db, 'companies', id);
  return await updateDoc(companyRef, {
    ...companyData,
    updatedAt: serverTimestamp()
  });
};

// Diagnostic Operations
export const saveDiagnostic = async (diagnosticData: any) => {
  const user = auth.currentUser;
  const docRef = await addDoc(diagnosticsCol, {
    ...diagnosticData,
    uid: user?.uid,
    createdAt: serverTimestamp()
  });
  
  // Update company status
  if (diagnosticData.companyId) {
    const companyRef = doc(db, 'companies', diagnosticData.companyId);
    await updateDoc(companyRef, {
      status: 'Diagnosticada',
      maturityLevel: diagnosticData.maturityLevel,
      updatedAt: serverTimestamp()
    });
  }
  
  return docRef;
};

export const getLatestDiagnostic = async (companyId: string, type: 'digital' | 'marketing' = 'digital') => {
  const user = auth.currentUser;
  const q = query(
    diagnosticsCol, 
    where('companyId', '==', companyId), 
    where('uid', '==', user?.uid),
    where('type', '==', type)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  
  // Ordenar en memoria por fecha descendente
  const diagnostics = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
  diagnostics.sort((a, b) => {
    const dateA = a.createdAt?.toDate?.() || new Date(0);
    const dateB = b.createdAt?.toDate?.() || new Date(0);
    return dateB - dateA;
  });
  
  return diagnostics[0];
};

// Marketplace Operations
export const getSolutions = async () => {
  const snapshot = await getDocs(solutionsCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
};

export const addSolution = async (solutionData: any) => {
  return await addDoc(solutionsCol, {
    ...solutionData,
    createdAt: serverTimestamp()
  });
};

export const updateSolution = async (id: string, solutionData: any) => {
  const solutionRef = doc(db, 'solutions', id);
  return await updateDoc(solutionRef, {
    ...solutionData,
    updatedAt: serverTimestamp()
  });
};

export const deleteSolution = async (id: string) => {
  const solutionRef = doc(db, 'solutions', id);
  return await deleteDoc(solutionRef);
};

// Dashboard Operations
export const getIndicators = async () => {
  const q = query(indicatorsCol, orderBy('month', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
};

// Course Operations
export const getCourses = async () => {
  const q = query(coursesCol, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
};

export const addCourse = async (courseData: any) => {
  return await addDoc(coursesCol, {
    ...courseData,
    createdAt: serverTimestamp()
  });
};

export const updateCourse = async (id: string, courseData: any) => {
  const courseRef = doc(db, 'courses', id);
  return await updateDoc(courseRef, {
    ...courseData,
    updatedAt: serverTimestamp()
  });
};

export const deleteCourse = async (id: string) => {
  const courseRef = doc(db, 'courses', id);
  return await deleteDoc(courseRef);
};
