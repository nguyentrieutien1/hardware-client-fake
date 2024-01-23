import { QueryClient, useMutation, useQueryClient } from "react-query";
import { COOKIE_NAME, axiosConfig, getCookieConfig } from "~/lib";
import { constructorIsUserLogined } from "~/queries";
type Params = {
  id: number;
  data: { quantity: number };
};
const handleOnUpdateToCart = async ({ id, data }: Params) => {
  return await axiosConfig.put(`/cart/${id}`, data, {headers: {
    Authorization: `Bearer ${getCookieConfig(COOKIE_NAME.ACCESS_TOKEN)}`
  }
});
};
export const useUpdateToCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(handleOnUpdateToCart, {
    onSuccess({ data }) {
      const key = constructorIsUserLogined();
      queryClient.setQueriesData(key, (oldData: any) => {
          const newCart = oldData?.data?.cart?.map(item => {
            if(item?.id === data?.id) {
              return data
            }
            else {
              return item
            }
          })

        oldData['data']['cart'] = newCart
        return oldData;
      })
    },
  });
};
