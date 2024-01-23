import { useMutation, useQueryClient } from "react-query";
import { COOKIE_NAME, axiosConfig, getCookieConfig } from "~/lib";
import { constructorIsUserLogined } from "~/queries";
import { constructorGetOrders } from "~/queries/order/get-orders-query";
const handleUpdateOrder = async ({ id, data }) => {
  return await axiosConfig.put(`/order/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getCookieConfig(COOKIE_NAME.ACCESS_TOKEN)}`,
    },
  });
};
export const useUpdateOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(handleUpdateOrder, {
    onSuccess({ data }) {
      const key = constructorIsUserLogined();
      const keyGetOrders = constructorGetOrders()
      queryClient.setQueriesData(key, (oldData: any) => {
        const newOrder = oldData?.data?.order?.filter(item => {
          return item?.id != data?.id
        })

        oldData['data']['order'] = newOrder
        return oldData;
      })
      console.log(data);
      
      queryClient.setQueriesData(keyGetOrders, (oldData: any) => {
        const newOrder = oldData?.data?.map(item => {
          if(item?.id == data?.id) {
            return data;
          }
          return item
        })

        oldData['data'] = newOrder
        return oldData;
      })
    },
  });
};
