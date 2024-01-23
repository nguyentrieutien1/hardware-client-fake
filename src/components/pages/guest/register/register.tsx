"use client";
import Link from "next/link";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { LINK } from "~/lib/constants/routes";
import { IAuthRegister } from "~/types";
import { toastConfig } from "~/lib";
import { TOAST_MESSAGE } from "~/lib/constants/routes/toast-message";
import { useRouter } from "next/navigation";
import { useAuthRegisterMutation } from "~/mutations";
import "../../../../../public/css/style.css";
import "../../../../../public/css/bootstrap.min.css";
import "./../login/login.css";
export default function RegisterPage() {
  const router = useRouter();

  const [registerInfo, setRegisterInfo] = useState<IAuthRegister>({
    fullName: "",
    email: "",
    address: "",
    sex: "female",
    phone: "",
    birthday: "",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { value, name } = e.target;
    setRegisterInfo((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const { mutateAsync } = useAuthRegisterMutation();
  const convertInfoRegisterName = (name: string) => {
    switch (name) {
      case "fullName":
        return "họ và tên";
      case "email":
        return "email";
      case "address":
        return "địa chỉ";
      case "phone":
        return "số điện thoại";
      case "birthday":
        return "ngày sinh";
      case "password":
        return "mật khẩu";
      case "confirmPassword":
        return "nhập lại mật khẩu";
      default:
        break;
    }
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      for (const key in registerInfo) {
        if (Object.prototype.hasOwnProperty.call(registerInfo, key)) {
          if (!registerInfo[key]) {
            toastConfig(
              `Trường ${convertInfoRegisterName(key)} không được trống !`,
              { status: "warning" }
            );
            return;
          }
        }
      }
      mutateAsync(registerInfo)
        .then((res) => {
          if (res.status === 201) {
            toastConfig(TOAST_MESSAGE.REGISTER_ACCOUNT_SUCCESSFUL, {
              status: "success",
            });
            router.push(LINK.LOGIN);
          }
        })
        .catch((error: any) => {
          const { message } = error.response.data;
          if (Array.isArray(message) && message.length > 0) {
            toastConfig(message[0], { status: "error" });
          } else {
            toastConfig(message, { status: "error" });
          }
        });
    } catch (error: any) {}
  };
  return (
    <>
      <section className="ftco-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center mb-5">
              <h2 className="heading-section">Đăng kí</h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-12 col-lg-10">
              <div className="wrap d-md-flex">
                <div className="text-wrap p-4 p-lg-5 text-center d-flex align-items-center order-md-last">
                  <div className="text w-100">
                    <h2>Chào mừng bạn đăng kí</h2>
                    <Link
                      href={"#"}
                      onClick={() => (window.location.href = LINK.LOGIN)}
                      className="login-wrap btn btn-primary border-white p-3 mt-4"
                      prefetch
                    >
                      Đăng nhập
                    </Link>
                  </div>
                </div>
                <div className="login-wrap p-4 p-lg-6">
                  <div className="d-flex">
                    <div className="w-100">
                      <h3 className="mb-4">Đăng kí</h3>
                    </div>
                  </div>
                  <form
                    action="#"
                    className="signin-form"
                    onSubmit={handleSubmit}
                  >
                    <div className="row">
                      <div className="form-group mb-3 col-6">
                        <label className="label" htmlFor="fullName">
                          Họ và tên
                        </label>
                        <input
                          onChange={handleChange}
                          id="fullName"
                          name="fullName"
                          className="form-control"
                          placeholder="Họ và tên"
                        />
                      </div>
                      <div className="form-group mb-3 col-6">
                        <label className="label" htmlFor="email">
                          Email
                        </label>
                        <input
                          onChange={handleChange}
                          id="email"
                          type="text"
                          className="form-control"
                          placeholder="Email"
                          name="email"
                        />
                      </div>

                      <div className="form-group mb-3 col-6">
                        <label className="label" htmlFor="address">
                          Địa chỉ
                        </label>
                        <input
                          onChange={handleChange}
                          name="address"
                          id="address"
                          className="form-control"
                          placeholder="Địa chỉ"
                        />
                      </div>
                      <div className="form-group mb-3 col-6">
                        <label className="label" htmlFor="sex">
                          Giới tính
                        </label>
                        <div className="mb-3">
                          <select
                            onChange={handleChange}
                            className="form-select border-1 form-control"
                            id="sex"
                            name="sex"
                            value={registerInfo.sex}
                          >
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group mb-3 col-6">
                        <label className="label" htmlFor="phone">
                          Số điện thoại
                        </label>
                        <input
                          onChange={handleChange}
                          type="number"
                          className="form-control"
                          placeholder="Số điện thoại"
                          name="phone"
                          id="phone"
                        />
                      </div>
                      <div className="form-group mb-3 col-6">
                        <label className="label" htmlFor="birthday">
                          Ngày sinh
                        </label>
                        <input
                          onChange={handleChange}
                          className="form-control"
                          type="date"
                          name="birthday"
                          id="birthday"
                        />
                      </div>
                      <div className="form-group mb-3 col-6">
                        <label className="label" htmlFor="password">
                          Mật khẩu
                        </label>
                        <input
                          onChange={handleChange}
                          className="form-control"
                          placeholder="mật khẩu"
                          name="password"
                          id="password"
                          type="password"
                        />
                      </div>
                      <div className="form-group mb-3 col-6">
                        <label className="label" htmlFor="confirmPassword">
                          Nhập lại mật khẩu
                        </label>
                        <input
                          type="password"
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Nhập lại mật khẩu"
                          name="confirmPassword"
                          id="confirmPassword"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <button
                        type="submit"
                        className="form-control btn btn-primary  px-3"
                      >
                        Đăng kí
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
