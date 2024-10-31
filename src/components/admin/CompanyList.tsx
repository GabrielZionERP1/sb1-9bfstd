import { useState, useEffect } from 'react';
import { Pencil, Trash2, Building2, Plus, Upload } from 'lucide-react';
import { Company } from '../../types/company';
import { companyService } from '../../services/companyService';
import { CompanyForm } from './CompanyForm';
import { CompanyImport } from './CompanyImport';
import { Modal } from '../Modal';

export const CompanyList = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      setError('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await companyService.delete(id);
        setCompanies(companies.filter(company => company.id !== id));
      } catch (err) {
        setError('Failed to delete company');
      }
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setShowForm(true);
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Companies</h3>
            <p className="mt-1 text-sm text-gray-500">List of all registered companies</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowImport(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import XLS
            </button>
            <button
              onClick={() => {
                setEditingCompany(null);
                setShowForm(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Company
            </button>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {companies.map((company) => (
              <li key={company.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <Building2 className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{company.name}</div>
                      <div className="text-sm text-gray-500">{company.email}</div>
                      <div className="text-sm text-gray-500">CNPJ: {company.cnpj}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(company)}
                      className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(company.id)}
                      className="inline-flex items-center p-2 border border-transparent rounded-full text-red-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Modal
        isOpen={showForm}
        title={editingCompany ? 'Edit Company' : 'Add Company'}
        preventClose
      >
        <CompanyForm
          initialData={editingCompany || undefined}
          onSubmit={async (data) => {
            try {
              if (editingCompany) {
                const updated = await companyService.update(editingCompany.id, data);
                setCompanies(companies.map(c => c.id === updated.id ? updated : c));
              } else {
                const newCompany = await companyService.create(data);
                setCompanies([newCompany, ...companies]);
              }
              setShowForm(false);
              setEditingCompany(null);
            } catch (err) {
              setError('Failed to save company');
            }
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingCompany(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showImport}
        title="Import Companies"
        preventClose
      >
        <CompanyImport
          onImport={async (rows) => {
            try {
              const newCompanies = await companyService.bulkImport(rows);
              setCompanies([...newCompanies, ...companies]);
              setShowImport(false);
            } catch (err) {
              setError('Failed to import companies');
            }
          }}
          onCancel={() => setShowImport(false)}
        />
      </Modal>
    </>
  );
};