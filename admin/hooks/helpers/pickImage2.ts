// src/helpers/pickImage.ts
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

const allowedExtensions = ["jpg", "jpeg", "png"];

export type SelectedImage = {
  uri: string;
  width?: number;
  height?: number;
  type?: string;
  fileName?: string;
  base64?: string;
};

// Helper function untuk mendapatkan ekstensi dari base64
const getExtensionFromBase64 = (base64: string): string | null => {
  const match = base64.match(/^data:image\/(png|jpeg|jpg);base64,/i);
  if (match && match[1]) {
    return match[1].toLowerCase();
  }
  return null;
};

export const pickImage = async (
  setImages: React.Dispatch<React.SetStateAction<any[]>>,
  setErrorMessage: (msg: string) => void,
  setVisible: (visible: boolean) => void
) => {
  console.log("📸 Memanggil ImagePicker...");

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      base64: false,
      quality: 1,
    });

    console.log("📥 Hasil dari ImagePicker:", result);

    if (result.canceled) {
      console.log("🚫 User membatalkan image picker.");
      return;
    }

    const selectedImages = result.assets
      .filter((asset) => {
        const extension = asset.fileName
          ? asset.fileName.split(".").pop()?.toLowerCase()
          : getExtensionFromBase64(asset.uri);
        console.log("🔍 Cek asset:", asset);
        console.log("📄 Ekstensi:", extension);
        return extension && allowedExtensions.includes(extension);
      })
      .map((asset) => {
        const imageObj = {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: asset.type,
          fileName: asset.fileName,
        };
        console.log("✅ Gambar valid:", imageObj);
        return imageObj;
      });

    if (selectedImages.length === 0) {
      console.log("⚠️ Tidak ada gambar yang valid.");
      setErrorMessage("Hanya gambar JPG, JPEG, atau PNG yang diizinkan.");
      setVisible(true);
      return;
    }

    console.log("🎯 Gambar terpilih:", selectedImages);
    setImages((prevImages) => [...prevImages, ...selectedImages]);
  } catch (err) {
    console.log("💥 Terjadi error saat memilih gambar:", err);
    setErrorMessage("Terjadi kesalahan.");
    setVisible(true);
  }
};
