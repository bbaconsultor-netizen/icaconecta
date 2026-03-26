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
  limit
} from 'firebase/firestore';
import { db } from '../firebase';

export const companiesCol = collection(db, 'companies');
export const diagnosticsCol = collection(db, 'diagnostics');
export const solutionsCol = collection(db, 'solutions');
export const indicatorsCol = collection(db, 'indicators');

// CRM Operations
export const addCompany = async (companyData: any) => {
  return await addDoc(companiesCol, {
    ...companyData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const getCompanies = async () => {
  const q = query(companiesCol, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Diagnostic Operations
export const saveDiagnostic = async (diagnosticData: any) => {
  const docRef = await addDoc(diagnosticsCol, {
    ...diagnosticData,
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

export const getLatestDiagnostic = async (companyId: string) => {
  const q = query(
    diagnosticsCol, 
    where('companyId', '==', companyId), 
    orderBy('createdAt', 'desc'),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};

// Marketplace Operations
export const getSolutions = async () => {
  const snapshot = await getDocs(solutionsCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Dashboard Operations
export const getIndicators = async () => {
  const q = query(indicatorsCol, orderBy('month', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
