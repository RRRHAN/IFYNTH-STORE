// hooks/helpers/getDefaultSizesByCategory.ts
export const getDefaultSizesByCategory = (category: string) => {
    if (["T-Shirt", "Hoodie", "Jacket"].includes(category)) {
      return [
        { size: "S", stock: 0 },
        { size: "M", stock: 0 },
        { size: "L", stock: 0 },
        { size: "XL", stock: 0 },
      ];
    } else if (category === "Pants") {
      return [
        { size: "27", stock: 0 },
        { size: "28", stock: 0 },
        { size: "29", stock: 0 },
        { size: "30", stock: 0 },
        { size: "31", stock: 0 },
        { size: "32", stock: 0 },
        { size: "33", stock: 0 },
        { size: "34", stock: 0 },
      ];
    }
    return [];
  };
  