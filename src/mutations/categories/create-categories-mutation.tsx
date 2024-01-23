import { useMutation, useQueryClient } from "react-query";
import { COOKIE_NAME, axiosConfig, getCookieConfig } from "~/lib";
import { constructorGetCategories } from "~/queries";
const handleCreateCategories = async (data: any) => {
  return  await axiosConfig.post("/categories", data, {
    headers: {
      Authorization: `Bearer ${getCookieConfig(COOKIE_NAME.ACCESS_TOKEN)}`,
    },
  });
};
export const useCreateCategoriesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(handleCreateCategories, {
    onSuccess({ data }) {
      const key = constructorGetCategories();
      queryClient.setQueriesData(key, (oldData: any) => {
        oldData?.data?.unshift(data);
        return oldData;
      });
    },
  });
};
