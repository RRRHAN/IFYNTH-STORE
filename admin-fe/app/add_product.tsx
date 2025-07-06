import ActionButtons from "@/components/products/ActionButtons";
import ProductFormInputs from "@/components/products/ProductFormInput";
import ProductPickers from "@/components/products/ProductPickers";
import SelectedImagesList from "@/components/products/SelectedImagesList";
import SizeInputItem from "@/components/products/SizeInputItem";
import { ThemedText } from "@/components/ThemedText";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { handleStockChange } from "@/hooks/helpers/handleStockChange";
import { pickImage2 } from "@/hooks/helpers/pickImage2";
import { pickImage1 } from "@/hooks/helpers/pickImage";
import { useProductForm } from "@/hooks/helpers/useAddProductForm";
import { useColorScheme } from "@/hooks/useColorScheme";
import { addProduct } from "@/src/api/products";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Alert, Platform, ScrollView, View } from "react-native";
import { useGlobalModal } from "../context/ModalContext";
import styles from "./styles/addProductStyles";

export default function AddProductScreen() {
  const { showModal } = useGlobalModal();
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

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const handleAddProduct = async () => {
    if (
      !name ||
      !price ||
      !description ||
      !capital ||
      !weight ||
      !department ||
      !category ||
      !images || images.length === 0
    ) {
      showModal({
        title: "Validation Error",
        message: "All fields are required.",
        type: "error",
      });
      return;
    }

    const stockDetails = sizes;

    if (stockDetails.length === 0) {
      showModal({
        title: "Validation Error",
        message: "At least one size should have stock greater than 0..",
        type: "error",
      });
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
        showModal({
          title: "Add Product Success!",
          message: result.message || "You have successfully added product.",
          type: "success",
          onConfirm: () => {
            router.push("/products");
          },
        });
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
            { size: "All Size", stock: 0 },
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
            { size: "All Size", stock: 0 },
          ]);
        } else {
          setSizes([{ size: "All Size", stock: 0 }]);
        }
        setImages([]);
      } else {
        showModal({
          title: "Add Product Failed!",
          message: result.errors[0] || "Invalid credentials. Please try again.",
          type: "error",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      showModal({
        title: "Add Product Failed!",
        message: "Something went wrong",
        type: "error",
        confirmButtonText: "Close",
      });
    }
  };
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
        <ThemedText style={[styles.title]}>Add Product</ThemedText>
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
        isEditing={false}
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

      <SelectedImagesList
        images={images}
        handleRemoveImage={handleRemoveImage}
        styles={styles}
      />

      <ActionButtons
        pickImage={() => {
          pickImage2(setImages, showModal);
        }}
        handleAddProduct={handleAddProduct}
        styles={styles}
      />
    </ScrollView>
  );
}
