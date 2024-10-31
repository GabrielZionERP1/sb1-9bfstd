import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { migrate } from 'drizzle-orm/vercel-postgres/migrator';
import * as schema from './schema';

const db = drizzle(sql, { schema });

export async function initDb() {
  try {
    console.log('Starting database migration...');
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Database migration completed successfully');
  } catch (error) {
    console.error('Error during database migration:', error);
    throw error;
  }
}