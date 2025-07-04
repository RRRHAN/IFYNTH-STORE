import { BASE_URL, getAuthToken } from "./constants";
import { DepartentCount, ProfitProduct, TotalTransactionUser, TransactionCount, TransactionReport } from "../types/home";

export const fetchProductCount = async (): Promise<DepartentCount[]> => {
  const token = await getAuthToken();
  const getAllUrl = `${BASE_URL}/api/product/count`;

  const response = await fetch(getAllUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result.data;
};

export const fetchTransactionCount = async (): Promise<TransactionCount[]> => {
  const token = await getAuthToken();
  const getAllUrl = `${BASE_URL}/api/transaction/count`;

  const response = await fetch(getAllUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result.data;
};

export const fetchTransactionReports = async (): Promise<TransactionReport[]> => {
  const token = await getAuthToken();
  const getAllUrl = `${BASE_URL}/api/transaction/report`;

  const response = await fetch(getAllUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result.data;
};

export const fetchTotalCapital = async (): Promise<number> => {
  const token = await getAuthToken();
  const getAllUrl = `${BASE_URL}/api/product/totalCapital`;

  const response = await fetch(getAllUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result.data;
};

export const fetchTotalIncome = async (): Promise<number> => {
  const token = await getAuthToken();
  const getAllUrl = `${BASE_URL}/api/transaction/totalIncome`;

  const response = await fetch(getAllUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result.data;
};

export const fetchTotalTransactionUser = async (): Promise<TotalTransactionUser[]> => {
  const token = await getAuthToken();
  const getAllUrl = `${BASE_URL}/api/transaction/totalTransactionUser`;

  const response = await fetch(getAllUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result.data;
};

export const fetchProductProfit = async (): Promise<ProfitProduct[]> => {
  const token = await getAuthToken();
  const getAllUrl = `${BASE_URL}/api/product/productProfit`;

  const response = await fetch(getAllUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result.data;
};