import { useQuery } from "react-query";
import {  axiosConfig } from "~/lib";

const getProducts = async () => {
  return await axiosConfig.get("/product");
};
export const constructorGetProducts = () => ["get-products"];
export const useGetProducts = () => {
  return useQuery({
    queryKey: constructorGetProducts(),
    queryFn: getProducts,
    refetchOnWindowFocus: false,
    cacheTime: 12 * 60 * 60 * 1000, // 12 giờ
    staleTime: 12 * 60 * 60 * 1000 // 12 giờ
  });
};
