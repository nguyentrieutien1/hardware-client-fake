import { useMutation, useQueryClient } from "react-query";
import { COOKIE_NAME, axiosConfig, getCookieConfig } from "~/lib";
import { constructorGetCategories } from "~/queries";
const handleDeleteCategories = async ({id}) => {
  return  await axiosConfig.delete(`/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${getCookieConfig(COOKIE_NAME.ACCESS_TOKEN)}`,
    },
  });
};
export const useDeleteCategoriesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(handleDeleteCategories, {
    onSuccess({ data }) {
      const key = constructorGetCategories();
      queryClient.setQueriesData(key, (oldData: any) => {
        const findIndex = oldData?.data?.findIndex(d => d.id == data?.id)
        oldData?.data?.splice(findIndex, 1)
        return oldData;
      });
    },
  });
};
