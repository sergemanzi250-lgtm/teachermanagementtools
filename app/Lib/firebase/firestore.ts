import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  Timestamp,
} from 'firebase/firestore';
import { db, auth } from './firebaseConf';
import {
  RebLessonPlan,
  RtbSessionPlan,
  NurseryLessonPlan,
  LessonPlan,
} from '../types/type';

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

// Lesson Plans CRUD
export async function saveLessonPlan(
  userId: string,
  planData: Omit<RebLessonPlan | RtbSessionPlan | NurseryLessonPlan, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.LESSON_PLANS), {
      ...planData,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving lesson plan:', error);
    throw new Error(`Failed to save lesson plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function updateLessonPlan(
  planId: string,
  updates: Partial<RebLessonPlan | RtbSessionPlan | NurseryLessonPlan>
): Promise<void> {
  try {
    const planRef = doc(db, COLLECTIONS.LESSON_PLANS, planId);
    await updateDoc(planRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating lesson plan:', error);
    throw new Error(`Failed to update lesson plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteLessonPlan(planId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.LESSON_PLANS, planId));
  } catch (error) {
    console.error('Error deleting lesson plan:', error);
    throw new Error(`Failed to delete lesson plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getLessonPlan(planId: string): Promise<LessonPlan | null> {
  try {
    const docSnap = await getDoc(doc(db, COLLECTIONS.LESSON_PLANS, planId));
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as LessonPlan;
    }
    return null;
  } catch (error) {
    console.error('Error getting lesson plan:', error);
    throw new Error(`Failed to get lesson plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getUserLessonPlans(userId: string, limitCount: number = 50): Promise<LessonPlan[]> {
  try {
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount),
    ];

    const q = query(collection(db, COLLECTIONS.LESSON_PLANS), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as LessonPlan));
  } catch (error) {
    console.error('Error getting user lesson plans:', error);
    throw new Error(`Failed to get lesson plans: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getLessonPlansByFormat(
  userId: string,
  format: 'REB' | 'RTB' | 'NURSERY',
  limitCount: number = 50
): Promise<LessonPlan[]> {
  try {
    // Client-side only: use client SDK
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      where('format', '==', format),
      orderBy('createdAt', 'desc'),
      limit(limitCount),
    ];

    const q = query(collection(db, COLLECTIONS.LESSON_PLANS), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as LessonPlan));
  } catch (error) {
    console.error('Error getting lesson plans by format:', error);
    throw new Error(`Failed to get lesson plans: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Generic document CRUD functions
export async function saveDocument<T extends { userId: string }>(
  collectionName: string,
  userId: string,
  data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    // Client-side only: use client SDK
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error saving document in ${collectionName}:`, error);
    throw new Error(
      `Failed to save document: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function updateDocument<T>(
  collectionName: string,
  docId: string,
  updates: Partial<T>
): Promise<void> {
  try {
    // Client-side only: use client SDK
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw new Error(
      `Failed to update document: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function deleteDocument(collectionName: string, docId: string): Promise<void> {
  try {
    // Client-side only: use client SDK
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    console.error(`Error deleting document in ${collectionName}:`, error);
    throw new Error(
      `Failed to delete document: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
  try {
    // Client-side only: use client SDK
    const docSnap = await getDoc(doc(db, collectionName, docId));
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as T;
    }
    return null;
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw new Error(
      `Failed to get document: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function getUserDocuments<T extends { userId: string }>(
  collectionName: string,
  userId: string,
  limitCount: number = 50
): Promise<T[]> {
  try {
    // Client-side only: use client SDK
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount),
    ];

    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as unknown as T));
  } catch (error) {
    console.error(`Error getting user documents from ${collectionName}:`, error);
    throw new Error(
      `Failed to get documents: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// Quiz functions
export async function saveQuiz(userId: string, quizData: Record<string, unknown>): Promise<string> {
  return saveDocument(COLLECTIONS.QUIZZES, userId, { userId, ...quizData } as any);
}

export async function getUserQuizzes(userId: string): Promise<Record<string, unknown>[]> {
  return getUserDocuments(COLLECTIONS.QUIZZES, userId);
}

export async function deleteQuiz(quizId: string): Promise<void> {
  return deleteDocument(COLLECTIONS.QUIZZES, quizId);
}

// Rubric functions
export async function saveRubric(userId: string, rubricData: Record<string, unknown>): Promise<string> {
  return saveDocument(COLLECTIONS.RUBRICS, userId, { userId, ...rubricData } as any);
}

export async function getUserRubrics(userId: string): Promise<Record<string, unknown>[]> {
  return getUserDocuments(COLLECTIONS.RUBRICS, userId);
}

export async function deleteRubric(rubricId: string): Promise<void> {
  return deleteDocument(COLLECTIONS.RUBRICS, rubricId);
}

// Scheme of Work functions
export async function saveSchemeOfWork(userId: string, schemeData: Record<string, unknown>): Promise<string> {
  return saveDocument(COLLECTIONS.SCHEMES_OF_WORK, userId, { userId, ...schemeData } as any);
}

export async function getUserSchemesOfWork(userId: string): Promise<Record<string, unknown>[]> {
  return getUserDocuments(COLLECTIONS.SCHEMES_OF_WORK, userId);
}

export async function deleteSchemeOfWork(schemeId: string): Promise<void> {
  return deleteDocument(COLLECTIONS.SCHEMES_OF_WORK, schemeId);
}

// Unit Plan functions
export async function saveUnitPlan(userId: string, planData: Record<string, unknown>): Promise<string> {
  return saveDocument(COLLECTIONS.UNIT_PLANS, userId, { userId, ...planData } as any);
}

export async function getUserUnitPlans(userId: string): Promise<Record<string, unknown>[]> {
  return getUserDocuments(COLLECTIONS.UNIT_PLANS, userId);
}

export async function deleteUnitPlan(planId: string): Promise<void> {
  return deleteDocument(COLLECTIONS.UNIT_PLANS, planId);
}

// Activity functions
export async function saveActivity(userId: string, activityData: Record<string, unknown>): Promise<string> {
  return saveDocument(COLLECTIONS.ACTIVITIES, userId, { userId, ...activityData } as any);
}

export async function getUserActivities(userId: string): Promise<Record<string, unknown>[]> {
  return getUserDocuments(COLLECTIONS.ACTIVITIES, userId);
}

export async function deleteActivity(activityId: string): Promise<void> {
  return deleteDocument(COLLECTIONS.ACTIVITIES, activityId);
}
