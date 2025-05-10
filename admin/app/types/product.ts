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
    Capital: number;
    Department: string;
    Category: string;
    CreatedAt: string;
    UpdatedAt: string;
    ProductImages: ProductImage[];
    StockDetails: StockDetail[];
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
  };

  export type CustomerProductFiles = {
    ID: string;
    ProductID: string;
    URL: string;
    CreatedAt: string;
  };

  export type DepartentCount = {
    Department: string;
    Count: Int32Array;
  };