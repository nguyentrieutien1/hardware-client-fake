"use client";

import { getCookie, setCookie, deleteCookie } from "cookies-next";

export const COOKIE_NAME = {
  ACCESS_TOKEN: "access_token",
};

export const setCookieConfig = (
  cname: string,
  cvalue: string,
  exdays?: number
) => {
  return setCookie(cname, cvalue, {expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)})
};

export const getCookieConfig = (cname: string) => {
  return getCookie(cname)
};
export const deleteCookieConfig = (cname: string) => {
  return deleteCookie(cname)
};
