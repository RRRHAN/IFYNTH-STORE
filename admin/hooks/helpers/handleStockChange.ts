// src/helpers/handleStockChange.ts
export const handleStockChange = (
    index: number,
    value: string,
    sizes: { size: string; stock: number }[],
    setSizes: React.Dispatch<React.SetStateAction<{ size: string; stock: number }[]>>
  ) => {
    const updatedSizes = [...sizes];
    updatedSizes[index].stock = parseInt(value, 10) || 0;
    setSizes(updatedSizes);
  };
  