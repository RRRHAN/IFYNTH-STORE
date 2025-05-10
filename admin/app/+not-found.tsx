import { View, Button, Alert, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function NotFoundScreen() {
  const router = useRouter();

  const handleClearStorage = async () => {
    await AsyncStorage.clear();
    Alert.alert("Cleared", "AsyncStorage has been cleared.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>404 - Page Not Found</Text>
      <Button title="Go Back Home" onPress={() => router.replace("/login")} />
      <View style={{ height: 20 }} />
      <Button title="🧹 Clear AsyncStorage" onPress={handleClearStorage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    fontWeight: "bold",
  },
});
