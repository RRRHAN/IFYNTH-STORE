export const handleStockChange = (
  index: number,
  value: string,
  sizes: { size: string; stock: number }[],
  setSizes: React.Dispatch<React.SetStateAction<{ size: string; stock: number }[]>>
) => {
  const updatedSizes = [...sizes];

  updatedSizes[index].stock = value === "" ? 0 : parseInt(value, 10) || 0;

  setSizes(updatedSizes);

  console.log("Updated sizes:", updatedSizes);
};
