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

export const pickImage = async (
  setImages: React.Dispatch<React.SetStateAction<any[]>>,
  setErrorMessage: (msg: string) => void,
  setVisible: (visible: boolean) => void
) => {
  console.log("📸 Memanggil launchImageLibrary...");

  const permissionGranted = await requestAndroidPermissions();
  if (!permissionGranted) {
    console.log("❌ Permission ditolak");
    setErrorMessage("Izin dibutuhkan untuk mengakses galeri.");
    setVisible(true);
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
      console.log("❗ Error Code:", result.errorCode);
      console.log("❗ Error Message:", result.errorMessage);
      setErrorMessage("Gagal mengakses galeri: " + result.errorMessage);
      setVisible(true);
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
        console.log("⚠️ Tidak ada gambar yang valid.");
        setErrorMessage("Hanya gambar JPG, JPEG, atau PNG yang diizinkan.");
        setVisible(true);
        return;
      }

      setImages((prevImages) => [...prevImages, ...selectedImages]);
    }
  } catch (err) {
    console.log("💥 Terjadi error saat memanggil launchImageLibrary:", err);
    setErrorMessage("Terjadi kesalahan.");
    setVisible(true);
  }
};

