import sql from '../db/config';

export const dbService = {
  async checkConnection(): Promise<boolean> {
    try {
      // Simple query to test connection
      await sql`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database connection error:', error);
      return false;
    }
  },

  async initSchema(): Promise<void> {
    try {
      // Create categories table
      await sql`
        CREATE TABLE IF NOT EXISTS categories (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          image TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Create companies table
      await sql`
        CREATE TABLE IF NOT EXISTS companies (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          cnpj VARCHAR(18) NOT NULL UNIQUE,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255),
          category_id UUID REFERENCES categories(id),
          logo TEXT,
          tags TEXT[],
          description TEXT,
          street VARCHAR(255),
          number VARCHAR(50),
          district VARCHAR(255),
          zip_code VARCHAR(10),
          city VARCHAR(255),
          state VARCHAR(2),
          whatsapp VARCHAR(20),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Create products table
      await sql`
        CREATE TABLE IF NOT EXISTS products (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          description VARCHAR(250),
          regular_price DECIMAL(10,2),
          promotional_price DECIMAL(10,2),
          images TEXT[],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      console.log('Database schema initialized successfully');
    } catch (error) {
      console.error('Error initializing database schema:', error);
      throw error;
    }
  }
};