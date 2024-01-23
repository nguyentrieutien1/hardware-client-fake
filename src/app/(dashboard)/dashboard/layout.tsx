"use client";
import Header from "~/components/pages/dashboard/header/header";
import Sidebar from "~/components/pages/dashboard/sidebar/sidebar";
import { useIsUserLogined } from "~/queries";
import { COOKIE_NAME, getCookieConfig } from "~/lib";
import { LINK } from "~/lib/constants";
import "../../../../public/css/dashboard.style.css";
import "tippy.js/dist/tippy.css";
import Spinner from "~/components/spinner/spinner";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: res, isLoading, error} = useIsUserLogined();
  if (!isLoading) {
    if (
      !getCookieConfig(COOKIE_NAME.ACCESS_TOKEN) ||
      res?.data?.role?.name !== "SUPER_ADMIN"
    ) {
      
      window.location.href = LINK.HOME;
    } else if (error) {
      window.location.href = LINK.LOGIN;
    }
  }
  return res?.data && !isLoading ? (
    <>
      <div className="container-scroller">
        <Header />
        <div className="container-fluid page-body-wrapper ">
          <Sidebar />
          {children}
        </div>
      </div>
    </>
  ) : (
    <Spinner isLoading={isLoading} />
  );
}
