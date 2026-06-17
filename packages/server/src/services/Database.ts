import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { Effect } from 'effect'
import * as schema from '../db/schema'

export type DB = ReturnType<typeof drizzle<typeof schema>>

export class DatabaseService extends Effect.Service<DatabaseService>()(
  'DatabaseService',
  {
    sync: () => {
      const sqlite = new Database('finance.db')
      const db = drizzle(sqlite, { schema })
      migrate(db, { migrationsFolder: './drizzle' })
      console.log('Database initialized and migrated.')
      return { db }
    },
  },
) {}
