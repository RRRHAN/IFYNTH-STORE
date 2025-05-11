import { BASE_URL, getAuthToken } from "./constants";
import { DepartentCount, TransactionCount } from "../types/home";

export const fetchProductCount = async (): Promise<DepartentCount[]> => {
  const token = await getAuthToken();
  const getAllUrl = `${BASE_URL}/product/count`;

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
  const getAllUrl = `${BASE_URL}/transaction/count`;

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