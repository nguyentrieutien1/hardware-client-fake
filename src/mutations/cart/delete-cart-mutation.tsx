import { useMutation, useQueryClient } from "react-query";
import { COOKIE_NAME, axiosConfig, getCookieConfig } from "~/lib";
import { constructorIsUserLogined } from "~/queries";
type Params = {
  id: number;
};
const handleOnDeleteCart = async ({ id }: Params) => {
  return await axiosConfig.delete(`/cart/${id}`, {
    headers: {
      Authorization: `Bearer ${getCookieConfig(COOKIE_NAME.ACCESS_TOKEN)}`
    }
  });
};
export const useDeleteCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(handleOnDeleteCart, {
    onSuccess({ data }) {
      const key = constructorIsUserLogined();
      queryClient.setQueriesData(key, (oldData: any) => {
        const newCart = oldData?.data?.cart?.filter(item => {
          return item?.id != data?.id
        })
        oldData['data']['cart'] = newCart
        return oldData;
      })
    },
  });
};
