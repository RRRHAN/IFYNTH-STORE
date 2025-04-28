import { Product } from "../types/product";
import { BASE_URL } from "./constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define ProductData interface
interface ProductData {
  name: string;
  description: string;
  price: string;
  department: string;
  category: string;
  sizes: { size: string; stock: number }[];
  images: any[];
}

export const fetchProducts = async (): Promise<Product[]> => {
  const token = await getAuthToken();
  const getAllUrl = `${BASE_URL}/product`;

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

export const addProduct = async (productData: ProductData) => {
  const authToken = await getAuthToken();
  const formData = new FormData();

  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("price", productData.price);
  formData.append("department", productData.department);
  formData.append("category", productData.category);

  // Menambahkan gambar jika ada
  if (productData.images.length > 0) {
    for (const [index, img] of productData.images.entries()) {
      const imageUri = img.uri;
      const response = await fetch(imageUri);
      const blob = await response.blob();
      formData.append("images", blob, img.name || `image${index}.jpg`);
    }
  }

  // Menambahkan stock_details meskipun ada stok 0
  formData.append("stock_details", JSON.stringify(productData.sizes));

  try {
    const PostProduct = `${BASE_URL}/product/addProduct`;
    const response = await fetch(PostProduct, {
      method: "POST",
      headers: { Authorization: `Bearer ${authToken}` },
      body: formData,
    });

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Something went wrong while adding the product.");
  }
};

// Get Auth token from AsyncStorage
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem("auth_token");
    return token;
  } catch (error) {
    throw new Error("Failed to fetch auth token.");
  }
};

// Delete a product by ID
export const deleteProduct = async (productId: string) => {
  const token = await getAuthToken();
  const deleteUrl = `${BASE_URL}/product/${productId}`;

  try {
    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

interface UpdateProductData {
  productId: string;
  name: string;
  description: string;
  price: string;
  department: string;
  category: string;
  sizes: { size: string; stock: number }[];
  images: any[];
  removedImages: { productID: string; url: string }[];
}

export const updateProduct = async (productData: UpdateProductData) => {
  const authToken = await getAuthToken();
  const formData = new FormData();

  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("price", productData.price);
  formData.append("department", productData.department);
  formData.append("category", productData.category);

  // Upload new images (if any)
  if (productData.images.length > 0) {
    for (const [index, img] of productData.images.entries()) {
      const imageUri = img.uri;
      const response = await fetch(imageUri);
      const blob = await response.blob();
      formData.append("images", blob, img.name || `image${index}.jpg`);
    }
  }

  if (productData.removedImages) {
    formData.append("removedImages", JSON.stringify(productData.removedImages));
  }
  
  console.log(productData);
  // Stock details
  formData.append("stockDetails", JSON.stringify(productData.sizes));

  try {
    const updateUrl = `${BASE_URL}/product/update/${productData.productId}`;
    const response = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
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
