"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { ORDER_MESSAGE, ORDER_STATUS } from "~/lib/constants";
import { formattedDate } from "~/lib/helpers";
import { currencyFormatterConfig } from "~/lib/helpers/currency-formatter";
import { useGetOrders } from "~/queries/order/get-orders-query";
import Tippy from "@tippyjs/react";
import { useUpdateOrderMutation } from "~/mutations/order/update-order-mutation";
import Spinner from "~/components/spinner/spinner";
import PaginationPage from "../../guest/pagination/pagination";
export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [active, setActive] = useState(1);
  const step = 8;
  const { data: res, isLoading: isGetOrdersLoading } = useGetOrders();
  const { mutateAsync, isLoading } = useUpdateOrderMutation();
  const handleAcceptOrder = (orderId, statusId) => {
    mutateAsync({ id: orderId, data: { statusId } });
  };
  const handleJump = (number) => {
    setActive(number);
  };
  useEffect(() => {
    if (res?.data) {
      setOrders(res?.data);
    }
  }, [res?.data]);
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (value) {
      setOrders(
        [...res?.data].filter((order) => order?.status?.name === value)
      );
    } else {
      setOrders(res?.data);
    }
  };
  return (
    <div className="content-wrapper">
      <Spinner isLoading={isLoading || isGetOrdersLoading} />
      <div className="col-2 mb-3">
        <div className="">
          <label htmlFor="" className="form-label">
            Lọc đơn hàng
          </label>
          <select
            onChange={handleChange}
            className="form-select  form-select-sm p-2 border-0"
          >
            <option value={""} selected>
              Tất cả đơn hàng
            </option>
            <option value={ORDER_STATUS.ACCEPTED}>Đơn hàng đã duyệt</option>
            <option value={ORDER_STATUS.PENDING}>Đơn hàng chờ phê duyệt</option>
            <option value={ORDER_STATUS.CANCELED}>Đơn hàng đã hủy</option>
            <option value={ORDER_STATUS.REJECT}>Đơn hàng đóng phê duyệt</option>
          </select>
        </div>
      </div>
      {orders.length > 0 ? (
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Danh sách đặt hàng</h4>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th> Tên hàng </th>
                      <th> Ngày đặt </th>
                      <th> Người đặt</th>
                      <th> Số lượng</th>
                      <th> Trạng thái đặt hàng</th>
                      <th> Giá</th>
                      <th> Tổng số tiền </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      return (
                        <tr className="cursor-pointer">
                          <td>{order?.product?.name}</td>
                          <td> {formattedDate(order?.createdAt)}</td>
                          <td>{order?.account?.fullName}</td>
                          <td> {order?.quantity}</td>
                          <td>
                            <Tippy
                              trigger="click"
                              placement="right-start"
                              theme="light"
                              interactive={true}
                              content={
                                order?.status?.name !==
                                ORDER_STATUS.CANCELED ? (
                                  <div className="d-flex flex-column">
                                    {order?.status?.name ===
                                    ORDER_STATUS.PENDING ? (
                                      <div
                                        onClick={() =>
                                          handleAcceptOrder(order?.id, 7)
                                        }
                                        className="badge badge-gradient-success text-center cursor-pointer"
                                      >
                                        {}
                                        Phê duyệt
                                      </div>
                                    ) : (
                                      <div
                                        onClick={() =>
                                          handleAcceptOrder(order?.id, 1)
                                        }
                                        className="badge badge-gradient-info text-center cursor-pointer"
                                      >
                                        Thu hồi phê duyệt
                                      </div>
                                    )}

                                    {order?.status?.name !==
                                      ORDER_STATUS.REJECT && (
                                      <div
                                        onClick={() =>
                                          handleAcceptOrder(order?.id, 2)
                                        }
                                        className="badge badge-gradient-danger text-center cursor-pointer mt-2"
                                      >
                                        Từ chối
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div
                                    onClick={() =>
                                      handleAcceptOrder(order?.id, 1)
                                    }
                                    className="badge badge-gradient-danger text-center cursor-pointer"
                                  >
                                    Kích hoạt đơn hàng
                                  </div>
                                )
                              }
                              zIndex={2}
                              allowHTML={true}
                              arrow={false}
                            >
                              <label
                                className={`cursor-pointer badge badge-gradient-${
                                  order?.status?.name === ORDER_STATUS.PENDING
                                    ? "success"
                                    : order?.status?.name ===
                                      ORDER_STATUS.CANCELED
                                    ? "danger"
                                    : order?.status?.name ===
                                      ORDER_STATUS.REJECT
                                    ? "primary"
                                    : "warning"
                                }`}
                              >
                                {order?.status?.name === ORDER_STATUS.PENDING
                                  ? ORDER_MESSAGE.PENDING
                                  : order?.status?.name ===
                                    ORDER_STATUS.CANCELED
                                  ? ORDER_MESSAGE.CANCELED
                                  : order?.status?.name === ORDER_STATUS.REJECT
                                  ? ORDER_MESSAGE.REJECT
                                  : ORDER_MESSAGE.ACCEPTED}
                              </label>
                            </Tippy>
                          </td>
                          <td>
                            {currencyFormatterConfig(order?.product?.price)}
                          </td>
                          <td>
                            {currencyFormatterConfig(
                              order?.product?.price * order?.quantity
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="d-flex justify-content-end mt-4">
                  {res?.data && (
                    <PaginationPage
                      active={active}
                      handleJump={handleJump}
                      length={orders.length}
                      step={step}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h3 className="text-center">Hiện chưa có đơn hàng mà bạn muốn tìm.</h3>
      )}
    </div>
  );
}
