import React, { useState, useEffect } from "react";
import { View, Alert, ScrollView, Image } from "react-native";
import ModalComponent from "../components/ModalComponent";
import { useColorScheme } from "@/hooks/useColorScheme";
import { pickImage } from "@/hooks/helpers/pickImage2";
import { handleStockChange } from "@/hooks/helpers/handleStockChange";
import styles from "./styles/addProductStyles";
import { addProduct } from "@/src/api/products";
import { ThemedText } from "@/components/ThemedText";
import { IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import SizeInputItem from "@/components/products/SizeInputItem";
import ProductFormInputs from "@/components/products/ProductFormInput";
import ProductPickers from "@/components/products/ProductPickers";
import ActionButtons from "@/components/products/ActionButtons";
import SelectedImagesList from "@/components/products/SelectedImagesList";
import { useProductForm } from "@/hooks/helpers/useAddProductForm";

export default function AddProductScreen() {
  const router = useRouter();
  const {
    name,
    setName,
    description,
    setDescription,
    price,
    setPrice,
    capital,
    setCapital,
    weight,
    setWeight,
    department,
    setDepartment,
    category,
    setCategory,
    sizes,
    setSizes,
    images,
    setImages,
  } = useProductForm();
  const theme = useColorScheme();
  const isDark = theme === "dark";
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const handleAddProduct = async () => {
    if (!name || !price || !description) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    const stockDetails = sizes;

    if (stockDetails.length === 0) {
      Alert.alert(
        "Validation Error",
        "At least one size should have stock greater than 0."
      );
      return;
    }

    const productData = {
      name,
      description,
      price,
      capital,
      weight,
      department,
      category,
      sizes: stockDetails,
      images,
    };

    try {
      const result = await addProduct(productData);
      if (result.errors === null) {
        setSuccessMessage("Product added successfully.");
        setVisible(true);
        setName("");
        setDescription("");
        setPrice("");
        setCapital("");
        setWeight("");
        setDepartment("");
        setCategory("");
        if (
          category === "T-Shirt" ||
          category === "Hoodie" ||
          category === "Jacket"
        ) {
          setSizes([
            { size: "S", stock: 0 },
            { size: "M", stock: 0 },
            { size: "L", stock: 0 },
            { size: "XL", stock: 0 },
          ]);
        } else if (category === "Pants") {
          setSizes([
            { size: "27", stock: 0 },
            { size: "28", stock: 0 },
            { size: "29", stock: 0 },
            { size: "30", stock: 0 },
            { size: "31", stock: 0 },
            { size: "32", stock: 0 },
            { size: "33", stock: 0 },
            { size: "34", stock: 0 },
          ]);
        } else {
          setSizes([]);
        }
        setImages([]);
      } else {
        setErrorMessage(result.errors[0]);
        setVisible(true);
      }
    } catch (error) {
      setErrorMessage("Something went wrong");
      setVisible(true);
      console.error("Error adding product:", error);
    }
  };
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? "#000" : "#fff" }]}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <ModalComponent
        visible={visible}
        hideModal={() => setVisible(false)}
        message={errorMessage || successMessage}
      />
      <IconButton
        icon="arrow-left"
        size={30}
        onPress={() => router.replace("/products")}
        style={{
          top: 20,
        }}
      />
      <ThemedText style={[styles.title]}>Add Product</ThemedText>

      <ProductFormInputs
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        price={price}
        setPrice={setPrice}
        weight={weight}
        setWeight={setWeight}
        capital={capital}
        setCapital={setCapital}
        isDark={isDark}
        styles={styles}
      />

      <ProductPickers
        department={department}
        setDepartment={setDepartment}
        category={category}
        setCategory={setCategory}
        isDark={isDark}
        styles={styles}
        isEditing={false}
      />

      <View style={styles.sizeContainer}>
        {sizes.map((size, index) => (
          <SizeInputItem
            key={index}
            size={size.size}
            stock={size.stock}
            onStockChange={(value) =>
              handleStockChange(index, value, sizes, setSizes)
            }
          />
        ))}
      </View>

      <SelectedImagesList
        images={images}
        handleRemoveImage={handleRemoveImage}
        styles={styles}
      />

      <ActionButtons
        pickImage={() => {
          pickImage(setImages, setErrorMessage, setVisible)}}
        handleAddProduct={handleAddProduct}
        styles={styles}
      />
    </ScrollView>
  );
}
