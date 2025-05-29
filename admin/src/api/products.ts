import { Product } from "../types/product";
import { BASE_URL, getAuthToken } from "./constants";
import { ProductData, UpdateProductData } from "../request/productReq";

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const token = await getAuthToken();
    const getAllUrl = `${BASE_URL}/api/product`;

    const response = await fetch(getAllUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Fetched product data:", result.data);
    return result.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
};

export const addProduct = async (productData: ProductData) => {
  const authToken = await getAuthToken();
  const formData = new FormData();

  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("price", productData.price);
  formData.append("capital", productData.capital);
  formData.append("weight", productData.weight);
  formData.append("department", productData.department);
  formData.append("category", productData.category);

  if (productData.images.length > 0) {
    for (const [index, img] of productData.images.entries()) {
      const imageUri = img.uri;
      const response = await fetch(imageUri);
      const blob = await response.blob();
      formData.append("images", blob, img.name || `image${index}.jpg`);
    }
  }

  productData.sizes.forEach((size) => {
    formData.append("stock_details", JSON.stringify(size));
  });

  try {
    const PostProduct = `${BASE_URL}/api/product/addProduct`;
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

export const deleteProduct = async (productId: string) => {
  const token = await getAuthToken();
  const deleteUrl = `${BASE_URL}/api/product/${productId}`;

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

export const updateProduct = async (productData: UpdateProductData) => {
  const authToken = await getAuthToken();
  const formData = new FormData();

  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("price", productData.price);
  formData.append("capital", productData.capital);
  formData.append("weight", productData.weight);
  formData.append("department", productData.department);
  formData.append("category", productData.category);

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
  formData.append("stockDetails", JSON.stringify(productData.sizes));

  console.log("FormData contents:");
  for (const pair of formData.entries()) {
    console.log(`${pair[0]}:`, pair[1]);
  }

  try {
    const updateUrl = `${BASE_URL}/api/product/update/${productData.productId}`;
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
