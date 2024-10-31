import { getDbConnection } from './dbInit';
import { Offer, OfferFormData } from '../types/offer';

const sql = getDbConnection();

export const offerService = {
  async getOffers(companyId: string): Promise<Offer[]> {
    try {
      const result = await sql`
        SELECT * FROM offers 
        WHERE company_id = ${companyId}::uuid 
        ORDER BY created_at DESC
      `;
      
      return result.map(row => ({
        id: row.id,
        companyId: row.company_id,
        name: row.name,
        description: row.description,
        discount: {
          type: row.discount_type,
          value: parseFloat(row.discount_value)
        },
        image: row.image,
        startDate: new Date(row.start_date),
        endDate: new Date(row.end_date),
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      }));
    } catch (error) {
      console.error('Error fetching offers:', error);
      throw error;
    }
  },

  async createOffer(companyId: string, data: OfferFormData): Promise<Offer> {
    try {
      const [result] = await sql`
        INSERT INTO offers (
          company_id,
          name,
          description,
          discount_type,
          discount_value,
          image,
          start_date,
          end_date
        ) VALUES (
          ${companyId}::uuid,
          ${data.name},
          ${data.description},
          ${data.discount.type},
          ${data.discount.value},
          ${data.image},
          ${data.startDate.toISOString()},
          ${data.endDate.toISOString()}
        )
        RETURNING *
      `;
      
      return {
        id: result.id,
        companyId: result.company_id,
        name: result.name,
        description: result.description,
        discount: {
          type: result.discount_type,
          value: parseFloat(result.discount_value)
        },
        image: result.image,
        startDate: new Date(result.start_date),
        endDate: new Date(result.end_date),
        createdAt: new Date(result.created_at),
        updatedAt: new Date(result.updated_at)
      };
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  },

  async updateOffer(id: string, data: Partial<OfferFormData>): Promise<Offer> {
    try {
      const [result] = await sql`
        UPDATE offers 
        SET 
          name = COALESCE(${data.name}, name),
          description = COALESCE(${data.description}, description),
          discount_type = COALESCE(${data.discount?.type}, discount_type),
          discount_value = COALESCE(${data.discount?.value}, discount_value),
          image = COALESCE(${data.image}, image),
          start_date = COALESCE(${data.startDate?.toISOString()}, start_date),
          end_date = COALESCE(${data.endDate?.toISOString()}, end_date),
          updated_at = NOW()
        WHERE id = ${id}::uuid
        RETURNING *
      `;
      
      return {
        id: result.id,
        companyId: result.company_id,
        name: result.name,
        description: result.description,
        discount: {
          type: result.discount_type,
          value: parseFloat(result.discount_value)
        },
        image: result.image,
        startDate: new Date(result.start_date),
        endDate: new Date(result.end_date),
        createdAt: new Date(result.created_at),
        updatedAt: new Date(result.updated_at)
      };
    } catch (error) {
      console.error('Error updating offer:', error);
      throw error;
    }
  },

  async deleteOffer(id: string): Promise<void> {
    try {
      await sql`DELETE FROM offers WHERE id = ${id}::uuid`;
    } catch (error) {
      console.error('Error deleting offer:', error);
      throw error;
    }
  }
};