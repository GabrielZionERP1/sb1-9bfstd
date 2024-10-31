import { Search } from 'lucide-react';
import { useState } from 'react';

interface SearchBannerProps {
  currentCity: string;
  onSearch: (params: { city: string; query: string }) => void;
}

export const SearchBanner = ({ currentCity, onSearch }: SearchBannerProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ city: currentCity, query: searchQuery });
  };

  return (
    <div className="relative">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
          alt="Distrito empresarial"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-indigo-600/90"></div>
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl text-center mb-8">
          Encontre a Empresa Ideal
        </h1>
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-4 border border-transparent rounded-lg focus:ring-2 focus:ring-white focus:border-white bg-white/10 backdrop-blur-sm text-white placeholder-gray-300"
                placeholder={`Buscar empresas em ${currentCity}...`}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};