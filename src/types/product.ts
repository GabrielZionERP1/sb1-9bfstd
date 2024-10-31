export interface Product {
  id: string;
  companyId: string;
  name: string;
  description: string;
  regularPrice?: number;
  promotionalPrice?: number;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFormData {
  name: string;
  description: string;
  regularPrice?: number;
  promotionalPrice?: number;
  images: string[];
}