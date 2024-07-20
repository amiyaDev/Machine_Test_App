// Define the type for the rating
interface Rating {
  rate: number;
  count: number;
}

// Define the type for the product
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
  active: boolean;
}

// Define the type for the API response
export interface ProductApiResponse {
  data: Product[];
  status: number;
  statusText: string;
  headers: {
    "content-type": string;
  };
}
