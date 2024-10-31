import { create } from 'zustand';
import { AuthState, LoginCredentials } from '../types/auth';

// This would be replaced with actual API calls in production
const mockAuth = async (credentials: LoginCredentials) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (credentials.email === 'admin@example.com' && credentials.password === 'admin') {
    return {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin'
    };
  } else if (credentials.email === 'company@example.com' && credentials.password === 'company') {
    return {
      id: '2',
      email: 'company@example.com',
      name: 'Company User',
      role: 'company',
      companyId: 'comp1'
    };
  }
  
  throw new Error('Invalid credentials');
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    try {
      const user = await mockAuth({ email, password });
      set({ user, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));