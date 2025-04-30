import { Message } from "../types/message";
import { BASE_URL, getAuthToken } from "./constants";

interface MessageData {
    ProductID: string;
    Message: string;
    Role: string;
  }

  export const addMessage = async (MessageData: MessageData) => {
    const authToken = await getAuthToken();
  
    try {
      const response = await fetch(`${BASE_URL}/message`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          product_id: MessageData.ProductID,
          message: MessageData.Message,
          role: "ADMIN",
        }),
      });
  
      const result = await response.json();
      return result;
    } catch (error) {
      throw new Error("Something went wrong while sending the message.");
    }
  };
  
  export const fetchMessage = async (productId: string): Promise<Message[]> => {
    const authToken = await getAuthToken();
  
    try {
      const response = await fetch(`${BASE_URL}/message/${productId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
  
      const result: Message[] = await response.json();
      return result;
    } catch (error) {
      throw new Error("Something went wrong while fetching messages.");
    }
  };
  
  
  