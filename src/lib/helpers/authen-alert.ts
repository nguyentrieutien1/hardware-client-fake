import { toastConfig } from "..";

export const toastErrorAuthen = (err, message) => {
  console.log(err);
  
  if (err?.response?.status === 401) {
    return toastConfig(message, {
      status: "error",
    });
  }
  return toastConfig(`Cửa hàng đang bận, vui lòng trở lại sau ít phút nữa`, {
    status: "error",
  });
};
