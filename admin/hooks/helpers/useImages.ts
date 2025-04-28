import { useState } from "react";

function useImages(initialImages: any[]) {
  const [images, setImages] = useState<any[]>([]);
  const [checkedImages, setCheckedImages] = useState<boolean[]>([]);
  const [removedImages, setRemovedImages] = useState<{ productId: string; url: string }[]>([]);

  const handleToggleImage = (index: number, item: any) => {
    setCheckedImages((prevCheckedImages) => {
      const newCheckedImages = [...prevCheckedImages];
      newCheckedImages[index] = !newCheckedImages[index];
      return newCheckedImages;
    });
    const imageToRemove = item?.ProductImages[index];
    if (imageToRemove) {
      setRemovedImages((prevRemovedImages) => {
        if (!checkedImages[index]) {
          return [
            ...prevRemovedImages,
            { productId: imageToRemove.ProductID, url: imageToRemove.URL },
          ];
        } else {
          return prevRemovedImages.filter(
            (image) => image.url !== imageToRemove.URL
          );
        }
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  return {
    images, setImages,
    checkedImages, setCheckedImages,
    removedImages, setRemovedImages,
    handleToggleImage,
    handleRemoveImage
  };
}

export default useImages;
