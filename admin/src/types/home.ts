import { DataDetectorTypes } from "react-native";

export type DepartentCount = {
  Department: string;
  Count: Int32Array;
};

export type TransactionCount = {
  Status: string;
  Count: Int32Array;
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