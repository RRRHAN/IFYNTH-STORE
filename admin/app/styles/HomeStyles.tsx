import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");
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

export default styles;
