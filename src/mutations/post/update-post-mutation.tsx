import { useMutation, useQueryClient } from "react-query";
import { COOKIE_NAME, axiosConfig, getCookieConfig } from "~/lib";
import { constructorGetPosts } from "~/queries";
const handleUpdatePost = async ({ id, data }) => {
  return await axiosConfig.put(`/posts/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getCookieConfig(COOKIE_NAME.ACCESS_TOKEN)}`,
    },
  });
};
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(handleUpdatePost, {
    onSuccess({ data }) {
      const key = constructorGetPosts();
      queryClient.setQueriesData(key, (oldData: any) => {
        const newData = oldData["data"].map((post) => {
          if (post?.id == data?.id) {
            return data;
          }
          return post;
        });
        oldData["data"] = newData;
        return { ...oldData };
      });
    },
  });
};
