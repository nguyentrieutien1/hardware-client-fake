import { useMutation, useQueryClient } from "react-query";
import { IOrder } from "../../types/index";
import { COOKIE_NAME, axiosConfig, getCookieConfig } from "~/lib";
import { constructorIsUserLogined } from "~/queries";
const handleCreateOrder = async (data: IOrder[]) => {
  return await axiosConfig.post("/order", data, {headers: {
    Authorization: `Bearer ${getCookieConfig(COOKIE_NAME.ACCESS_TOKEN)}`
  }
});
};
export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(handleCreateOrder, {onSuccess({data}) {
   
  },});
};
