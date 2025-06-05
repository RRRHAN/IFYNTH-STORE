// src/helpers/pickImage.ts
import * as ImagePicker from "expo-image-picker";

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
  showModal: (options: {
    title: string;
    message: string;
    type: "success" | "error" | "info";
    onConfirm?: () => void;
    onCancel?: () => void;
    showCancelButton?: boolean;
    confirmButtonText?: string;
    cancelButtonText?: string;
    autoClose?: boolean;
    duration?: number;
  }) => void
) => {
  console.log("📸 Memanggil ImagePicker...");

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      base64: false,
      quality: 1,
    });
    if (result.canceled) {
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
        return imageObj;
      });

    if (selectedImages.length === 0) {
      showModal({
        title: "Add Product Image Failed!",
        message: "Only JPG, JPEG, or PNG images are allowed.",
        type: "error",
        confirmButtonText: "Close",
      });
      return;
    }
    setImages((prevImages) => [...prevImages, ...selectedImages]);
  } catch (err) {
    showModal({
      title: "Add Product Image Failed!",
      message: "Something went wrongg",
      type: "error",
      confirmButtonText: "Close",
    });
  }
};
