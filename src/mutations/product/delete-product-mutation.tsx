import { useMutation, useQueryClient } from "react-query";
import { COOKIE_NAME, axiosConfig, getCookieConfig } from "~/lib";
import { constructorGetProducts } from "~/queries";
const handleDeleteProduct = async (data: { id: number }) => {
  return await axiosConfig.delete(`/product/${data.id}`, {
    headers: {
      Authorization: `Bearer ${getCookieConfig(COOKIE_NAME.ACCESS_TOKEN)}`,
    },
  });
};
export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(handleDeleteProduct, {
    onSuccess({ data }) {
      const key = constructorGetProducts();
      queryClient.setQueriesData(key, (oldData: any) => {
        const newData = oldData['data']?.filter(prod => prod?.id != data?.id)
        oldData['data'] = newData;
        return { ...oldData }
      })
    },
  });
};
