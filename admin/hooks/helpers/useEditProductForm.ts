import { useState } from "react";

function useProductForm(initialItem: any) {
  const [name, setName] = useState<string>(initialItem?.Name || "");
  const [description, setDescription] = useState<string>(initialItem?.Description || "");
  const [price, setPrice] = useState<string>(initialItem?.Price?.toString() || "");
  const [department, setDepartment] = useState<string>(initialItem?.Department || "IFY");
  const [category, setCategory] = useState<string>(initialItem?.Category || "T-Shirt");
  const [sizes, setSizes] = useState<{ size: string; stock: number }[]>(
    initialItem?.StockDetails.map((detail: any) => ({
      size: detail.Size,
      stock: detail.Stock,
    })) || []
  );
  return {
    name, setName,
    description, setDescription,
    price, setPrice,
    department, setDepartment,
    category, setCategory,
    sizes, setSizes,
  };
}

export default useProductForm;
