import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  // === Layout Containers ===
  container: {
    flex: 1,
    position: "relative",
  },
  background: {
    flex: 1,
    position: "absolute",
    top: -50,
    width: width,
    height: height,
    zIndex: -1,
  },
  overlayContent: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 130,
    backgroundColor: "rgba(255, 255, 255, 0)",
  },

  // === Section Layouts ===
  sectionRow: {
    marginBottom: 24,
    backgroundColor: "rgba(255, 255, 255, 0)",
  },
    totalTablesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
    loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

});

export default styles;
