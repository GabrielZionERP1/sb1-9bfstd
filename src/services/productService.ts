import { getDbConnection } from './dbInit';
import { Product, ProductFormData } from '../types/product';

const sql = getDbConnection();

export const productService = {
  async getProducts(companyId: string): Promise<Product[]> {
    try {
      if (!companyId) throw new Error('Company ID is required');

      const result = await sql`
        SELECT * FROM products 
        WHERE company_id = ${companyId}::uuid 
        ORDER BY created_at DESC
      `;
      
      return result.map(row => ({
        id: row.id,
        companyId: row.company_id,
        name: row.name,
        description: row.description,
        regularPrice: row.regular_price,
        promotionalPrice: row.promotional_price,
        images: row.images || [],
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async createProduct(companyId: string, data: ProductFormData): Promise<Product> {
    try {
      if (!companyId) throw new Error('Company ID is required');

      const result = await sql`
        INSERT INTO products (
          company_id, 
          name, 
          description, 
          regular_price, 
          promotional_price, 
          images
        ) VALUES (
          ${companyId}::uuid,
          ${data.name},
          ${data.description},
          ${data.regularPrice || null},
          ${data.promotionalPrice || null},
          ${data.images || []}
        )
        RETURNING *
      `;
      
      const row = result[0];
      return {
        id: row.id,
        companyId: row.company_id,
        name: row.name,
        description: row.description,
        regularPrice: row.regular_price,
        promotionalPrice: row.promotional_price,
        images: row.images || [],
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      };
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(id: string, data: ProductFormData): Promise<Product> {
    try {
      if (!id) throw new Error('Product ID is required');

      const result = await sql`
        UPDATE products 
        SET 
          name = ${data.name},
          description = ${data.description},
          regular_price = ${data.regularPrice || null},
          promotional_price = ${data.promotionalPrice || null},
          images = ${data.images || []},
          updated_at = NOW()
        WHERE id = ${id}::uuid
        RETURNING *
      `;
      
      const row = result[0];
      return {
        id: row.id,
        companyId: row.company_id,
        name: row.name,
        description: row.description,
        regularPrice: row.regular_price,
        promotionalPrice: row.promotional_price,
        images: row.images || [],
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      };
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      if (!id) throw new Error('Product ID is required');
      await sql`DELETE FROM products WHERE id = ${id}::uuid`;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  async importProducts(companyId: string, products: ProductFormData[]): Promise<Product[]> {
    try {
      if (!companyId) throw new Error('Company ID is required');
      if (!products.length) throw new Error('No products to import');

      const result = await sql`
        INSERT INTO products (
          company_id,
          name,
          description,
          regular_price,
          promotional_price,
          images
        )
        SELECT 
          ${companyId}::uuid,
          unnest(${products.map(p => p.name)}),
          unnest(${products.map(p => p.description)}),
          unnest(${products.map(p => p.regularPrice || null)}::numeric[]),
          unnest(${products.map(p => p.promotionalPrice || null)}::numeric[]),
          unnest(${products.map(p => p.images || [])}::text[][])
        RETURNING *
      `;
      
      return result.map(row => ({
        id: row.id,
        companyId: row.company_id,
        name: row.name,
        description: row.description,
        regularPrice: row.regular_price,
        promotionalPrice: row.promotional_price,
        images: row.images || [],
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      }));
    } catch (error) {
      console.error('Error importing products:', error);
      throw error;
    }
  }
};