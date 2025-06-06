import React, { useState, useEffect, useMemo } from "react"; // <-- Tambahkan useMemo
import {
  FlatList,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

// Gluestack UI components
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

// Icons from Lucide
import { ArrowLeft, Send } from "lucide-react-native";
import { useColorScheme } from "nativewind";

// Imports dari project Anda
import { addMessage, fetchMessage } from "@/src/api/message";
import { Message } from "@/src/types/message";
import { BASE_URL } from "@/src/api/constants";
import { generateVideoThumbnailJS } from "@/hooks/helpers/ThumbnailProcessor";
import * as VideoThumbnails from "expo-video-thumbnails";

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const stableItem = useMemo(() => {
    try {
      return params.item ? JSON.parse(params.item as string) : null;
    } catch (e) {
      console.error("Failed to parse item from params:", e);
      return null;
    }
  }, [params.item]);

  const [selectedItem, setSelectedItem] = useState(stableItem);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [thumbnailUrls, setThumbnailUrls] = useState<{ [key: string]: string }>(
    {}
  );
  const { colorScheme } = useColorScheme();

  // Helper untuk warna teks berdasarkan tema
  const getDynamicTextColor = () => colorScheme === "dark" ? "text-white" : "text-gray-900";
  const getSubduedTextColor = () => colorScheme === "dark" ? "text-gray-300" : "text-gray-600";
  const getMainBgClass = () => colorScheme === "dark" ? "bg-neutral-900" : "bg-white";
  const getHeaderBgClass = () => colorScheme === "dark" ? "bg-neutral-800" : "bg-gray-100";
  const getBorderColorClass = () => colorScheme === "dark" ? "border-neutral-700" : "border-gray-200";

  const handleBack = () => {
    router.replace("/user_advertisement");
  };

  const handleSend = async () => {
    if (text.trim() === "") return;

    try {
      await addMessage({
        ProductID: selectedItem?.ID.toString() || "",
        Message: text,
        Role: "ADMIN",
      });

      setText("");

      const updatedMessages = await fetchMessage(selectedItem.ID);
      setMessages(prevMessages => {
        if (JSON.stringify(updatedMessages) !== JSON.stringify(prevMessages)) {
          return updatedMessages;
        }
        return prevMessages;
      });

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
          setMessages(prevMessages => {
            if (JSON.stringify(data) !== JSON.stringify(prevMessages)) {
              return data;
            }
            return prevMessages;
          });
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      }
    };

    if (selectedItem && selectedItem.ID) {
      loadMessages();
      interval = setInterval(() => {
        loadMessages();
      }, 3000);
    }

    // Cleanup interval
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [selectedItem]);

  useEffect(() => {
    async function generateThumbnails() {
      if (stableItem && stableItem.Files && stableItem.Files.length > 0) {
        const fileUrl = stableItem.Files[0].URL;
        const mediaUrl = `${BASE_URL}/api${fileUrl}`;

        if (/\.(mp4|webm|ogg)$/i.test(fileUrl)) {
          try {
            let uri: string;
            if (Platform.OS === "web") {
              uri = await generateVideoThumbnailJS(mediaUrl);
            } else {
              const result = await VideoThumbnails.getThumbnailAsync(mediaUrl, { time: 1000 });
              uri = result.uri;
            }
            setThumbnailUrls((prev) => ({ ...prev, [stableItem.ID]: uri }));
          } catch (error) {
            console.warn("Failed to generate thumbnail for video", error);
            setThumbnailUrls((prev) => ({
              ...prev,
              [stableItem.ID]: `${BASE_URL}/api${fileUrl}`,
            }));
          }
        } else {
          setThumbnailUrls((prev) => ({
            ...prev,
            [stableItem.ID]: `${BASE_URL}/api${fileUrl}`,
          }));
        }
      } else if (stableItem && stableItem.ID) {
          setThumbnailUrls((prev) => ({
            ...prev,
            [stableItem.ID]: "https://img.lovepik.com/free-png/20210919/lovepik-question-element-png-image_401016497_wh1200.png",
          }));
      }
    }
    // Panggil generateThumbnails hanya jika 'stableItem' berubah dan valid
    if (stableItem && stableItem.ID) {
      generateThumbnails();
    }
  }, [stableItem]); // <-- Dependency array yang tepat: 'stableItem'

  const renderItem = ({ item: messageItem }: { item: Message }) => {
    const isMe = messageItem.Role === "ADMIN";
    const avatarUrlMe = "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp";
    const avatarUrlOther = "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp";

    return (
      <HStack
        className={`my-2 px-3 ${isMe ? "justify-end" : "justify-start"} items-end`}
      >
        {!isMe && (
          <Image
            source={{ uri: avatarUrlOther }}
            className="w-8 h-8 rounded-full mr-2"
            alt="User Avatar"
          />
        )}
        <Box
          className={`
            max-w-[70%] p-3 rounded-lg
            ${isMe ? `bg-blue-500 rounded-br-none` : `bg-gray-200 rounded-bl-none`}
            ${isMe ? "text-white" : getDynamicTextColor()}
            ${isMe ? "" : `${colorScheme === 'dark' ? 'dark:bg-neutral-700' : ''}`}
          `}
        >
          <Text className={`${isMe ? 'text-white' : getDynamicTextColor()}`}>
            {messageItem.Message}
          </Text>
          <Text className={`text-xs mt-1 ${isMe ? 'text-blue-200' : getSubduedTextColor()}`}>
            {new Date(messageItem.CreatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </Box>
        {isMe && (
          <Image
            source={{ uri: avatarUrlMe }}
            className="w-8 h-8 rounded-full ml-2"
            alt="Admin Avatar"
          />
        )}
      </HStack>
    );
  };

  // Gunakan stableItem di sini
  const thumbnailUrl =
    (stableItem && thumbnailUrls[stableItem.ID]) ||
    "https://img.lovepik.com/free-png/20210919/lovepik-question-element-png-image_401016497_wh1200.png";

  return (
    <Box className={`flex-1 ${getMainBgClass()}`}>
      {/* Header */}
      <HStack className={`items-center p-4 border-b ${getBorderColorClass()} ${getHeaderBgClass()}`}>
        <Button variant="link" onPress={handleBack} className="p-0">
          <ButtonIcon as={ArrowLeft} size="lg" className={`${getSubduedTextColor()}`} />
        </Button>
        <Heading size="lg" className={`flex-1 text-center mr-10 ${getDynamicTextColor()}`}>
          Chat
        </Heading>
      </HStack>

      {/* Fixed Item Container (Product Info) */}
      {selectedItem && ( // Gunakan selectedItem yang sudah stabil
        <Box className={`p-3 border-b ${getBorderColorClass()} ${getHeaderBgClass()}`}>
          <HStack className="items-center gap-3">
            <Image
              source={{ uri: thumbnailUrl }}
              className="w-16 h-16 rounded-md object-cover"
              alt="Product Thumbnail"
            />
            <VStack className="flex-1">
              <Text className={`font-semibold text-base ${getDynamicTextColor()}`}>{selectedItem.Name}</Text>
              <Text className={`text-sm ${getSubduedTextColor()}`}>Rp. {selectedItem.Price.toLocaleString()}</Text>
            </VStack>
          </HStack>
        </Box>
      )}

      {/* Chat Messages */}
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(chat) => chat.ID.toString()}
        inverted
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 10 : 80 }}
        className="flex-1"
      />

      {/* Message Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        className={`border-t ${getBorderColorClass()} ${getHeaderBgClass()}`}
      >
        <HStack className="p-3 items-center">
          <Input
            variant="outline"
            size="md"
            className={`flex-1 mr-2 ${getBorderColorClass()} ${getMainBgClass()}`}
          >
            <InputField
              placeholder="Type a message"
              value={text}
              onChangeText={setText}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              className={`${getDynamicTextColor()}`}
            />
          </Input>
          <Button onPress={handleSend} className="bg-blue-500 rounded-full w-10 h-10 justify-center items-center">
            <ButtonIcon as={Send} size="md" className="text-white" />
          </Button>
        </HStack>
      </KeyboardAvoidingView>
    </Box>
  );
}