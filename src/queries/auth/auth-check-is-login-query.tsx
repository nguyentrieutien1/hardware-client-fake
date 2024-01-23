import { useQuery } from "react-query";
import { COOKIE_NAME, axiosConfig, getCookieConfig } from "~/lib";

const checkUserIsLogined = async () => {
  return await axiosConfig.get("/auth/check-is-login", {headers: {
    Authorization: `Bearer ${getCookieConfig(COOKIE_NAME.ACCESS_TOKEN)}`
  }
})
};
export const constructorIsUserLogined = () => ["is-user-logined"];
export const useIsUserLogined = () => {
  return useQuery({
    queryKey: constructorIsUserLogined(),
    queryFn: checkUserIsLogined,
    refetchOnWindowFocus: false
  });
};
