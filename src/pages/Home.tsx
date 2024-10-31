import { useState, useEffect } from 'react';
import { Navbar } from '../components/home/Navbar';
import { SearchBanner } from '../components/home/SearchBanner';
import { CategoryCarousel } from '../components/home/CategoryCarousel';
import { CompanyList } from '../components/home/CompanyList';
import { companyService } from '../services/companyService';
import { Company } from '../types/company';

export const Home = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentCity, setCurrentCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (params: { city: string; query: string }) => {
    setLoading(true);
    try {
      const results = await companyService.search({
        city: params.city,
        name: params.query,
      });
      setCompanies(results);
    } catch (err) {
      setError('Failed to search companies');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = async (categoryId: string) => {
    setLoading(true);
    try {
      const results = await companyService.getByCategory(categoryId);
      setCompanies(results);
    } catch (err) {
      setError('Failed to load companies for this category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onCityChange={setCurrentCity} />
      <SearchBanner currentCity={currentCity} onSearch={handleSearch} />
      <CategoryCarousel onCategoryClick={handleCategoryClick} />
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-12">{error}</div>
      ) : (
        companies.length > 0 && <CompanyList companies={companies} />
      )}
    </div>
  );
};