import { integer, sqliteTable, text, type SQLiteColumn } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

export const groups = sqliteTable('groups', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

export const groupMembers = sqliteTable('group_members', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  groupId: integer('group_id')
    .notNull()
    .references(() => groups.id),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  role: text('role', { enum: ['owner', 'member'] }).notNull().default('member'),
  joinedAt: integer('joined_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

export const accounts = sqliteTable('accounts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  groupId: integer('group_id')
    .notNull()
    .references(() => groups.id),
  name: text('name').notNull(),
  type: text('type', { enum: ['checking', 'savings', 'credit', 'cash'] }).notNull(),
  currency: text('currency').notNull(),
  balanceCents: integer('balance_cents').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  groupId: integer('group_id').references(() => groups.id),
  name: text('name').notNull(),
  icon: text('icon'),
  color: text('color'),
  parentId: integer('parent_id').references((): SQLiteColumn => categories.id),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

export const transactions = sqliteTable('transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  accountId: integer('account_id')
    .notNull()
    .references(() => accounts.id),
  categoryId: integer('category_id').references(() => categories.id),
  amountCents: integer('amount_cents').notNull(),
  type: text('type', { enum: ['income', 'expense', 'transfer'] }).notNull(),
  description: text('description'),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  createdByUserId: integer('created_by_user_id')
    .notNull()
    .references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

export const transferPairs = sqliteTable('transfer_pairs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  fromTransactionId: integer('from_transaction_id')
    .notNull()
    .references(() => transactions.id),
  toTransactionId: integer('to_transaction_id')
    .notNull()
    .references(() => transactions.id),
})

export const transactionSplits = sqliteTable('transaction_splits', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  transactionId: integer('transaction_id')
    .notNull()
    .references(() => transactions.id),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  amountCents: integer('amount_cents').notNull(),
  settledAt: integer('settled_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

export const subscriptions = sqliteTable('subscriptions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  groupId: integer('group_id')
    .notNull()
    .references(() => groups.id),
  accountId: integer('account_id')
    .notNull()
    .references(() => accounts.id),
  categoryId: integer('category_id').references(() => categories.id),
  name: text('name').notNull(),
  amountCents: integer('amount_cents').notNull(),
  currency: text('currency').notNull(),
  billingCycle: text('billing_cycle', { enum: ['weekly', 'monthly', 'yearly'] }).notNull(),
  billingDay: integer('billing_day').notNull(),
  nextBillingDate: integer('next_billing_date', { mode: 'timestamp' }).notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})
