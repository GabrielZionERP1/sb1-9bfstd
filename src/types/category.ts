export interface Category {
  id: string;
  name: string;
  image: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryFormData {
  name: string;
  image: string;
}