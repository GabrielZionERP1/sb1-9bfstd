import { db } from '../db/config';
import { categories } from '../db/schema';
import { eq } from 'drizzle-orm';
import type { Category } from '../types/category';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    try {
      const result = await db.select().from(categories);
      return result.map(category => ({
        id: category.id,
        name: category.name,
        image: category.image || '',
        created_at: category.createdAt?.toISOString(),
        updated_at: category.updatedAt?.toISOString()
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async create(data: Omit<Category, 'id'>): Promise<Category> {
    try {
      const [result] = await db.insert(categories).values({
        name: data.name,
        image: data.image
      }).returning();
      
      return {
        id: result.id,
        name: result.name,
        image: result.image || '',
        created_at: result.createdAt?.toISOString(),
        updated_at: result.updatedAt?.toISOString()
      };
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  async update(id: string, data: Partial<Category>): Promise<Category> {
    try {
      const [result] = await db
        .update(categories)
        .set({
          name: data.name,
          image: data.image,
          updatedAt: new Date()
        })
        .where(eq(categories.id, id))
        .returning();

      return {
        id: result.id,
        name: result.name,
        image: result.image || '',
        created_at: result.createdAt?.toISOString(),
        updated_at: result.updatedAt?.toISOString()
      };
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await db.delete(categories).where(eq(categories.id, id));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
};