import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    scrollContainer: {
      margin: 20,
      borderRadius: 10,
      padding: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
    },
    subHeader: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
    },
    section: {
      marginBottom: 15,
    },
    separator: {
      borderBottomColor: "#444",
      borderBottomWidth: 1,
      marginVertical: 10,
    },
    tableContainer: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
    },
    tableRow: {
      flexDirection: "row",
      paddingVertical: 8,
      paddingHorizontal: 5,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    },
    tableHeader: {
      flex: 1,
      fontWeight: "bold",
      textAlign: "center",
    },
    tableCell: {
      flex: 1,
      textAlign: "center",
    },
    paymentProofImage: {
      width: 300,
      height: 200,
      resizeMode: "contain",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#ddd",
      marginTop: 10,
    },
    closeButtonContainer: {
      marginTop: 20,
      alignItems: "center",
    },
    fullImageOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.95)",
      justifyContent: "center",
      alignItems: "center",
    },
    fullImage: {
      width: "90%",
      height: "80%",
      resizeMode: "contain",
      marginBottom: 20,
    },
  });

  export default styles;