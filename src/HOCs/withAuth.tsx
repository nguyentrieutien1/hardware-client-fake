import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { COOKIE_NAME, getCookieConfig } from "~/lib";
import { LINK } from "~/lib/constants";
import { useIsUserLogined } from "~/queries";

const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();

    const { data: res, isLoading } = useIsUserLogined();

    useEffect(() => {
      if (!getCookieConfig(COOKIE_NAME.ACCESS_TOKEN) || (!isLoading && !res?.data)) {
        router.replace(LINK.LOGIN);
      }
    }, [isLoading, res?.data]);

    return res?.data ? <WrappedComponent {...props} /> : <></>;
  };

  return Wrapper;
};

export default withAuth;
