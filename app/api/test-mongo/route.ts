import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/app/Lib/mongodb/mongodbAdmin';

export async function GET(request: NextRequest) {
  try {
    const db = await getMongoDb();
    
    // Test connection by trying to list collections
    const collections = await db.listCollections().toArray();
    
    return NextResponse.json(
      {
        success: true,
        message: 'MongoDB connection successful',
        database: db.databaseName,
        collections: collections.map(col => col.name),
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}