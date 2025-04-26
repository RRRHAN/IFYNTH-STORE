import React from "react";
import {
  ImageBackground,
} from "react-native";
import styles from "../styles/HomeStyles";
import { ThemedView } from "@/components/ThemedView";


export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      {/* Background */}
      <ImageBackground
        source={require("@/assets/images/banner/banner-bg.svg")}
        style={styles.background}
        resizeMode="cover"
      />
    </ThemedView>
  );
}
