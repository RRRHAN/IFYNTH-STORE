import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      paddingTop: Platform.OS === "android" ? 50 : 0,
    },
    logoContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    logo: {
      width: 300,
      height: 60,
      marginRight: 8,
    },
    logoText: {
      fontSize: 24,
      fontWeight: "600",
    },
    card: {
      borderRadius: 12,
      padding: 20,
      width: "100%",
      maxWidth: 400,
      elevation: 4,
    },
    heading: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      marginBottom: 4,
    },
    input: {
      height: 44,
      borderColor: "#d1d5db",
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 16,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    checkboxLabel: {
      fontSize: 14,
    },
    link: {
      fontWeight: "500",
    },
    button: {
      backgroundColor: "#2563eb",
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    buttonText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "600",
    },
    signup: {
      marginTop: 16,
      textAlign: "center",
      fontSize: 14,
    },
      checkboxButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  checkboxIcon: {
    marginRight: 8,
  },
  });

  export default styles;