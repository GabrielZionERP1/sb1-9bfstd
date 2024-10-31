import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: 'postgresql://neondb_owner:fHby8xg3FedG@ep-delicate-unit-a5pksrjm.us-east-2.aws.neon.tech/neondb?sslmode=require',
  },
} satisfies Config;