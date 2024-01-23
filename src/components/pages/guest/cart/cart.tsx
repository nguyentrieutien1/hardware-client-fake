"use client";
import React, { useEffect, useState } from "react";
import { AppModal } from "~/components/modal/modal";
import { useDeleteCartMutation, useUpdateToCartMutation } from "~/mutations";
import { useGetProducts, useIsUserLogined } from "~/queries";
import Spinner from "~/components/spinner/spinner";
import Button from "react-bootstrap/esm/Button";
import { useCreateOrderMutation } from "~/mutations/order/create-order-mutation";
import { IOrder } from "~/types";
import { toastConfig, useAppSelector } from "~/lib";
import {
  getItemFromLocalStorage,
  setItemToLocalStorage,
  toastErrorAuthen,
} from "~/lib/helpers";
import { currencyFormatterConfig } from "~/lib/helpers/currency-formatter";
import withAuth from "~/HOCs/withAuth";
import Loading from "~/components/loading/loading";
import Link from "next/link";
import { LINK } from "~/lib/constants";
import { useDispatch } from "react-redux";
import { updateQuantity } from "~/lib/features/cart";
function CartPage() {
  const [show, setShow] = useState<boolean>(false);
  const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false);
  const { data: res, isLoading } = useIsUserLogined();
  const cart = res?.data?.cart;
  const { mutate: update, isLoading: isLoadingUpdate } =
    useUpdateToCartMutation();
  const { mutateAsync: del, isLoading: isLoadingDelelete } =
    useDeleteCartMutation();
  const { mutateAsync: createOrder, isLoading: isLoadingOrder } =
    useCreateOrderMutation();
  const { data: products, isLoading: productLoading } = useGetProducts();
  const [productId, setProductId] = useState(undefined);
  const [cartLocal, setCartLocal] = useState([]);
  const [isShowInfoForm, setIsShowInfoForm] = useState(false);
  const [orderInfo, setOrderInfo] = useState<any>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    note: "note...",
    type: "COD",
  });

  const dispath = useDispatch();
  const parseKey = (name) => {
    switch (name) {
      case "fullName":
        return "Họ và tên";
      case "email":
        return "Email";
      case "phone":
        return "Số điện thoại";
      case "address":
        return "Địa chỉ";
    }
  };
  const onUpdateQuantity = (id: number, { quantity }) => {
    let carts = getItemFromLocalStorage("cart") || [];
    const findIndex = carts?.findIndex((cart) => cart?.productId == id);
    const total = carts[findIndex]?.quantity + quantity;
    if (total === 0) {
      setShow(true);
      setProductId(id);
    } else {
      carts[findIndex]["quantity"] = total;
      carts = carts.map((cart) => {
        const checkItemIsExist = products?.data.find(
          (product) => product?.id == cart?.productId
        );
        return {
          ...cart,
          product: checkItemIsExist,
        };
      });
      setItemToLocalStorage("cart", carts);
      setCartLocal([...carts]);
      dispath(updateQuantity(carts));
    }
  };
  const onDeleteProduct = (productId) => {
    if (isLoadingDelelete || isLoadingUpdate) {
      return;
    }
    let carts = getItemFromLocalStorage("cart") || [];
    const findIndex = carts?.findIndex((cart) => cart?.productId == productId);
    carts.splice(findIndex, 1);
    setCartLocal([...carts]);
    setItemToLocalStorage("cart", carts);
    dispath(updateQuantity(cart));
    setShow(false);
  };
  const handleOrder = () => {
    for (const key in orderInfo) {
      if (Object.prototype.hasOwnProperty.call(orderInfo, key)) {
        if (!orderInfo[key]) {
          toastConfig(`${parseKey(key)} không được trống !`);
          return;
        }
      }
    }
    const order: any = cartLocal.map((item) => {
      return {
        cartId: item.id,
        quantity: item?.quantity,
        productId: item?.productId,
        accountId: res?.data?.id,
        ...orderInfo,
      };
    });
    createOrder(order)
      .then(() => {
        toastConfig("Đặt hàng thành công !", { status: "success" });
        setShowModalConfirm(false);
        setItemToLocalStorage("cart", []);
        setCartLocal([]);
      })
      .catch((err) => {
        toastErrorAuthen(
          err,
          "Đặt hàng thất bại, quay trở lại sau 5 phút nữa "
        );
      });
  };
  useEffect(() => {
    if (products?.data) {
      let carts = getItemFromLocalStorage("cart") || [];
      carts = carts.map((cart) => {
        const checkItemIsExist = products?.data.find((product) => {
          console.log(carts);
          console.log(product);

          return product?.id == cart?.productId;
        });
        return {
          ...cart,
          product: checkItemIsExist,
        };
      });
      setCartLocal([...carts]);
    }
  }, [products?.data, products?.data?.length]);

  useEffect(() => {
    if (res?.data) {
      setOrderInfo({
        email: res?.data?.email,
        fullName: res?.data?.fullName,
        phone: res?.data?.phone,
        address: res?.data?.address,
        type: "COD",
      });
    }
  }, [res?.data]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setOrderInfo((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  // if (isLoading) return <Loading />;
  return products ? (
    <section className="shoping-cart spad">
      {show && (
        <AppModal
          modalIsOpen={show}
          closeModal={() => setShow(false)}
          onConfirm={() => onDeleteProduct(productId)}
          title={`Xóa sản phẩm`}
          content={<p>Bạn có chắc chắn muốn xóa sản phẩm này không ?</p>}
        />
      )}
      {cartLocal.length > 0 ? (
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="shoping__cart__table">
                <table>
                  <thead>
                    <tr>
                      <th className="shoping__product">Sản phẩm</th>
                      <th>Giá</th>
                      <th>Số lượng</th>
                      <th>Tổng Tiền</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {cartLocal.map((item) => {
                      return (
                        <tr>
                          <td className="shoping__cart__item d-flex align-items-center">
                            <img
                              width={100}
                              height={100}
                              style={{ objectFit: "contain", borderRadius: 4 }}
                              src={
                                item?.product?.images?.length > 0
                                  ? item?.product?.images[0].url
                                  : ""
                              }
                              alt=""
                            />

                            <h5>{`${item?.product?.name?.slice(0, 20)}...`}</h5>
                          </td>
                          <td className="shoping__cart__price">
                            {currencyFormatterConfig(item?.product?.price)}
                          </td>
                          <td className="shoping__cart__quantity">
                            <div className="quantity d-flex justify-content-center">
                              <div className="d-flex align-items-center">
                                <div
                                  onClick={() =>
                                    onUpdateQuantity(item?.product?.id, {
                                      quantity: -1,
                                    })
                                  }
                                  className=" cursor-pointer btn btn-info"
                                >
                                  -
                                </div>
                                <div className="mx-3">{item?.quantity}</div>
                                <div
                                  className=" cursor-pointer btn btn-outline-dark"
                                  onClick={() =>
                                    onUpdateQuantity(item?.product?.id, {
                                      quantity: 1,
                                    })
                                  }
                                >
                                  +
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="shoping__cart__total">
                            {currencyFormatterConfig(
                              item?.quantity * item?.product?.price
                            )}
                          </td>
                          <td
                            onClick={() => {
                              setShow(true);
                              setProductId(item?.id);
                            }}
                            className="cursor-pointer"
                          >
                            <div className="btn btn-danger ml-2">X</div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="shoping__cart__btns">
                <Link href={LINK.SHOP} className="primary-btn cart-btn">
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="shoping__continue">
                <div className="shoping__discount">
                  <h5>Mã giảm giá</h5>
                  <form action="#">
                    <input type="text" placeholder="Nhập mã giảm giá" />
                    <button type="submit" className="site-btn">
                      Áp dụng
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="shoping__checkout">
                <h5>Tổng Tiền</h5>
                <ul>
                  <li>
                    Phụ phí <span>{currencyFormatterConfig(0)}</span>
                  </li>
                  <li>
                    Tổng
                    <span>
                      {currencyFormatterConfig(
                        cartLocal.reduce((acc, curr) => {
                          return (acc += curr?.product?.price * curr?.quantity);
                        }, 0)
                      )}
                    </span>
                  </li>
                </ul>
                <a
                  onClick={() => setIsShowInfoForm(true)}
                  className="primary-btn text-white cursor-pointer"
                >
                  Tiến hành đặt hàng
                </a>
              </div>
            </div>
          </div>
          {isShowInfoForm && (
            <div className="mt-5 row ">
              <div className="col-6 ">
                <h3 className="mb-5">2. Hình thức thanh toán</h3>
                <div className="d-flex align-items-center">
                  <div className="form-check mr-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      value={"COD"}
                      name="type"
                      checked={orderInfo?.type === "COD"}
                      id="ra1"
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="ra1">
                      COD
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      checked={orderInfo?.type === "Chuyển khoản"}
                      name="type"
                      id="ra2"
                      value={"Chuyển khoản"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="ra2">
                      Chuyển khoản
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <h3 className="mb-5">1. Thông tin khách hàng</h3>
                <form>
                  <div className="form-group mb-4">
                    <label htmlFor="exampleFormControlInput1">Họ và tên</label>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleFormControlInput1"
                      placeholder="Nhập họ và tên"
                      value={orderInfo?.fullName}
                      onChange={handleChange}
                      name="fullName"
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="exampleFormControlInput2">Email</label>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleFormControlInput2"
                      placeholder="Nhập email"
                      value={orderInfo?.email}
                      onChange={handleChange}
                      name="email"
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="exampleFormControlInput3">
                      Nhập số điện thoại
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="exampleFormControlInput3"
                      placeholder="Nhập số điện thoại"
                      value={orderInfo?.phone}
                      onChange={handleChange}
                      name="phone"
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="exampleFormControlInput4">
                      Nhập địa chỉ
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleFormControlInput4"
                      placeholder="Nhập địa chỉ"
                      value={orderInfo?.address}
                      onChange={handleChange}
                      name="address"
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label htmlFor="exampleFormControlTextarea5">
                      Nhập ghi chú
                    </label>
                    <textarea
                      rows={5}
                      className="form-control"
                      id="exampleFormControlTextarea5"
                      value={orderInfo?.note}
                      onChange={handleChange}
                      name="note"
                    ></textarea>
                  </div>
                </form>
                <a
                  onClick={() => handleOrder()}
                  className="primary-btn text-white cursor-pointer float-right"
                >
                  Gửi đơn hàng
                </a>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="container">
          <div className="row">
            <div className="card-body cart">
              <div className="col-sm-12 empty-cart-cls text-center">
                <img
                  src="https://i.imgur.com/dCdflKN.png"
                  width="130"
                  height="130"
                  className="img-fluid mb-4 mr-3"
                />
                <h3>
                  <strong>Giỏ hàng đang trống.</strong>
                </h3>
                <h4>Tiếp tục mua bạn nhé !</h4>
                <Link
                  href={LINK.SHOP}
                  className="btn btn-success cart-btn-transform m-3"
                  data-abc="true"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  ) : (
    <Spinner isLoading={productLoading} />
  );

  // <div>
  //   <Spinner isLoading={isLoadingDelelete || isLoadingUpdate || isLoadingOrder} />

  //    {showModalConfirm && (
  //     <AppModal
  //       modalIsOpen={showModalConfirm}
  //       closeModal={() => setShowModalConfirm(false)}
  //       onConfirm={() => handleOrder()}
  //       title={`Đặt hàng`}
  //       content={<p>Bạn có chắc chắn muốn đặt hàng không  ?</p>}
  //     />
  //   )}
  //   <div className="hero">
  //     <div className="container">
  //       <div className="row justify-content-between">
  //         <div className="col-lg-7">
  //           <div className="">
  //             <h1>Đây là giỏ hàng của bạn.</h1>
  //           </div>
  //         </div>
  //         <div className="col-lg-5">
  //           <div className="hero-img-wrap">
  //             <img src="images/Hardware.png" className="img-fluid" />
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  //   <div className="ftco-section before-footer-section">
  //     <div className="container">
  //       <div className="row mb-5">
  //         {cart?.length > 0 ? (
  //           <div className="col-md-12">
  //             <div className="site-blocks-table">
  //               <table className="table">
  //                 <thead>
  //                   <tr>
  //                     <th className="product-thumbnail">Ảnh</th>
  //                     <th className="product-name">Tên</th>
  //                     <th className="product-price">Giá</th>
  //                     <th className="product-quantity">Số tiền</th>
  //                     <th className="product-total">Tổng</th>
  //                     <th className="product-remove">Xóa</th>
  //                   </tr>
  //                 </thead>
  //                 <tbody>
  //                   {cart.map((item) => {
  //                     const { id, quantity, product } = item;
  //                     const { price, name } = product;

  //                     return (
  //                       <tr>
  //                         <td className="product-thumbnail">
  //                           <img
  //                             src={product?.images?.length > 0 && product?.images[0]?.url}
  //                             alt="Image"
  //                             className="img-fluid"
  //                           />
  //                         </td>
  //                         <td className="product-name">
  //                           <h2 className="h5 text-black">{name}</h2>
  //                         </td>
  //                         <td>{currencyFormatterConfig(price)}</td>
  //                         <td>
  //                           <div className=" mb-3 d-flex align-items-center justify-content-center">
  //                             <div className="input-group-prepend">
  //                               <button
  //                                 className="btn btn-outline-black border-0 bg-transparent text-black "
  //                                 type="button"
  //                                 onClick={() =>
  //                                   onUpdateQuantity(id, {
  //                                     quantity: quantity - 1,
  //                                   })
  //                                 }
  //                               >
  //                                 −
  //                               </button>
  //                             </div>
  //                             <div className="w-25">
  //                               <input
  //                                 type="text"
  //                                 className="form-control text-center "
  //                                 value={quantity}
  //                               />
  //                             </div>
  //                             <div className="input-group-append">
  //                               <button
  //                                 className="btn btn-outline-black increase border-0 bg-transparent text-black"
  //                                 type="button"
  //                                 onClick={() =>
  //                                   onUpdateQuantity(id, {
  //                                     quantity: quantity + 1,
  //                                   })
  //                                 }
  //                               >
  //                                 +
  //                               </button>
  //                             </div>
  //                           </div>
  //                         </td>
  //                         <td>
  //                           {currencyFormatterConfig(quantity * price)}
  //                         </td>
  //                         <td>
  //                           <Button
  //                             variant="primary"
  //                             onClick={() => {
  //                               setProductId(id);
  //                               setShow(true);
  //                             }}
  //                           >
  //                             Xóa
  //                           </Button>
  //                         </td>
  //                       </tr>
  //                     );
  //                   })}
  //                 </tbody>
  //               </table>
  //             </div>
  //           </div>
  //         ) : (
  //           <h3 className="text-center">
  //             Hiện tại giỏ hàng của bạn đang trống !
  //           </h3>
  //         )}
  //       </div>
  //       {cart?.length > 0 && (
  //         <div className="row">
  //           <div className="col-md-6">
  //             {/* <div className="row mb-5">
  //               <div className="col-md-6 mb-3 mb-md-0">
  //                 <button className="btn btn-black btn-sm btn-block">
  //                   Update Cart
  //                 </button>
  //               </div>
  //               <div className="col-md-6">
  //                 <button className="btn btn-outline-black btn-sm btn-block">
  //                   Continue Shopping
  //                 </button>
  //               </div>
  //             </div>
  //             <div className="row">
  //               <div className="col-md-12">
  //                 <label className="text-black h4" htmlhtmlFor="coupon">
  //                   Coupon
  //                 </label>
  //                 <p>Enter your coupon code if you have one.</p>
  //               </div>
  //               <div className="col-md-8 mb-3 mb-md-0">
  //                 <input
  //                   type="text"
  //                   className="form-control py-3"
  //                   id="coupon"
  //                   placeholder="Coupon Code"
  //                 />
  //               </div>
  //               <div className="col-md-4">
  //                 <button className="btn btn-black">Apply Coupon</button>
  //               </div>
  //             </div> */}
  //           </div>
  //           <div className="col-md-6 pl-5">
  //             <div className="row justify-content-end">
  //               <div className="col-md-7">
  //                 <div className="row">
  //                   <div className="col-md-12 text-right border-bottom mb-5">
  //                     <h3 className="text-black h4 text-uppercase">
  //                       Tổng tiền
  //                     </h3>
  //                   </div>
  //                 </div>

  //                 <div className="row mb-5">
  //                   <div className="col-md-6">
  //                     <span className="text-black">Tổng</span>
  //                   </div>
  //                   <div className="col-md-6 text-right">
  //                     <strong className="text-black">
  //                       {currencyFormatterConfig(cart?.length > 0 &&
  //                         cart?.reduce((acc, curr) => {
  //                           return (acc +=
  //                             curr?.product?.price * curr?.quantity);
  //                         }, 0))}
  //                     </strong>
  //                   </div>
  //                 </div>
  //                 <div className="row">
  //                   <div className="col-md-12">
  //                     <Button
  //                       className="py-3 float-end
  //                     "
  //                       onClick={() => setShowModalConfirm(true)}
  //                     >
  //                       Đặt hàng
  //                     </Button>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // </div>
}
export default CartPage;
