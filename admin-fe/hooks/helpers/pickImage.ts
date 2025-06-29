// src/helpers/pickImage.ts
import { launchImageLibrary } from "react-native-image-picker";
import { PermissionsAndroid, Platform } from "react-native";

const allowedExtensions = ["jpg", "jpeg", "png"];

export type SelectedImage = {
  uri: string;
  width: number;
  height: number;
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

const requestAndroidPermissions = async () => {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        {
          title: "Izin Akses Gambar",
          message: "Aplikasi butuh akses ke galeri Anda",
          buttonNeutral: "Tanya Nanti",
          buttonNegative: "Tolak",
          buttonPositive: "Izinkan",
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true; // iOS tidak perlu
};

export const pickImage1 = async (
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
  console.log("📸 Memanggil launchImageLibrary...");

  const permissionGranted = await requestAndroidPermissions();
  if (!permissionGranted) {
    showModal({
      title: "Add Product Image Failed!",
      message: "Izin dibutuhkan untuk mengakses galeri.",
      type: "error",
      confirmButtonText: "Close",
    });
    return;
  } else {
    console.log("✅ Permission disetujui");
  }

  try {
    const result = await launchImageLibrary({
      mediaType: "photo",
      selectionLimit: 0,
    });

    console.log("📥 Hasil dari launchImageLibrary:", result);

    if (result.didCancel) {
      console.log("🚫 User membatalkan image picker.");
      return;
    }

    if (result.errorCode) {
      showModal({
        title: "Add Product Image Failed!",
        message: "Gagal mengakses galeri: " + result.errorMessage,
        type: "error",
        confirmButtonText: "Close",
      });
      return;
    }

    if (result.assets) {
      const selectedImages = result.assets
        .filter((asset: any) => {
          let extension: string | null = null;
          if (asset.uri.startsWith("data:image/")) {
            extension = getExtensionFromBase64(asset.uri);
          } else {
            extension = asset.fileName
              ? asset.fileName.split(".").pop()?.toLowerCase()
              : asset.uri.split(".").pop()?.toLowerCase();
          }

          console.log("🔍 Cek asset:", asset);
          console.log("📄 Ekstensi:", extension);

          return extension && allowedExtensions.includes(extension);
        })
        .map((asset: any) => {
          const imageObj = {
            uri: asset.uri,
            name: asset.fileName,
            type: asset.type,
          };
          console.log("✅ Gambar valid:", imageObj);
          return imageObj;
        });

      console.log("🎯 Gambar terpilih:", selectedImages);

      if (selectedImages.length === 0) {
        showModal({
          title: "Add Product Image Failed!",
          message: "Hanya gambar JPG, JPEG, atau PNG yang diizinkan.",
          type: "error",
          confirmButtonText: "Close",
        });
        return;
      }

      setImages((prevImages) => [...prevImages, ...selectedImages]);
    }
  } catch (err) {
            showModal({
          title: "Add Product Image Failed!",
          message: "Terjadi kesalahan.",
          type: "error",
          confirmButtonText: "Close",
        });
  }
};
