import React from "react";
import { Platform } from "react-native";
import { Text } from "../ui/text";
import { Input, InputField } from "../ui/input";
import { Box } from "../ui/box";

interface ProductFormInputsProps {
  name: string;
  description: string;
  price: string;
  weight: string;
  capital: string;
  isDark: boolean;
  setName: (text: string) => void;
  setDescription: (text: string) => void;
  setPrice: (text: string) => void;
  setWeight: (text: string) => void;
  setCapital: (text: string) => void;
  styles: any;
}

export default function ProductFormInputs({
  name,
  description,
  price,
  weight,
  capital,
  isDark,
  setName,
  setDescription,
  setPrice,
  setWeight,
  setCapital,
}: ProductFormInputsProps) {
  return (
    <Box>
      <Box
        className="flex-row justify-between gap-3 mb-4"
      >
        <Box className="flex-2 w-2/3">
          <Text className="mb-1">Product Name</Text>
          <Input
            variant="outline"
            size="md"
            className={isDark ? "border-gray-600" : "border-gray-300"}
          >
            <InputField
              placeholder="Enter product name"
              value={name}
              onChangeText={setName}
              className={`
                ${isDark ? "text-gray-200" : "text-gray-800"}
                ${isDark ? "placeholder-gray-500" : "placeholder-gray-400"}
              `}
            />
          </Input>
        </Box>

        <Box className="flex-1">
          <Text className="mb-1">Product Weight</Text>
          <Input
            variant="outline"
            size="md"
            className={isDark ? "border-gray-600" : "border-gray-300"}
          >
            <InputField
              placeholder="gram"
              value={weight}
              onChangeText={(text) => setWeight(text.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
              className={`
                ${isDark ? "text-gray-200" : "text-gray-800"}
                ${isDark ? "placeholder-gray-500" : "placeholder-gray-400"}
              `}
            />
          </Input>
        </Box>
      </Box>

      <Text className="mb-1">Product Description</Text>
      <Input
        variant="outline"
        size="md"
        className={`
          ${isDark ? "border-gray-600" : "border-gray-300"}
          h-24
        `}
      >
        <InputField
          placeholder="Enter product description"
          value={description}
          onChangeText={setDescription}
          multiline={true}
          numberOfLines={4}
          className={`
            ${isDark ? "text-gray-200" : "text-gray-800"}
            ${isDark ? "placeholder-gray-500" : "placeholder-gray-400"}
          `}
        />
      </Input>

      <Box
        className="flex-row justify-between gap-3 mt-4"
      >
        <Box className="flex-1">
          <Text className="mb-1">Product Price</Text>
          <Input
            variant="outline"
            size="md"
            className={isDark ? "border-gray-600" : "border-gray-300"}
          >
            <InputField
              placeholder="Enter product price"
              value={price}
              onChangeText={(text) => setPrice(text.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
              className={`
                ${isDark ? "text-gray-200" : "text-gray-800"}
                ${isDark ? "placeholder-gray-500" : "placeholder-gray-400"}
              `}
            />
          </Input>
        </Box>

        <Box className="flex-1">
          <Text className="mb-1">Commodity Capital</Text>
          <Input
            variant="outline"
            size="md"
            className={isDark ? "border-gray-600" : "border-gray-300"}
          >
            <InputField
              placeholder="Enter commodity capital"
              value={capital}
              onChangeText={(text) => setCapital(text.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
              className={`
                ${isDark ? "text-gray-200" : "text-gray-800"}
                ${isDark ? "placeholder-gray-500" : "placeholder-gray-400"}
              `}
            />
          </Input>
        </Box>
      </Box>
    </Box>
  );
}