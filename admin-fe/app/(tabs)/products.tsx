import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  FlatList,
  Dimensions,
} from "react-native";

const { height } = Dimensions.get("window");

const productData = [
  { id: "1", name: "Product A", price: "$10", stock: 20 },
  { id: "2", name: "Product B", price: "$15", stock: 10 },
  { id: "3", name: "Product C", price: "$8", stock: 5 },
];

export default function ProductsScreen() {
  return (
    <View style={styles.container}>
      {/* Background */}
      <ImageBackground
        source={require("@/assets/images/banner/banner-bg.svg")}
        style={styles.background}
        resizeMode="cover"
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        <Text style={styles.title}>PRODUCT MANAGEMENT</Text>

        {/* Table Header */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerText]}>Name</Text>
          <Text style={[styles.cell, styles.headerText]}>Price</Text>
          <Text style={[styles.cell, styles.headerText]}>Stock</Text>
        </View>

        {/* Table Rows */}
        <FlatList
          data={productData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.cell}>{item.name}</Text>
              <Text style={styles.cell}>{item.price}</Text>
              <Text style={styles.cell}>{item.stock}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  background: {
    position: "absolute",
    width: "100%",
    height: height,
    top: -70,
    zIndex: -1,
  },
  overlay: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#ffffffcc",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  headerRow: {
    backgroundColor: "#333",
  },
  cell: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    textAlign: "center",
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
