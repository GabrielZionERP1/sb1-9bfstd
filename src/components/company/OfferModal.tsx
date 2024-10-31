import { Modal } from '../Modal';
import { OfferForm } from './OfferForm';
import { Offer, OfferFormData } from '../../types/offer';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: OfferFormData) => void;
  offer?: Offer | null;
}

export const OfferModal = ({ isOpen, onClose, onSave, offer }: OfferModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      title={offer ? 'Edit Offer' : 'Add Offer'}
      preventClose
    >
      <OfferForm
        initialData={offer || undefined}
        onSubmit={onSave}
        onCancel={onClose}
      />
    </Modal>
  );
};