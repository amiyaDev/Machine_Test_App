import { PRODUCT_URL } from "@/configuration/api_urls";
import axios, { AxiosResponse } from "axios";
import { ProductApiResponse } from "./productListModels";

export const fetchAllProducts = async (): Promise<ProductApiResponse> => {
  const response: ProductApiResponse = await axios.get(PRODUCT_URL);
  return response;
};
