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
  }

  launchImageLibrary(
    {
      mediaType: "photo",
      selectionLimit: 0, // 0 = multiple
    },
    (response) => {
      console.log("✅ Callback launchImageLibrary dipanggil.");
      console.log("🖼️ Image Picker Response:", response);

      if (response.didCancel) {
        console.log("🚫 User membatalkan image picker.");
      } else if (response.errorCode) {
        console.log("❗ ImagePicker Error Code:", response.errorCode);
        console.log("❗ ImagePicker Error Message:", response.errorMessage);
        setErrorMessage("Error accessing image library.");
        setVisible(true);
      } else if (response.assets) {
        console.log("📦 Raw assets:", response.assets);

        const selectedImages = response.assets
          .filter((asset: any) => {
            let extension: string | null = null;

            if (asset.uri.startsWith("data:image/")) {
              extension = getExtensionFromBase64(asset.uri);
            } else {
              extension = asset.fileName
                ? asset.fileName.split(".").pop()?.toLowerCase()
                : asset.uri.split(".").pop()?.toLowerCase();
            }

            console.log("🔍 Checking asset:", asset);
            console.log("📄 Extracted extension:", extension);

            return extension && allowedExtensions.includes(extension);
          })
          .map((asset: any) => {
            const imageObj = {
              uri: asset.uri,
              name: asset.fileName,
              type: asset.type,
            };
            console.log("✅ Valid image:", imageObj);
            return imageObj;
          });

        console.log("🎯 Filtered selected images:", selectedImages);

        if (selectedImages.length === 0) {
          console.log("⚠️ No valid images passed the filter.");
          setErrorMessage("Only JPG, JPEG, and PNG images are allowed.");
          setVisible(true);
          return;
        }

        setImages((prevImages) => [...prevImages, ...selectedImages]);
      }
    }
  );
};
