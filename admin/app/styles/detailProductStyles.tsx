import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  imageDetailRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    width: '100%',
    padding: 16,
    gap: 1,
  },
  imageSection: {
    flex: 1,
    maxWidth: width * 0.45,
    alignItems: "center",
  },  
  mainImage: {
    width: "100%",
    height: height * 0.4,
    resizeMode: "contain",
    borderRadius: 16,
  },
  thumbnailContainer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  thumbnail: {
    width: 70,
    height: 70,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  activeThumbnail: {
    borderColor: "#4F46E5",
  },
  details: {
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 4,
    textAlign: "center",
    fontSize: 18,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    justifyContent: "center",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    marginTop: 20,
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
    width: "80%",
  },
  stockTable: {
    width: "100%",
    marginTop: 12,
  },
  stockHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  stockHeaderText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  stockRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  stockText: {
    fontSize: 16,
  },
  
});

export default styles;
