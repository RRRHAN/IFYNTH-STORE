import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
// import { Ionicons } from "@expo/vector-icons"; // Hapus impor Ionicons
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Impor MaterialCommunityIcons
import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedText } from "@/components/ThemedText";
import styles from "./styles/messageStyles";
import { addMessage, fetchMessage } from "@/src/api/message";
import { Message } from "@/src/types/message";
import { BASE_URL } from "@/src/api/constants";
import { generateVideoThumbnailJS } from "@/hooks/helpers/ThumbnailProcessor";
import * as VideoThumbnails from "expo-video-thumbnails";

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const item = params.item ? JSON.parse(params.item as string) : null;
  const [selectedItem, setSelectedItem] = useState(item);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  // timeOnly ini tidak digunakan, bisa dihapus jika tidak ada rencana menggunakannya.
  // const timeOnly = new Date(item.CreatedAt).toLocaleTimeString([], {
  //   hour: "2-digit",
  //   minute: "2-digit",
  // });
  const [thumbnailUrls, setThumbnailUrls] = useState<{ [key: string]: string }>(
    {}
  );

  const handleBack = () => {
    router.replace("/user_advertisement");
  };

  const handleSend = async () => {
    if (text.trim() === "") return;

    try {
      await addMessage({
        ProductID: selectedItem?.ID.toString() || "",
        Message: text,
        Role: "ADMIN", // Pastikan Role ini benar untuk pengirim (ADMIN)
      });

      // Clear input field
      setText("");

      // Fetch updated messages from backend
      // Lebih baik perbarui state secara optimis jika API Anda mengembalikan pesan yang baru ditambahkan
      // atau setidaknya tambahkan pesan baru ke array messages secara manual.
      // fetch ulang semua pesan bisa memakan waktu dan resource.
      const updatedMessages = await fetchMessage(selectedItem.ID);
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const loadMessages = async () => {
      if (selectedItem && selectedItem.ID) {
        try {
          const data = await fetchMessage(selectedItem.ID);
          // Hanya update jika ada perubahan data
          if (JSON.stringify(data) !== JSON.stringify(messages)) {
            setMessages(data);
          }
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      }
    };

    loadMessages(); // Muat pesan saat komponen pertama kali di-mount

    interval = setInterval(() => {
      loadMessages(); // Muat ulang setiap 3 detik
    }, 3000);

    return () => clearInterval(interval); // Bersihkan interval saat komponen dilepas
  }, [selectedItem, messages]); // Tambahkan `messages` ke dependency array agar interval re-render jika messages berubah dari luar

  useEffect(() => {
    async function generateThumbnails() {
      if (item && item.Files && item.Files.length > 0) { // Tambahkan cek `item`
        const fileUrl = item.Files[0].URL;
        if (/\.(mp4|webm|ogg)$/i.test(fileUrl)) {
          try {
            const mediaUrl = `${BASE_URL}/api${fileUrl}`;
            if (Platform.OS === "web") {
              const url = await generateVideoThumbnailJS(mediaUrl);
              setThumbnailUrls((prev) => ({ ...prev, [item.ID]: url }));
            } else {
              const { uri } = await VideoThumbnails.getThumbnailAsync(
                mediaUrl,
                { time: 1000 }
              );
              setThumbnailUrls((prev) => ({
                ...prev,
                [item.ID]: uri,
              }));
            }
          } catch (error) {
            console.warn("Failed to generate thumbnail for video", error);
            setThumbnailUrls((prev) => ({
              ...prev,
              [item.ID]: `${BASE_URL}/api${fileUrl}`,
            }));
          }
        } else {
          setThumbnailUrls((prev) => ({
            ...prev,
            [item.ID]: `${BASE_URL}/api${fileUrl}`,
          }));
        }
      } else if (item && item.ID) { // Jika tidak ada Files, pastikan tetap ada thumbnail default
          setThumbnailUrls((prev) => ({
            ...prev,
            [item.ID]: "https://img.lovepik.com/free-png/20210919/lovepik-question-element-png-image_401016497_wh1200.png",
          }));
      }
    }
    // Hanya panggil jika item sudah ada
    if (item) {
      generateThumbnails();
    }
  }, [item]); // Depend pada item

  const renderItem = ({ item }: { item: Message }) => {
    // console.log("Rendered Item:", item); // Log ini bisa dihapus di produksi
    const isMe = item.Role === "ADMIN"; // Sesuaikan jika role admin punya nama lain

    return (
      <ThemedView
        style={[styles.messageContainer, !isMe && styles.messageContainerRight]}
      >
        {isMe && (
          <Image
            source={{
              uri: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp", // Avatar admin
            }}
            style={styles.avatarLeft}
          />
        )}
        <ThemedView
          style={[
            styles.bubble,
            !isMe ? styles.bubbleRight : styles.bubbleLeft,
          ]}
        >
          <Text>{item.Message}</Text>
          <Text style={!isMe ? styles.timeLeft : styles.timeRight}>
            {new Date(item.CreatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </ThemedView>
        {!isMe && (
          <Image
            source={{ uri: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp" }}
            style={styles.avatarRight}
          />
        )}
      </ThemedView>
    );
  };

  // Pastikan `thumbnailUrl` dihitung setelah `item` tersedia
  const thumbnailUrl =
    (item && thumbnailUrls[item.ID]) ||
    "https://img.lovepik.com/free-png/20210919/lovepik-question-element-png-image_401016497_wh1200.png";

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          {/* Ganti Ionicons dengan MaterialCommunityIcons */}
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Chat</ThemedText>
      </View>
      {/* Chat - Scrollable */}
      <>
        {/* Menampilkan data produk di atas */}
        {selectedItem && (
          <View style={styles.fixedItemContainer}>
            <View style={styles.itemContent}>
              <Image
                source={{
                  uri: thumbnailUrl,
                }}
                style={styles.image}
              />
              <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>{selectedItem.Name}</Text>
                <Text>Rp.{selectedItem.Price}</Text>
              </View>
            </View>
          </View>
        )}
        {/* Menampilkan pesan chat */}
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(chat) => chat.ID.toString()}
          inverted
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      </>

      {/* Message Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ThemedView style={styles.inputContainer}>
          <ThemedTextInput
            style={styles.textInput}
            placeholder="Type a message"
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <MaterialCommunityIcons name="send" size={20} color="#A9A9A9" />
          </TouchableOpacity>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}