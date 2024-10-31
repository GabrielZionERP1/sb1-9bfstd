export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'company';
  companyId?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface LoginCredentials {
  email: string;
  password: string;
}