import {  useMutation, useQueryClient } from "react-query";
import { COOKIE_NAME, axiosConfig, getCookieConfig } from "~/lib";
import { constructorIsUserLogined } from "~/queries";

const handleOnUpdateAccount = async ({ id, data }) => {
  return await axiosConfig.put(`/account/${id}`, data, {headers: {
    Authorization: `Bearer ${getCookieConfig(COOKIE_NAME.ACCESS_TOKEN)}`
  }
});
};
export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(handleOnUpdateAccount, {
    onSuccess({  }) {
      const key = constructorIsUserLogined();
      queryClient.fetchQuery({queryKey: key})
    },
  });
};
