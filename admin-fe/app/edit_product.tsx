import React, { useState, useEffect } from "react";
import { View, Alert, ScrollView, Platform } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { pickImage2 } from "@/hooks/helpers/pickImage2";
import styles from "./styles/addProductStyles";
import { updateProduct } from "@/src/api/products";
import { ThemedText } from "@/components/ThemedText";
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
import { useGlobalModal } from "../context/ModalContext";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ArrowLeft } from "lucide-react-native";

export default function EditProductScreen() {
  const [isEditing, setIsEditing] = useState(true);
  const { showModal } = useGlobalModal();
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
  } = useProductForm(item);
  const {
    images,
    setImages,
    checkedImages,
    removedImages,
    handleToggleImage,
    handleRemoveImage,
  } = useImages(item?.ProductImages || []);

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
      capital,
      weight,
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
        showModal({
          title: "Update Success!",
          message: result.message || "Product updated successfully.",
          type: "success",
          onConfirm: () => {
            router.push("/products");
          },
        });
      } else {
        showModal({
          title: "Update Failed!",
          message: result.message || "Invalid credentials. Please try again.",
          type: "error",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      showModal({
        title: "Update Failed!",
        message: "Something went wrong",
        type: "error",
        confirmButtonText: "Close",
      });
    }
  };

  useEffect(() => {
    if (sizes && sizes.length > 0) {
      const newSizes = sizes.map((sizeObj) => ({
        size: sizeObj.size,
        stock: sizeObj.stock,
      }));
      setSizes((prevSizes) => {
        if (JSON.stringify(newSizes) !== JSON.stringify(prevSizes)) {
          return newSizes;
        }
        return prevSizes;
      });
    } else if (!sizes) {
      const defaultSizes = getDefaultSizesByCategory(category);
      setSizes((prevSizes) => {
        if (JSON.stringify(defaultSizes) !== JSON.stringify(prevSizes)) {
          return defaultSizes;
        }
        return prevSizes;
      });
    }
  }, [category, item?.StockDetails]);

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: isDark ? "#000" : "#fff",
          paddingTop: Platform.OS === "web" ? 0 : 70,
        },
      ]}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <Box className="w-full max-w-xl flex-row justify-start mb-4 px-4">
        <Button
          variant="link"
          action="secondary"
          onPress={() => router.push("/(tabs)/products")}
          className="p-0"
        >
          <Icon
            as={ArrowLeft}
            size="xl"
            color={theme === "dark" ? "#D1D5DB" : "#4B5563"}
          />
        </Button>
        <ThemedText style={[styles.title]}>Edit Product</ThemedText>
      </Box>

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
        isEditing={isEditing}
      />

      <View style={styles.sizeContainer}>
        {Array.isArray(sizes) &&
          sizes.map((size, index) => (
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
        pickImage={() => pickImage2(setImages, showModal)}
        handleUpdateProduct={handleUpdateProduct}
        styles={styles}
      />
    </ScrollView>
  );
}
