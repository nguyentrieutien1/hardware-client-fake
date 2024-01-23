import { useMutation, useQueryClient } from "react-query";
import { IProduct } from "../../types/index";
import { COOKIE_NAME, axiosConfig, getCookieConfig } from "~/lib";
import { constructorGetProducts } from "~/queries";
const handleCreateProduct = async (data: IProduct) => {
  return await axiosConfig.post("/product", data, {
    headers: {
      Authorization: `Bearer ${getCookieConfig(COOKIE_NAME.ACCESS_TOKEN)}`,
    },
  });
};
export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(handleCreateProduct, {
    onSuccess({ data }) {
      const key = constructorGetProducts();
      queryClient.setQueriesData(key, (oldData: any) => {
        oldData['data'].unshift(data)
        return {...oldData}
      })
    },
  });
};
