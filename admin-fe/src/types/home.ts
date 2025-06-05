import { DataDetectorTypes } from "react-native";

export type DepartmentCount = {
  Department: string;
  Count: number;
};

export type TransactionCount = {
  Status: string;
  Count: number;
};

export type TransactionReport = {
  Date: string;
  TotalAmount: number;
};

export type TotalTransactionUser = {
  UserID: string;
  CustomerName: string;
  PhoneNumber: string;
  TotalAmount: number;
  TotalTransaction: number;
};

export type ProfitProduct = {
  ProductID: string;
  Name: string;
  TotalCapital: number;
  TotalRevenue: number;
};