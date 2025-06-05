import { BASE_URL } from "@/src/api/constants";
import { Product, StockDetail } from "@/src/types/product";
import React, { useEffect, useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  TouchableOpacity
} from "react-native";

// Gluestack UI components
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useColorScheme } from "nativewind";

type ProductDetailModalProps = {
  product: Product | null;
};

// Dimensions.get('window') is primarily for initial render.
// Tailwind's responsive prefixes handle actual responsive behavior.
// const { width: screenWidth } = Dimensions.get("window"); // Hapus ini jika tidak digunakan

const DEFAULT_IMAGE_URL = "https://img.lovepik.com/free-png/20210919/lovepik-question-element-png-image_401016497_wh1200.png";

export default function ProductDetailModal({
  product,
}: ProductDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState<string>(DEFAULT_IMAGE_URL); // Inisialisasi dengan string default
  const { colorScheme } = useColorScheme();

  // Determine dark mode classes
  const textColorClass = colorScheme === "dark" ? "text-white" : "text-gray-900";
  const grayTextColorClass = colorScheme === "dark" ? "text-gray-300" : "text-gray-600";
  const borderColorClass = colorScheme === "dark" ? "border-gray-700" : "border-gray-200";
  const activeThumbnailBorderClass = colorScheme === "dark" ? "border-blue-500" : "border-blue-500";

  useEffect(() => {
    let imageUrl: string = DEFAULT_IMAGE_URL; // Mulai dengan default
    if (product?.ProductImages && product.ProductImages.length > 0) {
      const firstImage = product.ProductImages[0];
      // Pastikan URL adalah string dan tidak kosong
      if (typeof firstImage.URL === 'string' && firstImage.URL.trim() !== '') {
        imageUrl = `${BASE_URL}/api${firstImage.URL}`;
      }
    }
    setSelectedImage(imageUrl); // Set state hanya dengan string
  }, [product]);

  if (!product) return null;

  const thumbnails = useMemo(
    () => product.ProductImages?.map((img) => {
        // Pastikan URL thumbnail juga string yang valid
        if (typeof img.URL === 'string' && img.URL.trim() !== '') {
            return `${BASE_URL}/api${img.URL}`;
        }
        return DEFAULT_IMAGE_URL; // Fallback untuk thumbnail
    }) || [],
    [product.ProductImages]
  );

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: Platform.OS === "web" ? 100 : 150,
        width: "100%",
      }}
      className="flex-1"
    >
      <HStack className="flex-col md:flex-row p-2 md:p-4 items-start gap-2 md:gap-4">
        <VStack className="w-full md:flex-[2] items-center">
          <Image
            source={{ uri: selectedImage }}
            className="w-full h-auto max-h-[300px] md:h-full aspect-square object-contain rounded-lg border border-gray-300 dark:border-gray-700"
            alt={product.Name}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4 w-full"
            contentContainerStyle={{
              justifyContent: "center",
            }}
          >
            <HStack className="gap-2">
              {thumbnails.map((uri, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedImage(uri)}
                  className={`border-2 rounded-md overflow-hidden ${
                    selectedImage === uri ? activeThumbnailBorderClass : borderColorClass
                  }`}
                >
                  <Image
                    source={{ uri }}
                    className="w-20 h-20 object-cover"
                    alt={`Thumbnail ${index + 1}`}
                  />
                </TouchableOpacity>
              ))}
            </HStack>
          </ScrollView>
        </VStack>

        {/* Details Section: takes full width on small, 3/5 on md */}
        <VStack className="w-full md:flex-[3] mt-4 md:mt-0">
          <VStack className="mb-4">
            <Heading size="2xl" className={`mb-1 ${textColorClass}`}>
              {product.Name}
            </Heading>
            <Text size="md" className={`mb-1 ${grayTextColorClass}`}>
              {product.Category}
            </Text>
            <Text size="md" className={grayTextColorClass}>
              {product.Department === "IFY" ? "I Found You" : "No Time to Hell"}
            </Text>
          </VStack>

          <Box className="mb-4">
            <Text size="lg" className={`font-bold ${textColorClass} mb-1`}>
              Price : Rp {product.Price.toLocaleString()}
            </Text>
            <Text size="lg" className={`font-bold ${textColorClass}`}>
              Commodity Capital (Modal) : Rp
              {product.ProductCapital.CapitalPerItem.toLocaleString()}
            </Text>
          </Box>

          <VStack className={`border ${borderColorClass} rounded-lg overflow-hidden mb-4`}>
            <HStack className={`bg-gray-100 dark:bg-gray-800 p-3 border-b ${borderColorClass}`}>
              <Text size="md" className={`font-semibold flex-1 ${textColorClass}`}>Size</Text>
              <Text size="md" className={`font-semibold flex-1 text-right ${textColorClass}`}>Stock</Text>
            </HStack>
            {product.StockDetails.map((stock: StockDetail) => (
              <HStack key={stock.ID} className={`p-3 border-b ${borderColorClass}`}>
                <Text size="md" className={`flex-1 ${grayTextColorClass}`}>{stock.Size}</Text>
                <Text size="md" className={`flex-1 text-right ${grayTextColorClass}`}>{stock.Stock}</Text>
              </HStack>
            ))}
          </VStack>

          <Text size="md" className={grayTextColorClass}>
            {product.Description || "No description available."}
          </Text>
        </VStack>
      </HStack>
    </ScrollView>
  );
}