import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore, Timestamp } from 'firebase-admin/firestore';

let adminApp: App | undefined;
let adminDb: Firestore | undefined;

function getAdminApp(): App {
  if (adminApp) {
    return adminApp;
  }

  const apps = getApps();
  if (apps.length > 0) {
    adminApp = apps[0];
    return adminApp;
  }

  // Initialize with project ID only (uses Application Default Credentials or emulator)
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'mwarimu-28951';
  
  // Check if we have service account credentials
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  
  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      adminApp = initializeApp({
        credential: cert(serviceAccount),
        projectId,
      });
    } catch (error) {
      console.warn('Failed to parse service account key, using project ID only:', error);
      adminApp = initializeApp({ projectId });
    }
  } else {
    // Initialize without credentials - will work with emulator or if running on GCP
    adminApp = initializeApp({ projectId });
  }

  return adminApp;
}

export function getAdminDb(): Firestore {
  if (adminDb) {
    return adminDb;
  }
  
  const app = getAdminApp();
  adminDb = getFirestore(app);
  return adminDb;
}

// Collection names
export const COLLECTIONS = {
  LESSON_PLANS: 'lessonPlans',
  QUIZZES: 'quizzes',
  RUBRICS: 'rubrics',
  SCHEMES_OF_WORK: 'schemesOfWork',
  UNIT_PLANS: 'unitPlans',
  ACTIVITIES: 'activities',
  USERS: 'users',
};

// Server-side save function
export async function saveLessonPlanServer(
  userId: string,
  planData: Record<string, unknown>
): Promise<string> {
  try {
    const db = getAdminDb();
    const docRef = await db.collection(COLLECTIONS.LESSON_PLANS).add({
      ...planData,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving lesson plan (server):', error);
    throw new Error(`Failed to save lesson plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Generic server-side save function
export async function saveDocumentServer(
  collectionName: string,
  userId: string,
  data: Record<string, unknown>
): Promise<string> {
  try {
    const db = getAdminDb();
    const docRef = await db.collection(collectionName).add({
      ...data,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error saving document in ${collectionName} (server):`, error);
    throw new Error(`Failed to save document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Get document by ID (server-side)
export async function getDocumentServer<T>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  try {
    const db = getAdminDb();
    const docSnap = await db.collection(collectionName).doc(docId).get();
    if (docSnap.exists) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as T;
    }
    return null;
  } catch (error) {
    console.error(`Error getting document from ${collectionName} (server):`, error);
    throw new Error(`Failed to get document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Get user documents (server-side)
export async function getUserDocumentsServer<T>(
  collectionName: string,
  userId: string,
  limitCount: number = 50
): Promise<T[]> {
  try {
    const db = getAdminDb();
    const querySnapshot = await db
      .collection(collectionName)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limitCount)
      .get();

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as unknown as T));
  } catch (error) {
    console.error(`Error getting user documents from ${collectionName} (server):`, error);
    throw new Error(`Failed to get documents: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Update document (server-side)
export async function updateDocumentServer(
  collectionName: string,
  docId: string,
  updates: Record<string, unknown>
): Promise<void> {
  try {
    const db = getAdminDb();
    await db.collection(collectionName).doc(docId).update({
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error(`Error updating document in ${collectionName} (server):`, error);
    throw new Error(`Failed to update document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Delete document (server-side)
export async function deleteDocumentServer(
  collectionName: string,
  docId: string
): Promise<void> {
  try {
    const db = getAdminDb();
    await db.collection(collectionName).doc(docId).delete();
  } catch (error) {
    console.error(`Error deleting document in ${collectionName} (server):`, error);
    throw new Error(`Failed to delete document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Specific save functions for each collection
export async function saveQuizServer(userId: string, quizData: Record<string, unknown>): Promise<string> {
  return saveDocumentServer(COLLECTIONS.QUIZZES, userId, quizData);
}

export async function saveRubricServer(userId: string, rubricData: Record<string, unknown>): Promise<string> {
  return saveDocumentServer(COLLECTIONS.RUBRICS, userId, rubricData);
}

export async function saveSchemeOfWorkServer(userId: string, schemeData: Record<string, unknown>): Promise<string> {
  return saveDocumentServer(COLLECTIONS.SCHEMES_OF_WORK, userId, schemeData);
}

export async function saveUnitPlanServer(userId: string, planData: Record<string, unknown>): Promise<string> {
  return saveDocumentServer(COLLECTIONS.UNIT_PLANS, userId, planData);
}

export async function saveActivityServer(userId: string, activityData: Record<string, unknown>): Promise<string> {
  return saveDocumentServer(COLLECTIONS.ACTIVITIES, userId, activityData);
}
