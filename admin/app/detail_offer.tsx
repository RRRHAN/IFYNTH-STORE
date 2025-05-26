import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { useEvent } from "expo";
import { ThemedText } from "@/components/ThemedText";
import styles from "./styles/detailProductStyles";
import { cusProduct } from "@/src/types/product";
import { BASE_URL } from "@/src/api/constants";
import { generateVideoThumbnailJS } from "@/hooks/helpers/ThumbnailProcessor";
import * as VideoThumbnails from "expo-video-thumbnails";
import { useVideoPlayer, VideoView } from "expo-video";

type OfferDetailModalProps = {
  product: cusProduct | null;
};

const { width } = Dimensions.get("window");

export default function OfferDetailModal({ product }: OfferDetailModalProps) {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [contentTotalHeight, setContentTotalHeight] = useState(0);
  const [thumbnailUrls, setThumbnailUrls] = useState<{ [key: string]: string }>(
    {}
  );
  const player = useVideoPlayer(selectedMedia, (player) => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const isVideo = (url: string) => {
    return /\.(mp4|webm|ogg)$/i.test(url);
  };

  useEffect(() => {
    if (!product?.Files) return;

    const processThumbnails = async () => {
      const newThumbnails: { [key: string]: string } = {};

      await Promise.all(
        product.Files.map(async (file) => {
          const url = `${BASE_URL}${file.URL}`;
          if (isVideo(url)) {
            try {
              if (Platform.OS === "web") {
                const thumbUrl = await generateVideoThumbnailJS(url);
                newThumbnails[file.ID] = thumbUrl;
              } else {
                const { uri } = await VideoThumbnails.getThumbnailAsync(url, {
                  time: 1000,
                });
                newThumbnails[file.ID] = uri;
              }
            } catch (error) {
              newThumbnails[file.ID] = url;
            }
          } else {
            newThumbnails[file.ID] = url;
          }
        })
      );

      setThumbnailUrls(newThumbnails);
    };

    processThumbnails();

    if (product?.Files && product.Files.length > 0) {
      setSelectedMedia(`${BASE_URL}${product.Files[0].URL}`);
    } else {
      setSelectedMedia("https://img.lovepik.com/free-png/20210919/lovepik-question-element-png-image_401016497_wh1200.png");
    }
  }, [product]);

  if (!product) return null;

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: Platform.OS === "web" ? 100 : 150,
        width: "100%",
      }}
      onContentSizeChange={(contentWidth, contentHeight) => {
        setContentTotalHeight(contentHeight);
      }}
    >
      <View style={[styles.imageDetailRow, { marginTop: 20}]}>
        <View style={styles.imageSection}>
          {isVideo(selectedMedia!) ? (
            <VideoView
              style={styles.mainImage}
              player={player}
              allowsFullscreen
              allowsPictureInPicture
            />
          ) : (
            <Image source={{ uri: selectedMedia! }} style={styles.mainImage} />
          )}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailContainer}
          >
            {product.Files?.map((file) => {
              const thumbUrl =
                thumbnailUrls[file.ID] || `${BASE_URL}${file.URL}`;
              return (
                <TouchableOpacity
                  key={file.ID}
                  onPress={() => setSelectedMedia(`${BASE_URL}${file.URL}`)}
                >
                  <Image
                    source={{ uri: thumbUrl }}
                    style={[
                      styles.thumbnail,
                      selectedMedia === `${BASE_URL}${file.URL}` &&
                        styles.activeThumbnail,
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        <View
          style={[
            styles.details,
            {
              position: "relative",
              top: Platform.OS === "web" ? 0 : contentTotalHeight - 1050,
            },
          ]}
        >
          <View style={styles.header}>
            <View>
              <ThemedText style={styles.title}>
                Product Name : {product.Name}
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Customer Name : {product.customer_name}
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Status : {product.Status}
              </ThemedText>
            </View>
          </View>

          <View style={styles.priceRow}>
            <ThemedText style={styles.price}>
              Price : Rp {product.Price.toLocaleString()}
            </ThemedText>
          </View>
          <ThemedText style={styles.description}>
            {product.Description || "No description available."}
          </ThemedText>
        </View>
      </View>
    </ScrollView>
  );
}
