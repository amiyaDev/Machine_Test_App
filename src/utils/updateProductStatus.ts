import { Product } from "@/services/products/productListModels";
import { cloneDeep } from "lodash";

export const updateProductActiveStatus = (
  products: Product[],
  id: number
): Product[] => {
  const index = products.findIndex((product) => product.id === id);

  if (index !== -1) {
    const updatedProducts = cloneDeep(products);
    updatedProducts[index] = {
      ...updatedProducts[index],
      active: true,
    };
    return updatedProducts;
  }

  return products;
};
