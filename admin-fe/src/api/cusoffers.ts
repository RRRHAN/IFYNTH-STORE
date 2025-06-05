import { cusProduct } from "../types/product";
import { BASE_URL, getAuthToken } from "./constants";

export const fetchOffers = async (): Promise<cusProduct[]> => {
  const token = await getAuthToken();
  const getAllUrl = `${BASE_URL}/api/cusproduct/getall`;

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

export type Status = "pending" | "approved" | "rejected" | "process";

export const handleStatusChange = async (
  newStatus: Status,
  productId: string
): Promise<any> => {
  const token = await getAuthToken();
  const updateStatus = `${BASE_URL}/api/cusproduct/status`;

  try {
    const response = await fetch(updateStatus, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
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