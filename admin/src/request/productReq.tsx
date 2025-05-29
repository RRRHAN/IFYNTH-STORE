export interface ProductData {
  name: string;
  description: string;
  price: string;
  capital: string;
  weight: string;
  department: string;
  category: string;
  sizes: { size: string; stock: number }[];
  images: any[];
}

export interface UpdateProductData {
  productId: string;
  name: string;
  description: string;
  price: string;
  capital: string;
  weight: string;
  department: string;
  category: string;
  sizes: { size: string; stock: number }[];
  images: any[];
  removedImages: { productID: string; url: string }[];
}

export interface ImageAsset {
  uri: string;
  fileName?: string;
  mimeType?: string;
}