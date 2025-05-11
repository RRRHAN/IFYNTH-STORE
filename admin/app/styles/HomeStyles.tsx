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
    textAlign: "center",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cell: {
    flex: 1,
    fontSize: 16,
    textAlign: "center",
    borderRightWidth: 2,
    borderRightColor: "#ccc",
  },
  headerText: {
    fontWeight: "bold",
  },

  overlayContent: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0)",
    paddingTop: 130,
    paddingHorizontal: 20,
  },

  table: {
    borderWidth: 1,
    width: 400,
  },

  tableTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    paddingBottom: 20,
  },

  rowLastCell: {
    flex: 1,
    fontSize: 16,
    textAlign: "center",
    borderRightWidth: 0,
  },

  tableMarginBottom: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
    borderRadius: 10,
    elevation: 2,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
  },
});

export default styles;
