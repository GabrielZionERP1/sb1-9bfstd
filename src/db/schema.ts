import { pgTable, uuid, varchar, text, timestamp, decimal } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const companies = pgTable('companies', {
  id: uuid('id').defaultRandom().primaryKey(),
  cnpj: varchar('cnpj', { length: 18 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }),
  categoryId: uuid('category_id').references(() => categories.id),
  logo: text('logo'),
  tags: text('tags').array(),
  description: text('description'),
  street: varchar('street', { length: 255 }),
  number: varchar('number', { length: 50 }),
  district: varchar('district', { length: 255 }),
  zipCode: varchar('zip_code', { length: 10 }),
  city: varchar('city', { length: 255 }),
  state: varchar('state', { length: 2 }),
  whatsapp: varchar('whatsapp', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id')
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 250 }),
  regularPrice: decimal('regular_price', { precision: 10, scale: 2 }),
  promotionalPrice: decimal('promotional_price', { precision: 10, scale: 2 }),
  images: text('images').array(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});