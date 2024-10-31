import { MessageCircle } from 'lucide-react';
import { Company } from '../../types/company';

interface CompanyListProps {
  companies: Company[];
}

export const CompanyList = ({ companies }: CompanyListProps) => {
  const openWhatsApp = (phone: string) => {
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank');
  };

  if (companies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No companies found matching your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <div
            key={company.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center space-x-4">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-xl font-medium">
                      {company.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{company.name}</h3>
                  <p className="text-sm text-gray-500">{company.category_name}</p>
                </div>
              </div>
              
              {company.phone && (
                <button
                  onClick={() => openWhatsApp(company.phone)}
                  className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  WhatsApp
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};