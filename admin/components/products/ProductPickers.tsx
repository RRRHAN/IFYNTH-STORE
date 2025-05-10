import React from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ThemedText } from "@/components/ThemedText";

interface ProductPickersProps {
  department: string;
  setDepartment: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  isDark: boolean;
  styles: any;
  isEditing: boolean; 
}

export default function ProductPickers({
  department,
  setDepartment,
  category,
  setCategory,
  isDark,
  styles,
  isEditing,
}: ProductPickersProps) {
  return (
    <View style={styles.pickerContainer}>
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

      <View style={styles.pickerWrapper}>
        <ThemedText style={[styles.inputLabel]}>Category</ThemedText>
        <Picker
          selectedValue={category}
          enabled={!isEditing} 
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
  );
}
