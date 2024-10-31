import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Use environment variable for database URL
const DATABASE_URL = 'postgresql://neondb_owner:fHby8xg3FedG@ep-delicate-unit-a5pksrjm.us-east-2.aws.neon.tech/neondb?sslmode=require';

// Create the SQL connection
const sql = neon(DATABASE_URL);

// Create the Drizzle ORM instance
export const db = drizzle(sql);

export default sql;