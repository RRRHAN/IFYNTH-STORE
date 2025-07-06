export type ProductImage = {
  ID: string;
  ProductID: string;
  URL: string;
  CreatedAt: string;
};

export type StockDetail = {
  ID: string;
  ProductID: string;
  Size: string;
  Stock: number;
  CreatedAt: string;
  UpdatedAt: string;
};

export type ProductCapital = {
  ID: string;
  ProductID: string;
  TotalStock: number;
  CapitalPerItem: number;
  TotalCapital: number;
  CreatedAt: string;
  UpdatedAt: string;
};

export type Product = {
  ID: string;
  Name: string;
  TotalStock: number;
  Description: string;
  Price: number;
  Department: string;
  Category: string;
  CreatedAt: string;
  UpdatedAt: string;
  ProductImages: ProductImage[];
  StockDetails: StockDetail[];
  ProductCapital: ProductCapital;
};

export type cusProduct = {
  ID: string;
  customer_name: string;
  Name: string;
  Description: string;
  Price: number;
  Status: string;
  CreatedAt: string;
  UpdatedAt: string;
  Files: CustomerProductFiles[];
  UnreadCount: number;
};

export type CustomerProductFiles = {
  ID: string;
  ProductID: string;
  URL: string;
  CreatedAt: string;
};
export type PaginationMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type PaginatedProductsResponse = {
  data: Product[];
  pagination: PaginationMeta;
};