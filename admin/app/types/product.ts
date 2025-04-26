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
  };
  