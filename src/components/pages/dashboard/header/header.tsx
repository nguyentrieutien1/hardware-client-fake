"use client";
import React from "react";
import Link from "next/link";
import { LINK } from "~/lib/constants";
import { useIsUserLogined } from "~/queries";
import Tippy from "@tippyjs/react";
import { COOKIE_NAME, deleteCookieConfig, isProduction } from "~/lib";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: res } = useIsUserLogined();
  const router = useRouter();
  const handleLogout = () => {
    try {
      deleteCookieConfig(COOKIE_NAME.ACCESS_TOKEN);
      window.location.href = LINK.LOGIN;
    } catch (error) {}
  };
  return (
    <nav className="navbar default-layout-navbar col-lg-12 col-12 fixed-top d-flex flex-row">
      <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
        <Link
          href={LINK.DASHBOARD}
          prefetch
        >
          <img
            style={{ objectFit: "contain" }}
            width={70}
            height={70}
            src={`${
              isProduction
                ? "https://maytinhthunguyen.com"
                : "http://localhost:5000"
            }/api/upload/1705643045785-625737817.png`}
            alt="logo"
          />
        </Link>
      </div>
      <div className="navbar-menu-wrapper d-flex align-items-stretch">
        <button
          className="navbar-toggler navbar-toggler align-self-center"
          type="button"
          data-toggle="minimize"
        >
          <span className="mdi mdi-menu" />
        </button>
        <div className="search-field d-none d-md-block">
          <form className="d-flex align-items-center h-100" action="#">
            <div className="input-group">
              <div className="input-group-prepend bg-transparent">
                <i className="input-group-text border-0 mdi mdi-magnify" />
              </div>
              <input
                type="text"
                className="form-control bg-transparent border-0"
                placeholder="Search projects"
              />
            </div>
          </form>
        </div>
        <ul className="navbar-nav navbar-nav-right   cursor-pointer">
          <Tippy
            trigger="click"
            allowHTML={true}
            placement="bottom-end"
            arrow={false}
            className="bg-gradient border-2 cursor-pointer"
            interactive={true}
            content={
              <div
                onClick={() => handleLogout()}
                style={{ cursor: "pointer !important" }}
              >
                <button className="btn btn-info p-2 rounded-1">
                  Đăng xuất
                </button>
              </div>
            }
          >
            <li className="nav-item nav-profile">
              <a className="nav-link dropdown-toggle">
                <div className="nav-profile-img">
                  <img
                    src={res?.data?.image?.url}
                    style={{ objectFit: "cover" }}
                    alt="image"
                  />
                  <span className="availability-status online" />
                </div>
                <div className="nav-profile-text">
                  <p className="mb-1 text-black">{res?.data?.fullName}</p>
                </div>
              </a>
            </li>
          </Tippy>
        </ul>
      </div>
    </nav>
  );
}
