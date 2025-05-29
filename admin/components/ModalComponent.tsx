import React from "react";
import { useState } from "react";
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "./ThemedText";

interface ModalProps {
  visible: boolean;
  hideModal: () => void;
  message: string;
}

const ModalComponent: React.FC<ModalProps> = ({
  visible,
  hideModal,
  message,
}) => {
  const colorScheme = useColorScheme();

  const modalBackgroundColor = colorScheme === "dark" ? "#333333" : "#ffffff";
  const textColor = colorScheme === "dark" ? "#ffffff" : "#333333";
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={hideModal}
    >
      <View
        style={[
          styles.modalOverlay,
          {
            backgroundColor:
              colorScheme === "dark"
                ? "rgba(0, 0, 0, 0.7)"
                : "rgba(0, 0, 0, 0.3)",
          },
        ]}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: modalBackgroundColor },
          ]}
        >
          <Text style={[styles.modalText, { color: textColor }]}>
            {message}
          </Text>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: isPressed ? "#1e40af" : "#2563eb",
              },
            ]}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            onPress={hideModal}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    marginBottom: 20,
    fontSize: 16,
  },
    button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ModalComponent;
