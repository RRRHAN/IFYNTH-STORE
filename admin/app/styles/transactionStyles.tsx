import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  image: {
    width: 80,
    height: 80,
  },
  header: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderWidth: 1,
  },
  cell: {
    fontSize: 12,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  imageCell: {
    fontSize: 12,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    paddingBottom: 20,
  },
  paginationText: {
    marginHorizontal: 15,
    fontSize: 16,
  },
});

export default styles;
