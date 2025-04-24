import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Alert, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import ModalComponent from "../components/ModalComponent";
import { useColorScheme } from "@/hooks/useColorScheme";
import { pickImage } from "@/hooks/helpers/pickImage";
import { handleStockChange } from "@/hooks/helpers/handleStockChange";
import styles from "./styles/addProductStyles";
import { addProduct } from "./api/products";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { IconButton } from "react-native-paper";
import { useRouter } from "expo-router";

export default function AddProductScreen() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [category, setCategory] = useState<string>("T-Shirt");
  const [sizes, setSizes] = useState<{ size: string; stock: number }[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const theme = useColorScheme();
  const isDark = theme === "dark";
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fungsi untuk menghapus gambar
  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  useEffect(() => {
    // Ubah ukuran berdasarkan kategori yang dipilih
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
  }, [category]);

  const handleAddProduct = async () => {
    if (!name || !price || !description) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    const stockDetails = sizes.filter((size) => size.stock > 0);

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
      {/* Back Button */}
      <IconButton
        icon="arrow-left"
        size={30}
        onPress={() => router.replace("/products")}
      />
      <ThemedText style={[styles.title]}>Add New Product</ThemedText>

      <ThemedTextInput
        style={[styles.input, { borderColor: isDark ? "#666" : "#ccc" }]}
        placeholder="Product Name"
        placeholderTextColor={isDark ? "#aaa" : "#888"}
        value={name}
        onChangeText={setName}
      />

      <ThemedTextInput
        style={[styles.input, { borderColor: isDark ? "#666" : "#ccc" }]}
        placeholder="Product Description"
        placeholderTextColor={isDark ? "#aaa" : "#888"}
        value={description}
        onChangeText={setDescription}
      />

      <ThemedTextInput
        style={[styles.input, { borderColor: isDark ? "#666" : "#ccc" }]}
        placeholder="Price"
        placeholderTextColor={isDark ? "#aaa" : "#888"}
        value={price}
        onChangeText={(text) => setPrice(text.replace(/[^0-9]/g, ""))}
        keyboardType="numeric"
      />

      {/* Department and Category side by side */}
      <View style={styles.pickerContainer}>
        {/* Department Picker */}
        <View style={styles.pickerWrapper}>
          <ThemedText style={[styles.inputLabel]}>Department</ThemedText>
          <Picker
            selectedValue={department}
            style={[
              styles.picker,
              {
                backgroundColor: isDark ? "#333" : "#fff",
                color: isDark ? "#fff" : "#333",
              },
            ]}
            onValueChange={(itemValue) => setDepartment(itemValue)}
          >
            <Picker.Item label="I Found You" value="IFY" />
            <Picker.Item label="No Time to Hell" value="NTH" />
          </Picker>
        </View>

        {/* Category Picker */}
        <View style={styles.pickerWrapper}>
          <ThemedText style={[styles.inputLabel]}>Category</ThemedText>
          <Picker
            selectedValue={category}
            style={[
              styles.picker,
              {
                backgroundColor: isDark ? "#333" : "#fff",
                color: isDark ? "#fff" : "#333",
              },
            ]}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            <Picker.Item label="T-Shirt" value="T-Shirt" />
            <Picker.Item label="Hoodie" value="Hoodie" />
            <Picker.Item label="Jacket" value="Jacket" />
            <Picker.Item label="Pants" value="Pants" />
            <Picker.Item label="Accessories" value="Accessories" />
          </Picker>
        </View>
      </View>

      {/* Stock per size side by side */}
      <View style={styles.sizeContainer}>
        {sizes.map((size, index) => (
          <View key={index} style={styles.sizeWrapper}>
            <ThemedText style={[styles.sizeText]}>Size: {size.size}</ThemedText>
            <ThemedTextInput
              style={[styles.input, { borderColor: isDark ? "#666" : "#ccc" }]}
              placeholder="Stock"
              placeholderTextColor={isDark ? "#aaa" : "#888"}
              value={size.stock.toString()}
              onChangeText={(value) =>
                handleStockChange(index, value, sizes, setSizes)
              }
              keyboardType="numeric"
            />
          </View>
        ))}
      </View>

      {/* Image Picker */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#28a745" }]}
        onPress={() => pickImage(setImages)}
      >
        <ThemedText style={styles.buttonText}>Pick an Image</ThemedText>
      </TouchableOpacity>

      {/* Display Selected Images */}
      {images.length > 0 && (
        <View>
          <ThemedText>Selected Images:</ThemedText>
          {images.map((img, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: img.uri }} style={styles.image} />
              {/* Tombol sampah untuk menghapus gambar */}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveImage(index)}
              >
                <IconButton
                  icon="trash-can" // Ikon sampah dari react-native-paper
                  size={24}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#007bff" }]}
        onPress={handleAddProduct}
      >
        <ThemedText style={styles.buttonText}>Add Product</ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
}
