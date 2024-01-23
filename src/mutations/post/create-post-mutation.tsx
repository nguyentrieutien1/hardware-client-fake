import { useMutation, useQueryClient } from "react-query";
import { COOKIE_NAME, axiosConfig, getCookieConfig } from "~/lib";
import { constructorGetPosts, constructorGetProducts } from "~/queries";
const handleCreatePost = async (data) => {
  return await axiosConfig.post("/posts", data, {
    headers: {
      Authorization: `Bearer ${getCookieConfig(COOKIE_NAME.ACCESS_TOKEN)}`,
    },
  });
};
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(handleCreatePost, {
    onSuccess({ data }) {
      const key = constructorGetPosts();
      queryClient.setQueriesData(key, (oldData: any) => {
        oldData['data'].unshift(data)
        return {...oldData}
      })
    },
  });
};
