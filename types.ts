
// Fix: Import React to resolve missing 'React' namespace error
import React from 'react';

export interface ServiceItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

export interface RecommendedProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  discount: number;
  image: string;
  isGenericAvailable: boolean;
}

export interface RapidModeState {
  enabled: boolean;
}
