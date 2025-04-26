// src/helpers/pickImage.ts
import { launchImageLibrary } from "react-native-image-picker";

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
    return match[1].toLowerCase(); // Bisa "png", "jpeg", "jpg"
  }
  return null;
};

export const pickImage = (
  setImages: React.Dispatch<React.SetStateAction<any[]>>,
  setErrorMessage: (msg: string) => void,
  setVisible: (visible: boolean) => void
) => {
  launchImageLibrary(
    {
      mediaType: "photo",
      selectionLimit: 0,
    },
    (response) => {
      console.log("Image Picker Response:", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error Code:", response.errorCode);
        console.log("ImagePicker Error Message:", response.errorMessage);
        setErrorMessage("Error accessing image library.");
        setVisible(true);
      } else if (response.assets) {
        console.log("Raw assets:", response.assets);

        const selectedImages = response.assets
          .filter((asset: any) => {
            let extension: string | null = null;

            // Jika URI berbentuk base64, ambil ekstensinya dari sana
            if (asset.uri.startsWith("data:image/")) {
              extension = getExtensionFromBase64(asset.uri);
            } else {
              extension = asset.fileName
                ? asset.fileName.split(".").pop()?.toLowerCase()
                : asset.uri.split(".").pop()?.toLowerCase();
            }

            console.log("Checking asset:", asset);
            console.log("Extracted extension:", extension);

            return extension && allowedExtensions.includes(extension);
          })
          .map((asset: any) => {
            const imageObj = {
              uri: asset.uri,
              name: asset.fileName,
              type: asset.type,
            };
            console.log("Valid image:", imageObj);
            return imageObj;
          });

        console.log("Filtered selected images:", selectedImages);

        if (selectedImages.length === 0) {
          console.log("No valid images passed the filter.");
          setErrorMessage("Only JPG, JPEG, and PNG images are allowed.");
          setVisible(true);
          return;
        }

        setImages((prevImages) => [...prevImages, ...selectedImages]);
      }
    }
  );
};
