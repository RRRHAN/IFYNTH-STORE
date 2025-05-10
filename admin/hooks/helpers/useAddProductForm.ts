import { useState, useEffect } from 'react';

export const useProductForm = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [capital, setCapital] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [department, setDepartment] = useState<string>("IFY");
  const [category, setCategory] = useState<string>("T-Shirt");
  const [sizes, setSizes] = useState<{ size: string; stock: number }[]>([]);
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    // Ubah ukuran berdasarkan kategori yang dipilih
    if (category === "T-Shirt" || category === "Hoodie" || category === "Jacket") {
      setSizes([
        { size: "S", stock: 0 },
        { size: "M", stock: 0 },
        { size: "L", stock: 0 },
        { size: "XL", stock: 0 },
      ]);
    } else if (category === "Pants") {
      setSizes([
        { size: "27", stock: 0 },
        { size: "28", stock: 0 },
        { size: "29", stock: 0 },
        { size: "30", stock: 0 },
        { size: "31", stock: 0 },
        { size: "32", stock: 0 },
        { size: "33", stock: 0 },
        { size: "34", stock: 0 },
      ]);
    } else {
      setSizes([]);
    }
  }, [category]);

  return {
    name,
    setName,
    description,
    setDescription,
    price,
    setPrice,
    capital,
    setCapital,
    weight,
    setWeight,
    department,
    setDepartment,
    category,
    setCategory,
    sizes,
    setSizes,
    images,
    setImages,
  };
};
