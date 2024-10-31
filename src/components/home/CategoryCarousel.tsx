import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Category } from '../../types/category';
import { categoryService } from '../../services/categoryService';

interface CategoryCarouselProps {
  onCategoryClick: (categoryId: string) => void;
}

export const CategoryCarousel = ({ onCategoryClick }: CategoryCarouselProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError('Falha ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('category-container');
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setScrollPosition(container.scrollLeft + scrollAmount);
    }
  };

  if (loading) return <div className="text-center py-4">Carregando...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Navegar por Categoria</h2>
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-lg hover:bg-white"
          aria-label="Rolar para esquerda"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <div
          id="category-container"
          className="flex overflow-x-hidden space-x-8 px-4 py-4"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category.id)}
              className="flex flex-col items-center flex-shrink-0 focus:outline-none group"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden mb-3 ring-2 ring-transparent group-hover:ring-indigo-500 transition-all duration-200">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                />
              </div>
              <span className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                {category.name}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-lg hover:bg-white"
          aria-label="Rolar para direita"
        >
          <ChevronRight className="h-6 w-6 text-gray-600" />
        </button>
      </div>
    </div>
  );
};