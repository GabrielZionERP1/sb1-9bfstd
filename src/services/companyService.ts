import { db } from '../db/config';
import { companies } from '../db/schema';
import { eq } from 'drizzle-orm';
import type { Company, CompanyFormData } from '../types/company';

export const companyService = {
  async getAll(): Promise<Company[]> {
    try {
      const result = await db.select().from(companies);
      return result.map(company => ({
        id: company.id,
        cnpj: company.cnpj,
        name: company.name,
        email: company.email,
        categoryId: company.categoryId || undefined,
        logo: company.logo || undefined,
        tags: company.tags || [],
        description: company.description || undefined,
        address: company.street ? {
          street: company.street,
          number: company.number || '',
          district: company.district || '',
          zipCode: company.zipCode || '',
          city: company.city || '',
          state: company.state || ''
        } : undefined,
        whatsapp: company.whatsapp || undefined
      }));
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  },

  async getByCategory(categoryId: string): Promise<Company[]> {
    try {
      const result = await db
        .select()
        .from(companies)
        .where(eq(companies.categoryId, categoryId));
      
      return result.map(company => ({
        id: company.id,
        cnpj: company.cnpj,
        name: company.name,
        email: company.email,
        categoryId: company.categoryId || undefined,
        logo: company.logo || undefined,
        tags: company.tags || [],
        description: company.description || undefined,
        address: company.street ? {
          street: company.street,
          number: company.number || '',
          district: company.district || '',
          zipCode: company.zipCode || '',
          city: company.city || '',
          state: company.state || ''
        } : undefined,
        whatsapp: company.whatsapp || undefined
      }));
    } catch (error) {
      console.error('Error fetching companies by category:', error);
      throw error;
    }
  },

  async search(params: { city?: string; name?: string }): Promise<Company[]> {
    try {
      let query = db.select().from(companies);

      if (params.city) {
        query = query.where(eq(companies.city, params.city));
      }

      if (params.name) {
        query = query.where(sql`${companies.name} ILIKE ${`%${params.name}%`}`);
      }

      const result = await query;
      
      return result.map(company => ({
        id: company.id,
        cnpj: company.cnpj,
        name: company.name,
        email: company.email,
        categoryId: company.categoryId || undefined,
        logo: company.logo || undefined,
        tags: company.tags || [],
        description: company.description || undefined,
        address: company.street ? {
          street: company.street,
          number: company.number || '',
          district: company.district || '',
          zipCode: company.zipCode || '',
          city: company.city || '',
          state: company.state || ''
        } : undefined,
        whatsapp: company.whatsapp || undefined
      }));
    } catch (error) {
      console.error('Error searching companies:', error);
      throw error;
    }
  },

  async create(data: CompanyFormData): Promise<Company> {
    try {
      const [result] = await db.insert(companies).values({
        cnpj: data.cnpj,
        name: data.name,
        email: data.email,
        categoryId: data.categoryId,
        logo: data.logo,
        tags: data.tags,
        description: data.description,
        street: data.address?.street,
        number: data.address?.number,
        district: data.address?.district,
        zipCode: data.address?.zipCode,
        city: data.address?.city,
        state: data.address?.state,
        whatsapp: data.whatsapp
      }).returning();

      return {
        id: result.id,
        cnpj: result.cnpj,
        name: result.name,
        email: result.email,
        categoryId: result.categoryId || undefined,
        logo: result.logo || undefined,
        tags: result.tags || [],
        description: result.description || undefined,
        address: result.street ? {
          street: result.street,
          number: result.number || '',
          district: result.district || '',
          zipCode: result.zipCode || '',
          city: result.city || '',
          state: result.state || ''
        } : undefined,
        whatsapp: result.whatsapp || undefined
      };
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  },

  async update(id: string, data: Partial<CompanyFormData>): Promise<Company> {
    try {
      const [result] = await db
        .update(companies)
        .set({
          name: data.name,
          email: data.email,
          categoryId: data.categoryId,
          logo: data.logo,
          tags: data.tags,
          description: data.description,
          street: data.address?.street,
          number: data.address?.number,
          district: data.address?.district,
          zipCode: data.address?.zipCode,
          city: data.address?.city,
          state: data.address?.state,
          whatsapp: data.whatsapp,
          updatedAt: new Date()
        })
        .where(eq(companies.id, id))
        .returning();

      return {
        id: result.id,
        cnpj: result.cnpj,
        name: result.name,
        email: result.email,
        categoryId: result.categoryId || undefined,
        logo: result.logo || undefined,
        tags: result.tags || [],
        description: result.description || undefined,
        address: result.street ? {
          street: result.street,
          number: result.number || '',
          district: result.district || '',
          zipCode: result.zipCode || '',
          city: result.city || '',
          state: result.state || ''
        } : undefined,
        whatsapp: result.whatsapp || undefined
      };
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await db.delete(companies).where(eq(companies.id, id));
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  },

  async bulkImport(companiesData: CompanyFormData[]): Promise<Company[]> {
    try {
      const values = companiesData.map(data => ({
        cnpj: data.cnpj,
        name: data.name,
        email: data.email,
        categoryId: data.categoryId,
        logo: data.logo,
        tags: data.tags,
        description: data.description,
        street: data.address?.street,
        number: data.address?.number,
        district: data.address?.district,
        zipCode: data.address?.zipCode,
        city: data.address?.city,
        state: data.address?.state,
        whatsapp: data.whatsapp
      }));

      const result = await db.insert(companies).values(values).returning();

      return result.map(company => ({
        id: company.id,
        cnpj: company.cnpj,
        name: company.name,
        email: company.email,
        categoryId: company.categoryId || undefined,
        logo: company.logo || undefined,
        tags: company.tags || [],
        description: company.description || undefined,
        address: company.street ? {
          street: company.street,
          number: company.number || '',
          district: company.district || '',
          zipCode: company.zipCode || '',
          city: company.city || '',
          state: company.state || ''
        } : undefined,
        whatsapp: company.whatsapp || undefined
      }));
    } catch (error) {
      console.error('Error bulk importing companies:', error);
      throw error;
    }
  }
};