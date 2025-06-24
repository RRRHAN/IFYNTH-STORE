import { useGlobalModal } from "@/context/ModalContext";
import React, { useEffect, useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  Pressable,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon, SearchIcon, TrashIcon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { BASE_URL } from "@/src/api/constants";
import {
  deleteProduct,
  fetchProducts,
  fetchProductsByImage,
} from "@/src/api/products";
import { Product } from "@/src/types/product";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Eye, PlusIcon, SquarePen, Trash, X } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import ProductDetailModal from "../detail_product";
import * as ImagePicker from "expo-image-picker";

const MOBILE_BREAKPOINT = 768;

const ProductTable = () => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const { width: screenWidth } = useWindowDimensions();
  const [showModalDelete, setShowModalDelete] = React.useState(false);
  const { showModal } = useGlobalModal();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(
    null
  );
  const [showProductDetailModal, setShowProductDetailModal] = useState(false);
  const { keyword } = useLocalSearchParams();
  const initialKeyword = Array.isArray(keyword) ? keyword[0] : keyword ?? "";
  const [searchValue, setSearchValue] = useState(initialKeyword);

  const handleDeleteProduct = (productId: string) => {
    setProductIdToDelete(productId);
    setShowModalDelete(true);
  };
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetailModal(true);
  };
  const isMobileLayout = screenWidth < MOBILE_BREAKPOINT;

  const getData = async () => {
    try {
      const data = await fetchProducts(initialKeyword);
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setErrorMessage("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const CameraIconWithTooltip = () => {
    return Platform.OS === "web" ? (
      <div title="Search product by similar image">
        <Pressable onPress={openImagePicker} style={{ cursor: "pointer" }}>
          <FontAwesome
            name="camera"
            size={20}
            color="white"
            style={{ margin: 24 }}
          />
        </Pressable>
      </div>
    ) : (
      <Pressable onPress={openImagePicker} style={{ cursor: "pointer" }}>
        <FontAwesome
          name="camera"
          size={20}
          color="white"
          style={{ margin: 24 }}
        />
      </Pressable>
    );
  };

  const onSubmit = () => {
    router.push({
      pathname: "/products",
      params: { keyword: searchValue },
    });
  };

  const openImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access media library is required!"
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!pickerResult.canceled) {
      try {
        const localUri = pickerResult.assets[0].uri;
        const filename = localUri.split("/").pop() ?? "image.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1].toLowerCase()}` : "image/jpeg";

        const formData = new FormData();

        if (Platform.OS === "web") {
          const response = await fetch(localUri);
          const blob = await response.blob();
          formData.append("image", blob, filename);
        } else {
          const uri =
            Platform.OS === "android" && !localUri.startsWith("file://")
              ? "file://" + localUri
              : localUri;

          formData.append("image", {
            uri,
            name: filename,
            type,
          } as any);
        }

        const data = await fetchProductsByImage(formData);

        // Call your success function
        setProducts(data);
        setSearchValue("");
      } catch (err) {
        Alert.alert("Upload error", `${err}`);
      }
    }
  };

  useEffect(() => {
    getData();
    setSearchValue(initialKeyword);
  }, [initialKeyword]);

  const colWidths = useMemo(() => {
    if (isMobileLayout) {
      return {
        product: screenWidth * 0.25,
        name: screenWidth * 0.5,
        actions: screenWidth * 0.25,
      };
    } else {
      return {
        product: screenWidth * 0.15,
        name: screenWidth * 0.25,
        stock: screenWidth * 0.1,
        price: screenWidth * 0.18,
        department: screenWidth * 0.22,
        actions: screenWidth * 0.1,
      };
    }
  }, [screenWidth, isMobileLayout]);

  const mainBackgroundClass =
    colorScheme === "dark" ? "bg-neutral-900" : "bg-white";
  const tableHeaderBgClass =
    colorScheme === "dark" ? "bg-neutral-800" : "bg-gray-100";
  const tableHeaderTextClass =
    colorScheme === "dark" ? "text-neutral-200" : "text-slate-600";
  const tableRowBgClass =
    colorScheme === "dark" ? "bg-neutral-700" : "bg-white";
  const tableRowHoverBgClass =
    colorScheme === "dark" ? "hover:bg-neutral-600" : "hover:bg-slate-50";

  const handleDelete = async (productId: string) => {
    try {
      const res = await deleteProduct(productId);
      showModal({
        title: "Delete Product Success!",
        message: "You have successfully deleted product.",
        type: "success",
        autoClose: true,
        duration: 1500,
      });
      getData();
    } catch (err: any) {
      showModal({
        title: "Delete Product Failed!",
        message: "Something went wrong.",
        type: "error",
        autoClose: true,
        duration: 1500,
      });
    }
  };

  return (
    <Box
      className={`flex-1 p-4 ${mainBackgroundClass}`}
      style={{ top: Platform.OS === "web" ? 0 : 20 }}
    >
      <HStack className="w-full justify-between items-center mb-6 mt-2 px-3">
        <HStack className="items-center">
          <Button
            size="md"
            variant="solid"
            action="primary"
            className="mr-3 px-3 py-2 rounded-md"
            onPress={() => router.replace("/add_product")}
          >
            <ButtonIcon
              as={PlusIcon}
              className="w-5 h-5 text-white dark:text-black"
            />
          </Button>
          <VStack>
            <Text className="text-2xl font-bold text-slate-800 dark:text-white">
              List Products
            </Text>
          </VStack>
        </HStack>
        <Box>{CameraIconWithTooltip()}</Box>
        <Box className="flex-1 max-w-sm ml-4">
          <Input
            variant="outline"
            size="md"
            className="w-full h-10 px-3 py-2 border border-slate-300 rounded-lg focus:border-blue-500 hover:border-slate-400 shadow-sm"
          >
            <InputField
              value={searchValue}
              onChangeText={setSearchValue}
              placeholder="Search for product..."
              className="text-slate-700 text-sm placeholder:text-slate-400 dark:text-neutral-200 dark:placeholder:text-neutral-400"
              onSubmitEditing={onSubmit}
              returnKeyType="search"
            />
            <InputSlot className="pr-2">
              <Button variant="link" className="p-0">
                <ButtonIcon
                  as={SearchIcon}
                  className="w-5 h-5 text-slate-500 dark:text-neutral-400"
                />
              </Button>
            </InputSlot>
          </Input>
        </Box>
      </HStack>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: Platform.OS === "web" ? 100 : 150,
        }}
      >
        <Box
          className={`relative flex flex-col w-full h-full overflow-hidden text-gray-700 ${mainBackgroundClass} rounded-lg shadow-md`}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              <HStack
                className={`border-b border-slate-300 py-3 ${tableHeaderBgClass}`}
              >
                <View
                  style={[
                    styles.columnHeaderCentered,
                    { width: colWidths.product },
                  ]}
                >
                  <Text
                    className={`text-xs font-semibold leading-none uppercase ${tableHeaderTextClass}`}
                  >
                    Product
                  </Text>
                </View>
                <View
                  style={[
                    styles.columnHeaderCentered,
                    { width: colWidths.name },
                  ]}
                >
                  <Text
                    className={`text-xs font-semibold leading-none uppercase ${tableHeaderTextClass}`}
                  >
                    Name
                  </Text>
                </View>
                {!isMobileLayout && (
                  <>
                    <View
                      style={[
                        styles.columnHeaderCentered,
                        { width: colWidths.stock },
                      ]}
                    >
                      <Text
                        className={`text-xs font-semibold leading-none uppercase ${tableHeaderTextClass}`}
                      >
                        Stock
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.columnHeaderCentered,
                        { width: colWidths.price },
                      ]}
                    >
                      <Text
                        className={`text-xs font-semibold leading-none uppercase ${tableHeaderTextClass}`}
                      >
                        Price
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.columnHeaderCentered,
                        { width: colWidths.department },
                      ]}
                    >
                      <Text
                        className={`text-xs font-semibold leading-none uppercase ${tableHeaderTextClass}`}
                      >
                        Department
                      </Text>
                    </View>
                  </>
                )}
                <View
                  style={[
                    styles.columnHeaderCentered,
                    { width: colWidths.actions },
                  ]}
                >
                  <Text
                    className={`text-xs font-semibold leading-none uppercase ${tableHeaderTextClass}`}
                  ></Text>
                </View>
              </HStack>
              {loading ? (
                <Box className="py-8 items-center justify-center">
                  <Text className="text-slate-500 dark:text-neutral-400 text-base">
                    Loading products...
                  </Text>
                </Box>
              ) : errorMessage ? (
                <Box className="py-8 items-center justify-center">
                  <Text className="text-red-500 text-base">{errorMessage}</Text>
                </Box>
              ) : products.length === 0 ? (
                <Box className="py-8 items-center justify-center">
                  <Text className="text-slate-500 dark:text-neutral-400 text-base">
                    No products found.
                  </Text>
                </Box>
              ) : (
                // Product List
                products.map((product, index) => (
                  <HStack
                    key={product.ID}
                    className={`border-b border-slate-200 py-3 items-center ${tableRowBgClass} ${tableRowHoverBgClass}`}
                  >
                    <View
                      style={[styles.columnData, { width: colWidths.product }]}
                    >
                      <Image
                        source={{
                          uri:
                            product.ProductImages &&
                            product.ProductImages.length > 0
                              ? `${BASE_URL}/api${product.ProductImages[0].URL}`
                              : "https://img.lovepik.com/free-png/20210919/lovepik-question-element-png-image_401016497_wh1200.png",
                        }}
                        alt={product.Name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </View>
                    <View
                      style={[styles.columnData, { width: colWidths.name }]}
                    >
                      <Text className="font-medium text-sm text-slate-800 dark:text-white">
                        {product.Name}
                      </Text>
                    </View>
                    {!isMobileLayout && (
                      <>
                        <View
                          style={[
                            styles.columnData,
                            { width: colWidths.stock },
                          ]}
                        >
                          <Text className="text-sm text-slate-600 dark:text-neutral-300">
                            {product.TotalStock}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.columnData,
                            { width: colWidths.price },
                          ]}
                        >
                          <Text className="text-sm text-slate-600 dark:text-neutral-300">
                            Rp {product.Price.toLocaleString()}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.columnData,
                            { width: colWidths.department },
                          ]}
                        >
                          <Text className="text-sm text-slate-600 dark:text-neutral-300">
                            {product.Department === "IFY"
                              ? "I Found You"
                              : "No Time to Hell"}
                          </Text>
                        </View>
                      </>
                    )}
                    <View
                      style={[styles.columnData, { width: colWidths.actions }]}
                    >
                      <Button
                        onPress={() => handleDeleteProduct(product.ID)}
                        variant="link"
                        className="p-0"
                      >
                        <ButtonIcon
                          as={Trash}
                          className="w-5 h-5 text-red-500"
                        />
                      </Button>
                      <Button
                        onPress={() => handleViewProduct(product)}
                        variant="link"
                        className="p-0"
                      >
                        <ButtonIcon
                          as={Eye}
                          className="w-5 h-5 text-blue-500"
                        />
                      </Button>
                      <Button
                        onPress={() => {
                          setSelectedProduct(product);
                          router.push({
                            pathname: "/edit_product",
                            params: { item: JSON.stringify(product) },
                          });
                        }}
                        variant="link"
                        className="p-0"
                      >
                        <ButtonIcon
                          as={SquarePen}
                          className="w-5 h-5 text-green-500"
                        />
                      </Button>
                    </View>
                  </HStack>
                ))
              )}
              <Modal
                isOpen={showModalDelete}
                onClose={() => {
                  setShowModalDelete(false);
                }}
              >
                <ModalBackdrop />
                <ModalContent className="max-w-[305px] items-center">
                  <ModalHeader>
                    <Box className="w-[56px] h-[56px] rounded-full bg-background-error items-center justify-center">
                      <Icon
                        as={TrashIcon}
                        className="stroke-error-600"
                        size="xl"
                      />
                    </Box>
                  </ModalHeader>
                  <ModalBody className="mt-0 mb-4">
                    <Heading
                      size="md"
                      className="text-typography-950 mb-2 text-center"
                    >
                      Delete Product
                    </Heading>
                    <Text size="sm" className="text-typography-500 text-center">
                      Are you sure you want to delete this product? This action
                      cannot be undone.
                    </Text>
                  </ModalBody>
                  <ModalFooter className="w-full">
                    <Button
                      variant="outline"
                      action="secondary"
                      size="sm"
                      onPress={() => {
                        setShowModalDelete(false);
                      }}
                      className="flex-grow"
                    >
                      <ButtonText>Cancel</ButtonText>
                    </Button>
                    <Button
                      onPress={async () => {
                        if (productIdToDelete) {
                          await handleDelete(productIdToDelete);
                        }
                        setShowModalDelete(false);
                      }}
                      size="sm"
                      className="flex-grow"
                    >
                      <ButtonText>Delete</ButtonText>
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              <Modal
                isOpen={showProductDetailModal}
                onClose={() => {
                  setShowProductDetailModal(false);
                  setSelectedProduct(null);
                }}
                size="lg"
              >
                <ModalBackdrop />
                <ModalContent className="max-w-[800px] max-h-[90%] w-full bg-white dark:bg-neutral-800 rounded-lg">
                  <ModalHeader className="border-b border-gray-200 dark:border-gray-700 pb-2">
                    <Heading
                      size="lg"
                      className="text-typography-950 dark:text-white"
                    >
                      Product Details
                    </Heading>
                    <Button
                      variant="link"
                      onPress={() => {
                        setShowProductDetailModal(false);
                        setSelectedProduct(null);
                      }}
                      className="p-0"
                    >
                      <ButtonIcon
                        as={X}
                        className="w-5 h-5 text-gray-500 dark:text-gray-300"
                      />
                    </Button>
                  </ModalHeader>
                  <ModalBody className="p-0">
                    <ProductDetailModal product={selectedProduct} />
                  </ModalBody>
                  <ModalFooter className="w-full border-t border-gray-200 dark:border-gray-700 pt-2">
                    <Button
                      variant="outline"
                      action="secondary"
                      onPress={() => {
                        setShowProductDetailModal(false);
                        setSelectedProduct(null);
                      }}
                      className="flex-grow"
                    >
                      <ButtonText>Close</ButtonText>
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </View>
          </ScrollView>
        </Box>
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  columnHeaderCentered: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  columnData: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProductTable;
