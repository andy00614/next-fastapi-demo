import type { Config } from 'drizzle-kit';

import { env } from '@/env';

export default {
  schema: './src/server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  // Remove filter to pull all tables including 'tasks'
  // tablesFilter: ['better-saas_*'],
} satisfies Config;
