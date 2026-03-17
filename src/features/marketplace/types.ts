export interface Listing {
    id: string;
    category: string;
    title: string;
    location: string;
    priceRange: string;
    imageUrl: string;
  }
  
  export interface Category {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
  }