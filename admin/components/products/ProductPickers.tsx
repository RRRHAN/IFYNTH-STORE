import React from "react";
import { Platform, View, TouchableOpacity, Modal } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import { ThemedView } from "../ThemedView";

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
  const [modalDepartVisible, setModalDepartVisible] = useState(false);
  const [modalCategoryVisible, setModalCategoryVisible] = useState(false);
  return (
    <>
      {Platform.OS === "ios" ? (
        <View style={styles.pickerContainer}>
          <View style={styles.pickerWrapper}>
            <ThemedText style={[styles.inputLabel]}>Department</ThemedText>
            <TouchableOpacity
              onPress={() => setModalDepartVisible(true)}
              style={{
                height: 50,
                width: 170,
                justifyContent: "center",
                backgroundColor: isDark ? "#555555" : "#f9fafb",
                paddingHorizontal: 10,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 10,
              }}
            >
              <ThemedText style={{ textAlign: "center" }}>
                {department}
              </ThemedText>
            </TouchableOpacity>
            <Modal
              visible={modalDepartVisible}
              transparent
              animationType="slide"
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.5)",
                }}
              >
                <ThemedView
                  style={{
                    paddingBottom: 20,
                    width: 300,
                    borderRadius: 20,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      padding: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setModalDepartVisible(false)}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        borderRadius: 20,
                        alignItems: "center",
                        right: 70,
                        bottom: 15,
                      }}
                    >
                      <ThemedText
                        style={{
                          color: "#000",
                          fontSize: 10,
                          fontWeight: "bold",
                        }}
                      >
                        ❌
                      </ThemedText>
                    </TouchableOpacity>
                    <ThemedText
                      style={{
                        paddingVertical: 10,
                        alignItems: "center",
                        fontSize: 20,
                        fontWeight: "bold",
                        right: 30,
                      }}
                    >
                      Department
                    </ThemedText>
                  </View>
                  <Picker
                    selectedValue={department}
                    itemStyle={{ height: 120 }}
                    onValueChange={(itemValue) => setDepartment(itemValue)}
                  >
                    <Picker.Item label="I Found You" value="IFY" />
                    <Picker.Item label="No Time to Hell" value="NTH" />
                  </Picker>
                </ThemedView>
              </View>
            </Modal>
          </View>

          <View style={styles.pickerWrapper}>
            <ThemedText style={[styles.inputLabel]}>Category</ThemedText>
            <TouchableOpacity
              onPress={() => {
                if (!isEditing) {
                  setModalCategoryVisible(true);
                }
              }}
              style={{
                height: 50,
                width: 170,
                justifyContent: "center",
                backgroundColor: isDark ? "#555555" : "#f9fafb",
                paddingHorizontal: 10,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 10,
                opacity: isEditing ? 0.6 : 1,
              }}
            >
              <ThemedText style={{ textAlign: "center" }}>
                {category}
              </ThemedText>
            </TouchableOpacity>
            <Modal
              visible={modalCategoryVisible}
              transparent
              animationType="slide"
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.5)",
                }}
              >
                <ThemedView
                  style={{
                    paddingBottom: 20,
                    width: 300,
                    borderRadius: 20,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      padding: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setModalCategoryVisible(false)}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        borderRadius: 20,
                        alignItems: "center",
                        right: 85,
                        bottom: 15,
                      }}
                    >
                      <ThemedText
                        style={{
                          color: "#000",
                          fontSize: 10,
                          fontWeight: "bold",
                        }}
                      >
                        ❌
                      </ThemedText>
                    </TouchableOpacity>
                    <ThemedText
                      style={{
                        paddingVertical: 10,
                        alignItems: "center",
                        fontSize: 20,
                        fontWeight: "bold",
                        right: 30,
                      }}
                    >
                      Category
                    </ThemedText>
                  </View>

                  <Picker
                    selectedValue={category}
                    enabled={!isEditing}
                    itemStyle={{ height: 120 }}
                    onValueChange={(itemValue) => setCategory(itemValue)}
                  >
                    <Picker.Item label="T-Shirt" value="T-Shirt" />
                    <Picker.Item label="Hoodie" value="Hoodie" />
                    <Picker.Item label="Jacket" value="Jacket" />
                    <Picker.Item label="Pants" value="Pants" />
                    <Picker.Item label="Accessories" value="Accessories" />
                  </Picker>
                </ThemedView>
              </View>
            </Modal>
          </View>
        </View>
      ) : (
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
      )}
    </>
  );
}
