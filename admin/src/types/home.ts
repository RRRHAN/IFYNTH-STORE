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