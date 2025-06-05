export const handleStockChange = (
  index: number,
  value: string,
  sizes: { size: string; stock: number }[],
  setSizes: React.Dispatch<React.SetStateAction<{ size: string; stock: number }[]>>
) => {
  const updatedSizes = [...sizes];

  // Pastikan nilai input diubah menjadi angka, dan set ke 0 jika kosong atau bukan angka
  updatedSizes[index].stock = value === "" ? 0 : parseInt(value, 10) || 0;

  setSizes(updatedSizes);

  // Log ukuran dan stok untuk memastikan data benar
  console.log("Updated sizes:", updatedSizes);
};
