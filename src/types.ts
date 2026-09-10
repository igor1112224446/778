export type TermType = "short" | "medium" | "long";

export interface Apartment {
  id: string;
  title: string;
  district: string;
  address: string;
  price: number; // руб/мес
  area: number; // м²
  rooms: number;
  floor: number;
  totalFloors: number;
  termTypes: TermType[]; // на какие сроки аренды подходит объект
  description: string;
  amenities: string[];
  images: string[];
}

export interface BudgetRange {
  min: number;
  max: number;
}

export interface AreaRange {
  min: number;
  max: number;
}

export interface OnboardingAnswers {
  budget: BudgetRange;
  term: TermType;
  districts: string[];
  area: AreaRange;
}

export type SwipeDirection = "left" | "right";
