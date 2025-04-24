import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 15,
      textAlign: "center",
    },
    input: {
      height: 45,
      marginVertical: 10,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderRadius: 5,
    },
    button: {
      height: 45,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 5,
      marginVertical: 10,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    sizeText: {
      fontSize: 16,
      marginRight: 10,
    },
    pickerContainer: {
      flexDirection: 'row', // Arrange pickers side by side
      justifyContent: 'space-between', // Space them equally
      marginBottom: 20,
    },
    pickerWrapper: {
      width: '48%', // Ensure both pickers share the space equally
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 5,
    },
    picker: {
      height: 50,
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
    },
    sizeContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    sizeWrapper: {
      width: '23%',
      marginBottom: 10,
    },
    imageContainer: {
      position: 'relative',
      marginBottom: 10,
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 8,
    },
    removeButton: {
      position: 'absolute',
      top: 0,
      right: 0,
      padding: 5,
    },
  
  });

  export default styles;