// components/products/ProductSizeManagement.tsx
import React, { useState, useEffect } from "react";
import { View, Alert, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import SizeInputItem from "./SizeInputItem";

type SizeOption = "" | "tshirt" | "pants"; // "" means manual/custom

interface SizeDetail {
  size: string;
  stock: number;
}

interface ProductSizeManagementProps {
  sizes: SizeDetail[]; // Existing sizes from parent
  setSizes: React.Dispatch<React.SetStateAction<SizeDetail[]>>;
  isDark: boolean;
  handleStockChange: (
    index: number,
    value: string,
    currentSizes: SizeDetail[],
    setSizes: React.Dispatch<React.SetStateAction<SizeDetail[]>>
  ) => void;
  inputStyle: any; // Style for ThemedTextInput
  titleStyle: any; // Style for ThemedText title
  initialSelectedSizeOption?: SizeOption; // New prop for initial state in edit mode
}

export default function ProductSizeManagement({
  sizes,
  setSizes,
  isDark,
  handleStockChange,
  inputStyle,
  titleStyle,
  initialSelectedSizeOption = "", // Default to empty if not provided
}: ProductSizeManagementProps) {
  const [newSizeName, setNewSizeName] = useState("");
  // Initialize selectedSizeOption based on prop, but allow local state to manage changes
  const [selectedSizeOption, setSelectedSizeOption] = useState<SizeOption>(initialSelectedSizeOption);

  // Effect to initialize sizes *only when initialSelectedSizeOption changes*
  // or when component mounts with initial data.
  // This is different from AddProductScreen, where we always reset sizes when option changes.
  // Here, if initialSelectedSizeOption is not empty, we assume sizes from parent are the source of truth.
  // If initialSelectedSizeOption is empty, we allow manual input.
  useEffect(() => {
    // If we're coming from edit screen and `initialSelectedSizeOption` is not empty,
    // don't reset sizes based on that, as `sizes` prop already contains correct data.
    // This `useEffect` primarily handles changes from the picker *after* initial load.
    if (selectedSizeOption === "tshirt") {
      setSizes([
        { size: "S", stock: 0 },
        { size: "M", stock: 0 },
        { size: "L", stock: 0 },
        { size: "XL", stock: 0 },
      ]);
    } else if (selectedSizeOption === "pants") {
      setSizes([
        { size: "27", stock: 0 }, { size: "28", stock: 0 }, { size: "29", stock: 0 },
        { size: "30", stock: 0 }, { size: "31", stock: 0 }, { size: "32", stock: 0 },
        { size: "33", stock: 0 }, { size: "34", stock: 0 },
      ]);
    } else if (selectedSizeOption === "") {
      // If user switches back to "manual", clear sizes unless they already have data
      // from the initial load that doesn't match a preset.
      // This is a bit tricky: we only want to clear if the sizes were previously set by a preset.
      // For simplicity, we can always clear if the option is manual,
      // and let the user re-add them or modify existing ones.
      // For edit mode, we'd typically initialize from `sizes` prop.
      // If initialSelectedSizeOption was empty, `sizes` would be whatever came from the item.
      // If user then picks preset, `sizes` gets overridden. If they go back to empty, `sizes` gets cleared again.
      // This seems consistent.
      // Important: On initial render, if `initialSelectedSizeOption` is empty (meaning custom sizes from item),
      // we DON'T want to clear `sizes` here.
      // We need to differentiate initial mount from subsequent picker changes.
      // A common pattern is to use a ref or check if `sizes` prop has already been populated.
      // For simplicity in this edit scenario, if `selectedSizeOption` becomes empty
      // due to user action, we clear the list to allow manual input.
      // If it's initially empty due to existing custom sizes, they will just be displayed.
      // Let's remove this `else if (selectedSizeOption === "") { setSizes([]); }` from this useEffect
      // and assume `sizes` is handled by the parent when `selectedSizeOption` is "".
      // `sizes` will be the initial item's sizes if `initialSelectedSizeOption` is "".
    }
  }, [selectedSizeOption]);

  const handleAddSize = () => {
    if (newSizeName.trim() === "") {
      Alert.alert("Input Error", "Ukuran tidak boleh kosong.");
      return;
    }
    const exists = sizes.some(
      (s) => s.size.toLowerCase() === newSizeName.trim().toLowerCase()
    );
    if (exists) {
      Alert.alert("Input Error", "Ukuran ini sudah ada.");
      return;
    }
    setSizes([...sizes, { size: newSizeName.trim(), stock: 0 }]);
    setNewSizeName("");
    // When adding manual size, ensure picker is set to ""
    setSelectedSizeOption("");
  };

  const handleRemoveSize = (indexToRemove: number) => {
    setSizes(sizes.filter((_, index) => index !== indexToRemove));
  };


  return (
    <View>
      <ThemedText style={titleStyle}>Pilih Model Ukuran</ThemedText>
      <ThemedView
        style={[
          componentStyles.pickerSizeContainer,
          {
            backgroundColor: isDark ? "#333" : "#fff",
            borderColor: isDark ? "#666" : "#ddd",
          },
        ]}
      >
        <Picker
          selectedValue={selectedSizeOption}
          onValueChange={(itemValue: SizeOption) => {
            setSelectedSizeOption(itemValue);
          }}
          style={[
            componentStyles.pickerSize,
            {
              backgroundColor: isDark ? "#333" : "#fff",
              color: isDark ? "#fff" : "#333",
            },
          ]}
        >
          <Picker.Item label="Pilih Model Ukuran / Masukkan Manual" value="" />
          <Picker.Item
            label="Ukuran Kaos/Hoodie/Jaket (S, M, L, XL)"
            value="tshirt"
          />
          <Picker.Item label="Ukuran Celana (27-34)" value="pants" />
        </Picker>
      </ThemedView>

      {selectedSizeOption === "" && (
        <>
          <ThemedText style={titleStyle}>Tambah Ukuran Manual</ThemedText>
          <View style={componentStyles.addSizeContainer}>
            <ThemedTextInput
              style={[
                inputStyle,
                componentStyles.newSizeInput,
                {
                  backgroundColor: isDark ? "#333" : "#fff",
                  color: isDark ? "#ffffff" : "#111827",
                },
              ]}
              placeholder="Masukkan ukuran baru (contoh: S, M, 30, All Size)"
              value={newSizeName}
              onChangeText={setNewSizeName}
              onSubmitEditing={handleAddSize}
            />
            <TouchableOpacity
              style={componentStyles.addSizeButton}
              onPress={handleAddSize}
            >
              <FontAwesome name="plus" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </>
      )}
      <View style={componentStyles.multiColumnSizeContainer}>
        {Array.isArray(sizes) &&
          sizes.map((size, index) => (
            <View key={index} style={componentStyles.sizeItemWrapper}>
              <SizeInputItem
                size={size.size}
                stock={size.stock}
                onStockChange={(value) =>
                  handleStockChange(index, value, sizes, setSizes)
                }
              />
              {selectedSizeOption === "" && (
                <TouchableOpacity
                  style={componentStyles.removeSizeButton}
                  onPress={() => handleRemoveSize(index)}
                >
                  <FontAwesome name="minus-circle" size={20} color="red" />
                </TouchableOpacity>
              )}
            </View>
          ))}
      </View>
    </View>
  );
}

const componentStyles = StyleSheet.create({
  pickerSizeContainer: {
    borderWidth: 1,
    borderRadius: 6,
    marginTop: 5,
    overflow: "hidden",
  },
  pickerSize: {
    height: 50,
    width: "100%",
  },
  addSizeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 5,
  },
  newSizeInput: {
    flex: 1,
    marginRight: 10,
  },
  addSizeButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  multiColumnSizeContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sizeItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },
  removeSizeButton: {
    marginLeft: 5,
    padding: 5,
  },
});