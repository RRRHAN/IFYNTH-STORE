import { Product } from "../types/product";

export type Transaction = {
  ID: string;
  UserID: string;
  TotalAmount: number;
  PaymentMethod: string;
  PaymentProof: string;
  Status: string;
  CreatedAt: string;
  UpdatedAt: string;
  TransactionDetails: TransactionDetails[];
  ShippingAddress: ShippingAddress;
};

export type TransactionDetails = {
  ID: string;
  TransactionID: string;
  ProductID: string;
  Size: string;
  Quantity: string;
  CreatedAt: string;
  UpdatedAt: string;
  Product: Product;
};

export type ShippingAddress = {
  ID: string;
  TransactionID: string;
  Name: string;
  PhoneNumber: string;
  Address: string;
  ZipCode: string;
  DestinationLabel: string;
  Courir: string;
  ShippingCost: string;
  CreatedAt: string;
  UpdatedAt: string;
};
