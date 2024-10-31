import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, Building2, Grid, Menu, Package2, Tag } from 'lucide-react';
import { CompanyList } from '../components/admin/CompanyList';
import { CompanyForm } from '../components/admin/CompanyForm';
import { CompanyProfile } from '../components/company/CompanyProfile';
import { CategoryList } from '../components/admin/CategoryList';
import { CategoryForm } from '../components/admin/CategoryForm';
import { ProductList } from '../components/company/ProductList';
import { OfferList } from '../components/company/OfferList';
import { CompanyFormData } from '../types/company';
import { CategoryFormData } from '../types/category';

export const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [activeSection, setActiveSection] = useState<'companies' | 'categories' | 'profile' | 'products' | 'offers'>('companies');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleAddCompany = (data: CompanyFormData) => {
    console.log('New company data:', data);
    setShowAddCompany(false);
  };

  const handleAddCategory = (data: CategoryFormData) => {
    console.log('New category data:', data);
    setShowAddCategory(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <h1 className={`font-semibold text-gray-900 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
            {user?.role === 'admin' ? 'Painel Admin' : 'Painel da Empresa'}
          </h1>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {user?.role === 'admin' ? (
            <>
              <button
                onClick={() => setActiveSection('companies')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeSection === 'companies'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Building2 className="h-5 w-5" />
                {isSidebarOpen && <span className="ml-3">Empresas</span>}
              </button>
              <button
                onClick={() => setActiveSection('categories')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeSection === 'categories'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid className="h-5 w-5" />
                {isSidebarOpen && <span className="ml-3">Categorias</span>}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveSection('profile')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeSection === 'profile'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Building2 className="h-5 w-5" />
                {isSidebarOpen && <span className="ml-3">Perfil da Empresa</span>}
              </button>
              <button
                onClick={() => setActiveSection('products')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeSection === 'products'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Package2 className="h-5 w-5" />
                {isSidebarOpen && <span className="ml-3">Produtos e Serviços</span>}
              </button>
              <button
                onClick={() => setActiveSection('offers')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeSection === 'offers'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Tag className="h-5 w-5" />
                {isSidebarOpen && <span className="ml-3">Ofertas Especiais</span>}
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  {user?.role === 'admin' 
                    ? activeSection === 'companies' ? 'Gerenciar Empresas' : 'Gerenciar Categorias'
                    : activeSection === 'profile' ? 'Perfil da Empresa' : 
                      activeSection === 'offers' ? 'Ofertas Especiais' : 'Produtos e Serviços'}
                </h1>
              </div>
              <div className="flex items-center">
                <span className="text-gray-700 mr-4">{user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {user?.role === 'admin' ? (
            activeSection === 'companies' ? (
              <div className="space-y-6">
                {showAddCompany ? (
                  <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-medium text-gray-900">Adicionar Nova Empresa</h2>
                      <button
                        onClick={() => setShowAddCompany(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        Cancelar
                      </button>
                    </div>
                    <CompanyForm onSubmit={handleAddCompany} />
                  </div>
                ) : (
                  <CompanyList />
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {showAddCategory ? (
                  <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-medium text-gray-900">Adicionar Nova Categoria</h2>
                      <button
                        onClick={() => setShowAddCategory(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        Cancelar
                      </button>
                    </div>
                    <CategoryForm onSubmit={handleAddCategory} />
                  </div>
                ) : (
                  <CategoryList />
                )}
              </div>
            )
          ) : (
            activeSection === 'profile' ? (
              <CompanyProfile />
            ) : activeSection === 'products' ? (
              <ProductList />
            ) : (
              <OfferList />
            )
          )}
        </main>
      </div>
    </div>
  );
};