import { Product } from "../types/product";
import { BASE_URL, getAuthToken } from "./constants";
import { ProductData, UpdateProductData } from "../request/productReq";
import { Platform } from "react-native";

export const fetchProducts = async (keyword: string = ""): Promise<Product[]> => {
  const token = await getAuthToken();
  try {
    const query = keyword ? `?keyword=${encodeURIComponent(keyword)}` : "";
    const getAllUrl = `${BASE_URL}/api/product${query}`;

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

export const fetchProductsByImage = async (formData: FormData): Promise<Product[]> => {
  const token = await getAuthToken();
  try {
    const url = `${BASE_URL}/api/product/get-by-image`;

    const response = await fetch(
          url,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Fetched product by image data:", result.data);
    return result.data;
  } catch (error) {
    console.error("Failed to fetch products by iamge:", error);
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
    if (Platform.OS === "web") {
      console.log("Mengunggah gambar dari PLATFORM WEB...");
      for (const [index, img] of productData.images.entries()) {
        const imageUri = img.uri;
        const response = await fetch(imageUri);
        const blob = await response.blob();
        formData.append("images", blob, img.fileName || `image${index}.jpg`);
        console.log(
          `✅ Gambar web '${
            img.fileName || `image${index}.jpg`
          }' ditambahkan ke FormData.`
        );
      }
    } else {
      // Platform adalah 'ios' atau 'android' (mobile)
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
        console.log(`✅ Gambar mobile '${fileName}' ditambahkan ke FormData.`);
      }
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

    // --- TAMBAHKAN LOG INI ---
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
    // --- AKHIR LOG TAMBAHAN ---

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
    if (Platform.OS === "web") {
      console.log("Mengunggah gambar dari PLATFORM WEB...");
      for (const [index, img] of productData.images.entries()) {
        const imageUri = img.uri;
        const response = await fetch(imageUri);
        const blob = await response.blob();
        formData.append("images", blob, img.fileName || `image${index}.jpg`);
        console.log(
          `✅ Gambar web '${
            img.fileName || `image${index}.jpg`
          }' ditambahkan ke FormData.`
        );
      }
    } else {
      // Platform adalah 'ios' atau 'android' (mobile)
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
        console.log(`✅ Gambar mobile '${fileName}' ditambahkan ke FormData.`);
      }
    }
  }

  if (productData.removedImages) {
    formData.append("removedImages", JSON.stringify(productData.removedImages));
  }

  formData.append("stockDetails", JSON.stringify(productData.sizes));

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
