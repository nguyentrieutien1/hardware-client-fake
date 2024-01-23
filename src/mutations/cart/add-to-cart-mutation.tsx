import { useMutation, useQueryClient } from "react-query";
import { ICart } from "../../types/index";
import { COOKIE_NAME, axiosConfig, getCookieConfig } from "~/lib";
import { constructorIsUserLogined } from "~/queries";
const handleOnAddToCart = async (data:ICart ) => {
  return await axiosConfig.post("/cart", data, {headers: {
    Authorization: `Bearer ${getCookieConfig(COOKIE_NAME.ACCESS_TOKEN)}`
  }
});
};
export const useAddToCartMutation = () => {
  
  const queryClient = useQueryClient();
  return useMutation(handleOnAddToCart, {onSuccess(data, variables, context) {
    const key = constructorIsUserLogined();
      queryClient.fetchQuery({queryKey: key})
  },});
};
