import { StyleSheet, Platform, Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "bold",
  },
  messageContainer: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    marginVertical: 5,
  },
  messageContainerRight: {
    flexDirection: "row-reverse",
    justifyContent: "flex-end",
  },
  avatarLeft: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  avatarRight: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  bubble: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 10,
  },
  bubbleLeft: {
    backgroundColor: "#f1f1f1",
    borderTopLeftRadius: 0,
  },
  bubbleRight: {
    backgroundColor: "#ddd",
    borderTopRightRadius: 0,
  },
  timeRight: {
    textAlign: "right",
    color: "#aaa",
    fontSize: 12,
    marginTop: 5,
  },
  timeLeft: {
    textAlign: "left",
    color: "#999",
    fontSize: 12,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  fixedItemContainer: {
    position: "absolute",
    top: Platform.OS === "web" ? 60 : 100,
    left: screenWidth > 900 ? "53%" : "70%",
    transform: [{ translateX: -200 }],
    backgroundColor: "#fff",
    padding: 10,
    zIndex: 10,
    width: screenWidth > 900 ? 350 : 250,
    borderRadius: 10,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
  },
  itemTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginTop: 10,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 10,
    justifyContent: "center",
  },
});

export default styles;
