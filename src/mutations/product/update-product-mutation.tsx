import { useMutation, useQueryClient } from "react-query";
import { IProduct } from "../../types/index";
import { COOKIE_NAME, axiosConfig, getCookieConfig } from "~/lib";
import { constructorGetProducts } from "~/queries";
const handleUpdateProduct = async (data: IProduct) => {
  return await axiosConfig.put(`/product/${data.id}`, data, {
    headers: {
      Authorization: `Bearer ${getCookieConfig(COOKIE_NAME.ACCESS_TOKEN)}`,
    },
  });
};
export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(handleUpdateProduct, {
    onSuccess({ data }) {
      const key = constructorGetProducts();
      queryClient.setQueriesData(key, (oldData: any) => {
        const newData = oldData['data'].map(prod => {
          if(prod?.id == data?.id) {
            return data;
          }
          return prod
        })
        oldData['data'] = newData;
        return {...oldData}
      })
    },
  });
};
