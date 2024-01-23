import { useMutation, useQueryClient } from "react-query";
import { COOKIE_NAME, axiosConfig, getCookieConfig } from "~/lib";
import { constructorGetCategories } from "~/queries";
const handleUpdateCategories = async ({ id, data }) => {
  return await axiosConfig.put(`/categories/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getCookieConfig(COOKIE_NAME.ACCESS_TOKEN)}`,
    },
  });
};
export const useUpdateCategoriesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(handleUpdateCategories, {
    onSuccess({ data }) {
      const key = constructorGetCategories();
      queryClient.setQueriesData(key, (oldData: any) => {
        const newData = oldData?.data.map((d) => {
          if (d.id == data?.id) {
            return data;
          }
          return d;
        });
        oldData["data"] = [...newData];
        return oldData;
      });
    },
  });
};
