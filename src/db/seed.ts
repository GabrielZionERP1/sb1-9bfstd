import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const DATABASE_URL = 'postgresql://neondb_owner:fHby8xg3FedG@ep-delicate-unit-a5pksrjm.us-east-2.aws.neon.tech/neondb?sslmode=require';
const sql = neon(DATABASE_URL);
const db = drizzle(sql);

async function seedDatabase() {
  try {
    // Create tables if they don't exist
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

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

    await sql`
      CREATE TABLE IF NOT EXISTS offers (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description VARCHAR(250),
        discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
        discount_value DECIMAL(10,2) NOT NULL,
        image TEXT NOT NULL,
        start_date TIMESTAMP WITH TIME ZONE NOT NULL,
        end_date TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Insert test categories
    const categories = await sql`
      INSERT INTO categories (name, image) VALUES
        ('Tecnologia', 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'),
        ('Saúde', 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'),
        ('Educação', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'),
        ('Alimentação', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80')
      RETURNING id, name
    `;

    console.log('Categories inserted:', categories);

    // Insert test companies
    const companies = await sql`
      INSERT INTO companies (
        cnpj, name, email, password_hash, category_id, logo, tags, description,
        street, number, district, zip_code, city, state, whatsapp
      ) VALUES
        (
          '12.345.678/0001-90',
          'Tech Solutions',
          'tech@example.com',
          'hash123',
          (SELECT id FROM categories WHERE name = 'Tecnologia'),
          'https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80',
          ARRAY['tecnologia', 'software'],
          'Empresa líder em soluções tecnológicas',
          'Rua da Tecnologia',
          '123',
          'Centro',
          '12345-678',
          'São Paulo',
          'SP',
          '11999887766'
        ),
        (
          '98.765.432/0001-10',
          'Saúde Integral',
          'saude@example.com',
          'hash456',
          (SELECT id FROM categories WHERE name = 'Saúde'),
          'https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80',
          ARRAY['saúde', 'bem-estar'],
          'Clínica médica especializada',
          'Avenida da Saúde',
          '456',
          'Jardins',
          '54321-098',
          'Rio de Janeiro',
          'RJ',
          '21999887766'
        )
      RETURNING id, name
    `;

    console.log('Companies inserted:', companies);

    // Insert test products
    await sql`
      INSERT INTO products (
        company_id, name, description, regular_price, promotional_price, images
      ) VALUES
        (
          (SELECT id FROM companies WHERE name = 'Tech Solutions'),
          'Desenvolvimento Web',
          'Desenvolvimento de sites e aplicações web',
          5000.00,
          4500.00,
          ARRAY['https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80']
        ),
        (
          (SELECT id FROM companies WHERE name = 'Tech Solutions'),
          'Consultoria TI',
          'Consultoria em tecnologia da informação',
          2000.00,
          1800.00,
          ARRAY['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80']
        ),
        (
          (SELECT id FROM companies WHERE name = 'Saúde Integral'),
          'Consulta Médica',
          'Consulta com clínico geral',
          200.00,
          180.00,
          ARRAY['https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80']
        )
    `;

    console.log('Products inserted');

    // Insert test offers
    await sql`
      INSERT INTO offers (
        company_id, name, description, discount_type, discount_value,
        image, start_date, end_date
      ) VALUES
        (
          (SELECT id FROM companies WHERE name = 'Tech Solutions'),
          'Promoção de Verão',
          'Desconto especial em todos os serviços',
          'percentage',
          20,
          'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&h=1080&q=80',
          NOW(),
          NOW() + INTERVAL '30 days'
        ),
        (
          (SELECT id FROM companies WHERE name = 'Saúde Integral'),
          'Pacote Saúde',
          'Desconto em consultas médicas',
          'fixed',
          50.00,
          'https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&h=1080&q=80',
          NOW(),
          NOW() + INTERVAL '15 days'
        )
    `;

    console.log('Offers inserted');
    console.log('Database seeded successfully!');

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

seedDatabase().catch((error) => {
  console.error('Failed to seed database:', error);
  process.exit(1);
});