import { useMutation, useQueryClient } from "react-query";
import { COOKIE_NAME, axiosConfig, getCookieConfig } from "~/lib";
import { constructorGetPosts } from "~/queries";
const handleDeletePost = async ({id}) => {
  return await axiosConfig.delete(`/posts/${id}`, {
    headers: {
      Authorization: `Bearer ${getCookieConfig(COOKIE_NAME.ACCESS_TOKEN)}`,
    },
  });
};
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(handleDeletePost, {
    onSuccess({ data }) {
      const key = constructorGetPosts();
      queryClient.setQueriesData(key, (oldData: any) => {
        const newData = oldData['data']?.filter(post => post?.id != data?.id)
        oldData['data'] = newData;
        return { ...oldData }
      })
    },
  });
};
