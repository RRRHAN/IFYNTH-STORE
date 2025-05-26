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
  TotalAmount: Float32Array;
  TotalTransaction: Int32Array;
};

export type ProfitProduct = {
  ProductID: string;
  ProductName: string;
  TotalCapital: number;
  TotalIncome: number;
};