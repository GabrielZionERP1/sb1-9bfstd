import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { OfferFormData } from '../../types/offer';

interface OfferFormProps {
  initialData?: OfferFormData;
  onSubmit: (data: OfferFormData) => void;
  onCancel: () => void;
}

export const OfferForm = ({ initialData, onSubmit, onCancel }: OfferFormProps) => {
  const [formData, setFormData] = useState<OfferFormData>(initialData || {
    name: '',
    description: '',
    discount: {
      type: 'percentage',
      value: 0
    },
    image: '',
    startDate: new Date(),
    endDate: new Date()
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Offer Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          maxLength={250}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          {formData.description.length}/250 characters
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Discount Type</label>
          <select
            value={formData.discount.type}
            onChange={(e) => setFormData({
              ...formData,
              discount: { ...formData.discount, type: e.target.value as 'percentage' | 'fixed' }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {formData.discount.type === 'percentage' ? 'Percentage Off' : 'Amount Off'}
          </label>
          <input
            type="number"
            value={formData.discount.value}
            onChange={(e) => setFormData({
              ...formData,
              discount: { ...formData.discount, value: parseFloat(e.target.value) }
            })}
            min="0"
            max={formData.discount.type === 'percentage' ? "100" : undefined}
            step={formData.discount.type === 'percentage' ? "1" : "0.01"}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={formData.startDate.toISOString().split('T')[0]}
            onChange={(e) => setFormData({
              ...formData,
              startDate: new Date(e.target.value)
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={formData.endDate.toISOString().split('T')[0]}
            onChange={(e) => setFormData({
              ...formData,
              endDate: new Date(e.target.value)
            })}
            min={formData.startDate.toISOString().split('T')[0]}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Offer Image (1080x1080)</label>
        <div className="mt-2">
          {formData.image ? (
            <div className="relative inline-block">
              <img
                src={formData.image}
                alt="Offer preview"
                className="h-64 w-64 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, image: '' })}
                className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer flex items-center justify-center h-64 w-64 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-500">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                required={!formData.image}
              />
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-600">
                  Upload image (1080x1080)
                </span>
              </div>
            </label>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Save
        </button>
      </div>
    </form>
  );
};