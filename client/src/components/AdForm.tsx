import { useState } from 'react';
import { AreaAutocomplete } from './AreaAutocomplete';
import type { AdFormData, AreaSuggestion, ListingType } from '../types';

interface AdFormProps {
  onSuccess: () => void;
}

const initialFormData: AdFormData = {
  title: '',
  type: '',
  area_place_id: '',
  area_main_text: '',
  area_secondary_text: '',
  price: '',
  description: '',
};

export function AdForm({ onSuccess }: AdFormProps) {
  const [formData, setFormData] = useState<AdFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof AdFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleAreaSelect = (suggestion: AreaSuggestion) => {
    setFormData(prev => ({
      ...prev,
      area_place_id: suggestion.placeId,
      area_main_text: suggestion.mainText,
      area_secondary_text: suggestion.secondaryText,
    }));
    if (suggestion.placeId) {
      setErrors(prev => ({ ...prev, area_place_id: undefined }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AdFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 155) {
      newErrors.title = 'Title must be 155 characters or less';
    }

    if (!formData.type) {
      newErrors.type = 'Please select a listing type';
    }

    // area_place_id only gets set when the user actually picks from the dropdown
    if (!formData.area_place_id) {
      newErrors.area_place_id = 'Please select an area from the suggestions';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit ad');
      }

      setFormData(initialFormData);
      onSuccess();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="ad-form">
      <h1 className="form-title">New property classified</h1>

      <div className="form-group">
        <label htmlFor="title">Title <span className="required">*</span></label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          maxLength={155}
          placeholder="Classified title up to 155 chars"
          className={`form-input ${errors.title ? 'input-error' : ''}`}
        />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="type">Type <span className="required">*</span></label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={`form-input ${errors.type ? 'input-error' : ''}`}
        >
          <option value="">Select type</option>
          <option value="rent">Rent</option>
          <option value="buy">Buy</option>
          <option value="exchange">Exchange</option>
          <option value="donation">Donation</option>
        </select>
        {errors.type && <span className="field-error">{errors.type}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="area">Area <span className="required">*</span></label>
        <AreaAutocomplete
          value={formData.area_main_text}
          onSelect={handleAreaSelect}
          error={errors.area_place_id}
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Price in Euros <span className="required">*</span></label>
        <input
          id="price"
          name="price"
          type="text"
          value={formData.price}
          onChange={handleChange}
          inputMode="decimal"
          pattern="[0-9]*"
          placeholder="Amount"
          className={`form-input ${errors.price ? 'input-error' : ''}`}
        />
        {errors.price && <span className="field-error">{errors.price}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Extra description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Type here"
          rows={4}
          className="form-input"
        />
      </div>

      {submitError && <p className="submit-error">{submitError}</p>}

      <button type="submit" disabled={isSubmitting} className="submit-btn">
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}