import { MongoClient, Db, Collection, ObjectId } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

function getMongoClient(): MongoClient {
  if (client) {
    return client;
  }

  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  // For MongoDB Atlas, the URI should include the database name and credentials
  client = new MongoClient(mongoUri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    retryWrites: false,
  });

  return client;
}

export async function getMongoDb(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    const client = getMongoClient();
    await client.connect();
    
    // For this MongoDB Atlas instance, use the "default" database explicitly
    db = client.db('default');
    
    // Test the connection
    await db.admin().ping();
    
    console.log(`Successfully connected to MongoDB database: ${db.databaseName}`);
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error(`Failed to connect to MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
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

// Server-side save functions
export async function saveLessonPlanMongo(
  userId: string,
  planData: Record<string, unknown>
): Promise<string> {
  try {
    const database = await getMongoDb();
    const result = await database.collection(COLLECTIONS.LESSON_PLANS).insertOne({
      ...planData,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result.insertedId.toString();
  } catch (error) {
    console.error('Error saving lesson plan (MongoDB):', error);
    throw new Error(`Failed to save lesson plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function saveQuizMongo(
  userId: string,
  quizData: Record<string, unknown>
): Promise<string> {
  try {
    const database = await getMongoDb();
    const result = await database.collection(COLLECTIONS.QUIZZES).insertOne({
      ...quizData,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result.insertedId.toString();
  } catch (error) {
    console.error('Error saving quiz (MongoDB):', error);
    throw new Error(`Failed to save quiz: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function saveRubricMongo(
  userId: string,
  rubricData: Record<string, unknown>
): Promise<string> {
  try {
    const database = await getMongoDb();
    const result = await database.collection(COLLECTIONS.RUBRICS).insertOne({
      ...rubricData,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result.insertedId.toString();
  } catch (error) {
    console.error('Error saving rubric (MongoDB):', error);
    throw new Error(`Failed to save rubric: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function saveSchemeOfWorkMongo(
  userId: string,
  schemeData: Record<string, unknown>
): Promise<string> {
  try {
    const database = await getMongoDb();
    const result = await database.collection(COLLECTIONS.SCHEMES_OF_WORK).insertOne({
      ...schemeData,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result.insertedId.toString();
  } catch (error) {
    console.error('Error saving scheme of work (MongoDB):', error);
    throw new Error(`Failed to save scheme of work: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function saveUnitPlanMongo(
  userId: string,
  planData: Record<string, unknown>
): Promise<string> {
  try {
    const database = await getMongoDb();
    const result = await database.collection(COLLECTIONS.UNIT_PLANS).insertOne({
      ...planData,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result.insertedId.toString();
  } catch (error) {
    console.error('Error saving unit plan (MongoDB):', error);
    throw new Error(`Failed to save unit plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function saveActivityMongo(
  userId: string,
  activityData: Record<string, unknown>
): Promise<string> {
  try {
    const database = await getMongoDb();
    const result = await database.collection(COLLECTIONS.ACTIVITIES).insertOne({
      ...activityData,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result.insertedId.toString();
  } catch (error) {
    console.error('Error saving activity (MongoDB):', error);
    throw new Error(`Failed to save activity: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Generic server-side functions
export async function saveDocumentMongo(
  collectionName: string,
  userId: string,
  data: Record<string, unknown>
): Promise<string> {
  try {
    const database = await getMongoDb();
    const result = await database.collection(collectionName).insertOne({
      ...data,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result.insertedId.toString();
  } catch (error) {
    console.error(`Error saving document in ${collectionName} (MongoDB):`, error);
    throw new Error(`Failed to save document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getDocumentMongo<T>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  try {
    const database = await getMongoDb();
    const doc = await database.collection(collectionName).findOne({ _id: new ObjectId(docId) });
    
    if (doc) {
      return {
        id: doc._id.toString(),
        ...doc,
        _id: undefined,
      } as T;
    }
    return null;
  } catch (error) {
    console.error(`Error getting document from ${collectionName} (MongoDB):`, error);
    throw new Error(`Failed to get document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getUserDocumentsMongo<T>(
  collectionName: string,
  userId: string,
  limitCount: number = 50
): Promise<T[]> {
  try {
    const database = await getMongoDb();
    const docs = await database
      .collection(collectionName)
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limitCount)
      .toArray();

    return docs.map(doc => ({
      id: doc._id.toString(),
      ...doc,
      _id: undefined,
    } as unknown as T));
  } catch (error) {
    console.error(`Error getting user documents from ${collectionName} (MongoDB):`, error);
    throw new Error(`Failed to get documents: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function updateDocumentMongo(
  collectionName: string,
  docId: string,
  updates: Record<string, unknown>
): Promise<void> {
  try {
    const database = await getMongoDb();
    await database.collection(collectionName).updateOne(
      { _id: new ObjectId(docId) },
      { 
        $set: { 
          ...updates, 
          updatedAt: new Date() 
        } 
      }
    );
  } catch (error) {
    console.error(`Error updating document in ${collectionName} (MongoDB):`, error);
    throw new Error(`Failed to update document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteDocumentMongo(
  collectionName: string,
  docId: string
): Promise<void> {
  try {
    const database = await getMongoDb();
    await database.collection(collectionName).deleteOne({ _id: new ObjectId(docId) });
  } catch (error) {
    console.error(`Error deleting document from ${collectionName} (MongoDB):`, error);
    throw new Error(`Failed to delete document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}