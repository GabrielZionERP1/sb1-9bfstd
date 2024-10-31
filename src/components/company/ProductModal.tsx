import { ProductForm } from './ProductForm';
import { Modal } from '../Modal';
import { Product, ProductFormData } from '../../types/product';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData) => void;
  product?: Product | null;
}

export const ProductModal = ({ isOpen, onClose, onSave, product }: ProductModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      title={product ? 'Edit Product' : 'Add Product'}
      preventClose
    >
      <ProductForm
        initialData={product || undefined}
        onSubmit={onSave}
        onCancel={onClose}
      />
    </Modal>
  );
};