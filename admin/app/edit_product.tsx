import React, { useState, useEffect } from "react";
import { View, Alert, ScrollView } from "react-native";
import ModalComponent from "../components/ModalComponent";
import { useColorScheme } from "@/hooks/useColorScheme";
import { pickImage } from "@/hooks/helpers/pickImage";
import styles from "./styles/addProductStyles";
import { updateProduct } from "./api/products";
import { ThemedText } from "@/components/ThemedText";
import { IconButton } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { handleStockChange } from "@/hooks/helpers/handleStockChange";
import SizeInputItem from "@/components/products/SizeInputItem";
import { getDefaultSizesByCategory } from "@/hooks/helpers/getDefaultSizesByCategory";
import ProductFormInputs from "@/components/products/ProductFormInput";
import ProductPickers from "@/components/products/ProductPickers";
import CurrentImagesList from "@/components/products/CurrentImagesList";
import ActionButtons from "@/components/products/ActionButtons";
import SelectedImagesList from "@/components/products/SelectedImagesList";
import useProductForm from "@/hooks/helpers/useEditProductForm";
import useImages from "@/hooks/helpers/useImages";

export default function EditProductScreen() {
  const [isEditing, setIsEditing] = useState(true);
  const router = useRouter();
  const params = useLocalSearchParams();
  const item = params.item ? JSON.parse(params.item as string) : null;
  const theme = useColorScheme();
  const isDark = theme === "dark";
  const {
    name,
    setName,
    description,
    setDescription,
    price,
    setPrice,
    department,
    setDepartment,
    category,
    setCategory,
    sizes,
    setSizes,
  } = useProductForm(item);
  const {
    images,
    setImages,
    checkedImages,
    removedImages,
    handleToggleImage,
    handleRemoveImage,
  } = useImages(item?.ProductImages || []);
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleUpdateProduct = async () => {
    if (!name || !price || !description) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    const productData = {
      productId: item.ID,
      name,
      description,
      price,
      department,
      category,
      sizes,
      images,
      removedImages: removedImages.map((image) => ({
        productID: image.productId,
        url: image.url,
      })),
    };

    try {
      const result = await updateProduct(productData);
      if (result.errors === null) {
        setSuccessMessage("Product updated successfully.");
        setVisible(true);
      } else {
        setErrorMessage(result.errors[0]);
        setVisible(true);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setErrorMessage("Something went wrong");
      setVisible(true);
    }
  };

  useEffect(() => {
    console.log(item);
    if (sizes && sizes.length > 0) {
      const newSizes = sizes.map((sizeObj) => ({
        size: sizeObj.size,
        stock: sizeObj.stock,
      }));

      // Hanya update sizes jika ada perubahan
      setSizes((prevSizes) => {
        if (JSON.stringify(newSizes) !== JSON.stringify(prevSizes)) {
          return newSizes;
        }
        return prevSizes;
      });
    } else if (!sizes) {
      const defaultSizes = getDefaultSizesByCategory(category);

      // Hanya update sizes jika ada perubahan
      setSizes((prevSizes) => {
        if (JSON.stringify(defaultSizes) !== JSON.stringify(prevSizes)) {
          return defaultSizes;
        }
        return prevSizes;
      });
    }
  }, [category, item?.StockDetails]);

  const handleModalClose = () => {
    router.replace("/products");
  };

  const hideModal = () => {
    setVisible(false);
    handleModalClose();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? "#000" : "#fff" }]}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <ModalComponent
        visible={visible}
        hideModal={hideModal}
        message={errorMessage || successMessage}
      />
      <IconButton
        icon="arrow-left"
        size={30}
        onPress={() => router.replace("/products")}
      />
      <ThemedText style={[styles.title]}>Edit Product</ThemedText>

      <ProductFormInputs
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        price={price}
        setPrice={setPrice}
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
        isEditing={isEditing} 
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

      <CurrentImagesList
        productImages={item?.ProductImages || []}
        checkedImages={checkedImages}
        handleToggleImage={(index) => handleToggleImage(index, item)}
        styles={styles}
      />

      <SelectedImagesList
        images={images}
        handleRemoveImage={handleRemoveImage}
        styles={styles}
      />

      <ActionButtons
        pickImage={() => pickImage(setImages, setErrorMessage, setVisible)}
        handleUpdateProduct={handleUpdateProduct}
        styles={styles}
      />
    </ScrollView>
  );
}
