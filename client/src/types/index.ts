// Shape of a single autocomplete result from the xe.gr API
export interface AreaSuggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
}

// The four allowed listing types
export type ListingType = 'rent' | 'buy' | 'exchange' | 'donation';

// Shape of an ad as it comes back from our backend
export interface Ad {
  id: number;
  title: string;
  type: ListingType;
  area_place_id: string;
  area_main_text: string;
  area_secondary_text: string;
  price: number;
  description: string | null;
  created_at: string;
}

// Shape of the form data before submission
export interface AdFormData {
  title: string;
  type: ListingType | '';
  area_place_id: string;
  area_main_text: string;
  area_secondary_text: string;
  price: string;
  description: string;
}