import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config()

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL must be defined')
}

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
  extensionsFilters: ["postgis"],
  schemaFilter: ['public'],
})
