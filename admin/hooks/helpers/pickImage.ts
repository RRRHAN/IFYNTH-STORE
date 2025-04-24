// src/helpers/pickImage.ts
import { launchImageLibrary } from "react-native-image-picker";

export const pickImage = (setImages: React.Dispatch<React.SetStateAction<any[]>>) => {
  launchImageLibrary(
    {
      mediaType: "photo",
      maxWidth: 1000,
      maxHeight: 1000,
      quality: 0.8,
      selectionLimit: 0, // Allow multiple selections
    },
    (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else if (response.assets) {
        const selectedImages = response.assets.map((asset: any) => ({
          uri: asset.uri,
          name: asset.fileName,
          type: asset.type,
        }));
        setImages((prevImages) => [...prevImages, ...selectedImages]);
      }
    }
  );
};
