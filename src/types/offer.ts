export interface Offer {
  id: string;
  companyId: string;
  name: string;
  description: string;
  discount: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  image: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OfferFormData {
  name: string;
  description: string;
  discount: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  image: string;
  startDate: Date;
  endDate: Date;
}