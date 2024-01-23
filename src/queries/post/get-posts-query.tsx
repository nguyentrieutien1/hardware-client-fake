import { useQuery } from "react-query";
import {  axiosConfig } from "~/lib";

const getPosts = async () => {
  return await axiosConfig.get("/posts");
};
export const constructorGetPosts = () => ["get-posts"];
export const useGetPosts = () => {
  return useQuery({
    queryKey: constructorGetPosts(),
    queryFn: getPosts,
    refetchOnWindowFocus: false,
    cacheTime: 12 * 60 * 60 * 1000, // 12 giờ
    staleTime: 12 * 60 * 60 * 1000 // 12 giờ
  });
};
