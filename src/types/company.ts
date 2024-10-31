export interface Company {
  id: string;
  cnpj: string;
  name: string;
  email: string;
  categoryId?: string;
  category_name?: string;
  tags?: string[];
  logo?: string;
  whatsapp?: string;
  address?: {
    street: string;
    number: string;
    district: string;
    zipCode: string;
    city: string;
    state: string;
  };
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CompanyFormData {
  cnpj: string;
  name: string;
  email: string;
  password?: string;
  categoryId?: string;
  tags?: string[];
  logo?: string;
  whatsapp?: string;
  address?: {
    street: string;
    number: string;
    district: string;
    zipCode: string;
    city: string;
    state: string;
  };
  description?: string;
}