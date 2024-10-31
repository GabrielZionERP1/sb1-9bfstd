import { ProductImport } from './ProductImport';
import { Modal } from '../Modal';
import { Product } from '../../types/product';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: Product[]) => void;
}

export const ImportModal = ({ isOpen, onClose, onImport }: ImportModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      title="Import Products"
      preventClose
    >
      <ProductImport
        onImport={onImport}
        onCancel={onClose}
      />
    </Modal>
  );
};