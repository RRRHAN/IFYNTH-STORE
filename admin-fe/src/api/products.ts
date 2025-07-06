import { Product } from "../types/product";
import { BASE_URL, BASE_URLS, getAuthToken } from "./constants";
import { ProductData, UpdateProductData } from "../request/productReq";
import { Platform } from "react-native";

export const fetchProducts = async (
  keyword: string = ""
): Promise<Product[]> => {
  const token = await getAuthToken();
  try {
    const query = keyword ? `?keyword=${encodeURIComponent(keyword)}` : "";
    const getAllUrl = `${BASE_URL}/api/product${query}`;

    const headers: Record<string, string> =
      Platform.OS === "ios"
        ? { Auth: `Bearer ${token}` }
        : { Authorization: `Bearer ${token}` };

    const response = await fetch(getAllUrl, {
      headers: headers,
    });

    const raw = await response.text();
    let parsed: any = {};

    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.warn("Response is not valid JSON:", raw);
    }

    if (!response.ok) {
      const errorMsg =
        Array.isArray(parsed?.errors) && parsed.errors.length > 0
          ? parsed.errors.join(", ")
          : `HTTP ${response.status}`;
      throw new Error(errorMsg);
    }

    return parsed.data;
  } catch (err: any) {
    console.error("Failed to fetch products:", err?.message || err);
    return [];
  }
};

export const fetchProductsByImage = async (
  formData: FormData
): Promise<Product[]> => {
  const token = await getAuthToken();
  try {
    const url = `${BASE_URL}/api/product/get-by-image`;

    const headers: Record<string, string> =
      Platform.OS === "ios"
        ? { Auth: `Bearer ${token}` }
        : { Authorization: `Bearer ${token}` };

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Fetched product by image data:", result.data);
    return result.data;
  } catch (error) {
    console.error("Failed to fetch products by image:", error);
    return [];
  }
};

export const addProduct = async (productData: ProductData) => {
  const token = await getAuthToken();
  const formData = new FormData();

  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("price", productData.price);
  formData.append("capital", productData.capital);
  formData.append("weight", productData.weight);
  formData.append("department", productData.department);
  formData.append("category", productData.category);

  if (productData.images.length > 0) {
    if (Platform.OS === "web") {
      for (const [index, img] of productData.images.entries()) {
        const imageUri = img.uri;
        const response = await fetch(imageUri);
        const blob = await response.blob();
        formData.append("images", blob, img.fileName || `image${index}.jpg`);
      }
    } else {
      console.log("Mengunggah gambar dari PLATFORM MOBILE...");
      for (const [index, img] of productData.images.entries()) {
        const imageUri = img.uri;
        const fileName = img.fileName || `image_${Date.now()}_${index}.jpg`;
        const fileType = img.type || "image/jpeg";

        formData.append("images", {
          uri: imageUri,
          name: fileName,
          type: fileType,
        } as any);
      }
    }
  }

formData.append("stock_details", JSON.stringify(productData.sizes));

  const headers: Record<string, string> =
    Platform.OS === "ios"
      ? { Auth: `Bearer ${token}` }
      : { Authorization: `Bearer ${token}` };

  try {
    const PostProduct = `${BASE_URL}/api/product/`;
    const response = await fetch(PostProduct, {
      method: "POST",
      headers: headers,
      body: formData,
    });

    console.log("HTTP Status Code:", response.status);
    const responseText = await response.text();
    console.log("Raw Server Response:", responseText);

    let result;
    try {
      result = JSON.parse(responseText);
      console.log("Parsed JSON Response:", result);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      throw new Error(
        `Server returned non-JSON response or parse error: ${responseText}`
      );
    }

    if (!response.ok) {
      console.error(
        "Server returned an error status:",
        response.status,
        result
      );
      throw new Error(
        result.message || "Failed to add product on server (Non-OK status)."
      );
    }

    return result;
  } catch (error) {
    throw new Error("Something went wrong while adding the product.");
  }
};

export const deleteProduct = async (productId: string) => {
  const token = await getAuthToken();
  const deleteUrl = `${BASE_URL}/api/product/${productId}`;

  const headers: Record<string, string> =
    Platform.OS === "ios"
      ? { Auth: `Bearer ${token}` }
      : { Authorization: `Bearer ${token}` };

  try {
    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: headers,
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(
        errorResponse.errors?.[0] ||
          `Failed to delete product. Status: ${response.status}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    throw new Error(
      error.message || "Something went wrong while deleting the product."
    );
  }
};

export const updateProduct = async (productData: UpdateProductData) => {
  const token = await getAuthToken();
  const formData = new FormData();

  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("price", productData.price);
  formData.append("capital", productData.capital);
  formData.append("weight", productData.weight);
  formData.append("department", productData.department);
  formData.append("category", productData.category);

  if (productData.images.length > 0) {
    if (Platform.OS === "web") {
      for (const [index, img] of productData.images.entries()) {
        const imageUri = img.uri;
        const response = await fetch(imageUri);
        const blob = await response.blob();
        formData.append("images", blob, img.fileName || `image${index}.jpg`);
      }
    } else {
      for (const [index, img] of productData.images.entries()) {
        const imageUri = img.uri;
        const fileName = img.fileName || `image_${Date.now()}_${index}.jpg`;
        const fileType = img.type || "image/jpeg";

        formData.append("images", {
          uri: imageUri,
          name: fileName,
          type: fileType,
        } as any);
      }
    }
  }

  if (productData.removedImages) {
    formData.append("removedImages", JSON.stringify(productData.removedImages));
  }

  formData.append("stockDetails", JSON.stringify(productData.sizes));

  const headers: Record<string, string> =
    Platform.OS === "ios"
      ? { Auth: `Bearer ${token}` }
      : { Authorization: `Bearer ${token}` };

  try {
    const updateUrl = `${BASE_URL}/api/product/update/${productData.productId}`;
    const response = await fetch(updateUrl, {
      method: "PUT",
      headers: headers,
      body: formData,
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    throw new Error(
      error.message || "Something went wrong while updating the product."
    );
  }
};
