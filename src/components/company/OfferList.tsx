import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { offerService } from '../../services/offerService';
import { Offer } from '../../types/offer';
import { Pencil, Trash2, Plus, Calendar } from 'lucide-react';
import { OfferModal } from './OfferModal';

export const OfferList = () => {
  const { user } = useAuthStore();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  useEffect(() => {
    if (user?.companyId) {
      loadOffers();
    }
  }, [user?.companyId]);

  const loadOffers = async () => {
    if (!user?.companyId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await offerService.getOffers(user.companyId);
      setOffers(data);
    } catch (err) {
      setError('Failed to load offers');
      console.error('Error loading offers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (offerData: any) => {
    try {
      if (editingOffer) {
        await offerService.updateOffer(editingOffer.id, offerData);
      } else if (user?.companyId) {
        await offerService.createOffer(user.companyId, offerData);
      }
      await loadOffers();
      setShowModal(false);
      setEditingOffer(null);
    } catch (err) {
      console.error('Error saving offer:', err);
      setError('Failed to save offer');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await offerService.deleteOffer(id);
        await loadOffers();
      } catch (err) {
        console.error('Error deleting offer:', err);
        setError('Failed to delete offer');
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return <div className="text-center py-4">Loading offers...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Special Offers</h2>
        <button
          onClick={() => {
            setEditingOffer(null);
            setShowModal(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Offer
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {offers.map((offer) => (
            <li key={offer.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={offer.image}
                    alt={offer.name}
                    className="h-24 w-24 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{offer.name}</h3>
                    <p className="text-sm text-gray-500">{offer.description}</p>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
                    </div>
                    <div className="mt-1 text-sm font-medium text-green-600">
                      {offer.discount.type === 'percentage' 
                        ? `${offer.discount.value}% OFF`
                        : `$${offer.discount.value.toFixed(2)} OFF`}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingOffer(offer);
                      setShowModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(offer.id)}
                    className="p-2 text-red-400 hover:text-red-500 rounded-full hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
          {offers.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500">
              No offers found. Click "Add Offer" to create one.
            </li>
          )}
        </ul>
      </div>

      <OfferModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingOffer(null);
        }}
        onSave={handleSave}
        offer={editingOffer}
      />
    </div>
  );
};