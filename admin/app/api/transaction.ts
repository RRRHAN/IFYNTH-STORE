import { Transaction } from "../types/transaction";
import { BASE_URL, getAuthToken } from "./constants";

export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    const token = await getAuthToken();
    const getAllUrl = `${BASE_URL}/transaction/all`;

    const response = await fetch(getAllUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    console.log("Transaction fetch result:", result);

    return result.data as Transaction[];
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    throw error;
  }
};

export type TransactionStatus = "pending" | "paid" | "proccess" | "delivered" | "cancelled";

export const handleStatusChange = async (
  newStatus: TransactionStatus,
  TransactionId: string
): Promise<any> => {
  const token = await getAuthToken();
  const updateStatus = `${BASE_URL}/transaction/status`;

  try {
    const response = await fetch(updateStatus, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transaction_id: TransactionId,
        status: newStatus,
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to update status:", error);
    throw new Error("Something went wrong while updating the status.");
  }
};
