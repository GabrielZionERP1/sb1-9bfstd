import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { productService } from '../../services/productService';
import { Product } from '../../types/product';
import { Pencil, Trash2, Plus, Upload } from 'lucide-react';
import { ProductModal } from './ProductModal';
import { ImportModal } from './ImportModal';

export const ProductList = () => {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (user?.companyId) {
      loadProducts();
    }
  }, [user?.companyId]);

  const loadProducts = async () => {
    if (!user?.companyId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAll(user.companyId);
      setProducts(data);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (productData: Product) => {
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, productData);
      } else if (user?.companyId) {
        await productService.create(user.companyId, productData);
      }
      await loadProducts();
      setShowAddModal(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Failed to save product. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.delete(id);
        await loadProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
        setError('Failed to delete product. Please try again.');
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowAddModal(true);
  };

  const handleImport = async (data: Product[]) => {
    if (!user?.companyId) return;
    
    try {
      await productService.bulkImport(user.companyId, data);
      await loadProducts();
      setShowImportModal(false);
    } catch (err) {
      console.error('Error importing products:', err);
      setError('Failed to import products. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading products...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Products</h2>
        <div className="space-x-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import XLS
          </button>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowAddModal(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {products.map((product) => (
            <li key={product.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-16 w-16 object-cover rounded"
                    />
                  )}
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.description}</p>
                    <div className="mt-1">
                      {product.regularPrice && (
                        <span className="text-sm text-gray-500 line-through mr-2">
                          ${product.regularPrice.toFixed(2)}
                        </span>
                      )}
                      {product.promotionalPrice && (
                        <span className="text-sm font-medium text-green-600">
                          ${product.promotionalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-400 hover:text-red-500 rounded-full hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
          {products.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500">
              No products found. Click "Add Product" to create one.
            </li>
          )}
        </ul>
      </div>

      {showAddModal && (
        <ProductModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
          onSave={handleSave}
          product={editingProduct}
        />
      )}

      {showImportModal && (
        <ImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={handleImport}
        />
      )}
    </div>
  );
};