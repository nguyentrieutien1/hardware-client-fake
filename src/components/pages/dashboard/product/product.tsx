"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { AppModal } from "~/components/modal/modal";
import { useCategories, useGetProducts } from "~/queries";
import ImageUploading from "react-images-uploading";
import { IProduct } from "~/types";
import { axiosConfig, toastConfig } from "~/lib";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from "~/mutations";
import { currencyFormatterConfig } from "~/lib/helpers/currency-formatter";
import { toastErrorAuthen } from "~/lib/helpers";
import Tippy from "@tippyjs/react";
import Spinner from "~/components/spinner/spinner";
import PaginationPage from "../../guest/pagination/pagination";
import axios from "axios";
import { headers } from "next/headers";
export default function ProductPage() {
  const [show, setShow] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [active, setActive] = useState(1);
  const [images, setImages] = useState([]);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [productList, setProductList] = useState([]);
  const [product, setProduct] = useState<any>({
    name: "",
    stock: 1,
    price: null,
    description: "",
    id: null,
    categoriesId: null,
  });
  const { data: res, isLoading: isProductLoading } = useGetProducts();
  const products = res?.data;
  const step = 8;
  const { mutateAsync: createProduct, isLoading: isCreateLoading } =
    useCreateProductMutation();
  const { mutateAsync: updateProduct, isLoading: isUpdateLoading } =
    useUpdateProductMutation();
  const { mutateAsync: deleteProduct, isLoading: isDeleteLoading } =
    useDeleteProductMutation();
  const { data: categories } = useCategories();

  const setProductInit = () => {
    setProduct({ name: "", stock: 1, price: null, description: "", id: null });
  };
  const onChangeImages = (imageList) => {
    console.log(imageList);

    setImages(imageList);
  };
  const onChangeProduct = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "price" || name === "stock") {
      if (value.length > 9) {
        toastConfig(
          `Vui lòng nhập đúng số ${name === "price" ? "tiền" : "lượng"}`
        );
        return;
      }
    }
    setProduct((prev) => {
      return {
        ...prev,
        [name]:
          name === "price" || name === "stock" || name === "categoriesId"
            ? +value
            : value,
      };
    });
  };
  const handleOnSubmit = async () => {
    for (const key in product) {
      if (Object.prototype.hasOwnProperty.call(product, key)) {
        if (!product[key] && key !== "id") {
          toastConfig(`Các trường phải đảm bảo không được trống.`);
          return;
        }
      }
    }
    if (!isUpdate) {
      delete product.id;
      const formData = new FormData();
      images?.forEach((img, index) => {
        formData.append(`file`, img.file);
      });
      const res = await axiosConfig.post("/upload", formData);
      createProduct({
        ...product,
        images: res.data?.map((d) => {
          return {
            name: d.originalname,
            url: d.url,
            size: d.size,
            type: d.type,
          };
        }),
      })
        .then((res) => {
          setShow(false);
          setProductInit();
          toastConfig("Tạo sản phẩm thành công !", { status: "success" });
          setImages([]);
        })
        .catch((err) => {
          toastErrorAuthen(err, "Tạo sản phẩm");
        });
    } else {
      const newImages = [];
      for (let i = 0; i < images.length; i++) {
        if (images[i]?.file) {
          const formData = new FormData();
          formData.append(`file`, images[i]?.file);
          const res = await axiosConfig.post("/upload", formData);
          newImages.push(res.data[0]);
        } else {
          newImages.push(images[i]);
        }
      }
      updateProduct({
        ...product,
        images: newImages,
      }).then(() => {
        setShow(false);
        setIsUpdate(false);
        setProductInit();
        toastConfig("Cập nhật sản phẩm thành công !", { status: "success" });
        setImages([]);
      });
    }
  };
  const handleDeleteProduct = () => {
    try {
      deleteProduct({ id: product.id }).then(() => {
        setProductInit();
        setShowDeleteModal(false);
        toastConfig("Xóa sản phẩm thành công !", { status: "success" });
      });
    } catch (error) {}
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const product = [...products].filter((product) =>
      product?.name?.toLowerCase()?.includes(value?.toLowerCase())
    );
    setProductList([...product]);
  };
  const handleJump = (number) => {
    setActive(number);
  };
  useEffect(() => {
    if (products) {
      setProductList([...products]);
    }
  }, [products?.length, products]);
  return (
    <>
      {show && (
        <AppModal
          size="lg"
          title={!isUpdate ? "Thêm sản phẩm" : "Cập nhật sản phẩm"}
          onConfirm={() => handleOnSubmit()}
          closeModal={() => {
            setShow(false);
            setProductInit();
            setIsUpdate(false);
            setImages([]);
          }}
          modalIsOpen={show}
          content={
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <form className="forms-sample">
                    <div className="row">
                      <div className="col-lg-6 col-sm-12">
                        <div className="form-group">
                          <label htmlFor="exampleInputName1">
                            Tên sản phẩm
                          </label>
                          <input
                            onChange={onChangeProduct}
                            type="text"
                            className="form-control"
                            id="exampleInputName1"
                            placeholder="Tên sản phẩm"
                            name="name"
                            value={product?.name}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail3">
                            Số lượng sản phẩm
                          </label>
                          <input
                            onChange={onChangeProduct}
                            type="number"
                            name="stock"
                            className="form-control"
                            id="exampleInputEmail3"
                            placeholder="Số lượng sản phẩm"
                            value={product?.stock}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputPassword4">Giá</label>
                          <input
                            onChange={onChangeProduct}
                            type="number"
                            name="price"
                            className="form-control"
                            id="exampleInputPassword4"
                            placeholder="Giá"
                            value={product?.price}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputPassword5">
                            Danh mục
                          </label>
                          <div className="mb-3">
                            <select
                              className="form-select form-group form-select-sm p-2"
                              name="categoriesId"
                              onChange={onChangeProduct}
                              id="exampleInputPassword5"
                            >
                              <option>chọn danh mục</option>
                              {categories.data?.map((cat) => {
                                return (
                                  <option
                                    selected={product?.categoriesId == cat?.id}
                                    value={cat?.id}
                                  >
                                    {cat?.name}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-sm-12">
                        <label className="mb-2" htmlFor="">
                          Hình ảnh
                        </label>
                        <ImageUploading
                          multiple
                          value={images}
                          onChange={onChangeImages}
                          maxNumber={69}
                          dataURLKey="url"
                        >
                          {({
                            imageList,
                            onImageUpload,
                            onImageRemoveAll,
                            onImageUpdate,
                            onImageRemove,
                            isDragging,
                            dragProps,
                          }) => (
                            // write your building UI
                            <div className="upload__image-wrapper">
                              <button
                                className="btn btn-success btn-sm"
                                type="button"
                                style={
                                  isDragging ? { color: "red" } : undefined
                                }
                                onClick={(e) => {
                                  e.preventDefault();
                                  onImageUpload();
                                }}
                                {...dragProps}
                              >
                                Nhấn chọn hoặc kéo thả tại đây
                              </button>
                              &nbsp;
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  onImageRemoveAll();
                                }}
                              >
                                Xóa tất cả cá ảnh
                              </button>
                              <div className="my-2 d-flex align-items-center row">
                                {imageList.map((image, index) => (
                                  <div
                                    key={index}
                                    className=" image-item d-flex flex-column align-items-center justify-content-between col-3 flex-md-wrap"
                                  >
                                    <img
                                      src={image["url"]}
                                      width="100"
                                      className="rounded"
                                      height="100"
                                      style={{ objectFit: "contain" }}
                                    />
                                    <div className="image-item__btn-wrapper my-2 d-flex align-content-center">
                                      <button
                                        className="btn btn-sm btn-success mx-1"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          onImageUpdate(index);
                                        }}
                                      >
                                        Đổi
                                      </button>
                                      <button
                                        className="btn btn-sm btn-warning"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          onImageRemove(index);
                                        }}
                                      >
                                        Xóa
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </ImageUploading>
                        <div className="form-group">
                          <label htmlFor="exampleTextarea1">
                            Mô tả sản phẩm
                          </label>
                          <textarea
                            onChange={onChangeProduct}
                            className="form-control"
                            id="exampleTextarea1"
                            name="description"
                            rows={6}
                            defaultValue={""}
                            placeholder="Mô tả sản phẩm"
                            value={product?.description}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          }
        />
      )}
      {showDeleteModal && (
        <AppModal
          title="Xóa sản phẩm"
          content={<p>Bạn có muốn xóa sản phẩm này không ?</p>}
          closeModal={() => setShowDeleteModal(false)}
          modalIsOpen={showDeleteModal}
          onConfirm={() => handleDeleteProduct()}
        />
      )}
      <Spinner
        isLoading={
          isDeleteLoading ||
          isCreateLoading ||
          isUpdateLoading ||
          isProductLoading
        }
      />

      <div className="row content-wrapper">
        <div className="col-12 ">
          <div className="row mb-2 justify-content-between d-flex ">
            <div className="col-2 ">
              <div className="d-grid gap-2">
                <button
                  onClick={() => setShow(true)}
                  type="button"
                  className="btn btn-success p-2"
                >
                  + Thêm sản phẩm
                </button>
              </div>
            </div>
            <div className="col-5">
              <input
                type="text"
                className="form-control"
                onChange={handleChange}
                aria-describedby="helpId"
                placeholder="Tìm kiếm sản phẩm theo tên"
              />
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Danh sách sản phẩm</h4>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th> Ảnh </th>
                      <th> Tên </th>
                      <th> Mô tả </th>
                      <th> Số lượng trong kho </th>
                      <th> Giá </th>
                      <th>Xóa/Cập nhật</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productList
                      ?.slice(step * active - step, step * active)
                      .map((product) => {
                        return (
                          <tr>
                            <td>
                              <img
                                src={
                                  product?.images?.length > 0 &&
                                  product?.images[0]?.url
                                }
                                className="me-1 rounded"
                                style={{objectFit: 'contain'}}
                                alt="image"
                              />
                            </td>
                            <td>{product?.name?.slice(0, 20)}...</td>
                            <td className="w-25 cursor-pointer">
                              <Tippy
                                allowHTML={true}
                                content={<div>{product?.description}</div>}
                                arrow={true}
                                placement="right"
                              >
                                <div
                                  style={{
                                    width: "200px",
                                    whiteSpace: "break-spaces",
                                  }}
                                >
                                  {product?.description?.slice(0, 20)}...
                                </div>
                              </Tippy>
                            </td>
                            <td>{product?.stock} </td>
                            <td>{currencyFormatterConfig(product?.price)}</td>
                            <td>
                              <button
                                onClick={() => {
                                  setShowDeleteModal(true);
                                  setProduct({
                                    id: product?.id,
                                    description: "",
                                    name: "",
                                    price: null,
                                    stock: null,
                                  });
                                }}
                                type="button"
                                className="btn btn-danger btn-sm"
                              >
                                Xóa
                              </button>
                              <button
                                onClick={() => {
                                  setIsUpdate(true);
                                  setShow(true);
                                  setProduct({
                                    description: product?.description,
                                    name: product?.name,
                                    price: product?.price,
                                    stock: product?.stock,
                                    id: product?.id,
                                    categoriesId: product?.categoriesId,
                                  });
                                  console.log(product?.images);
                                  setImages(product?.images);
                                }}
                                type="button"
                                className="btn btn-success btn-sm m-lg-1"
                              >
                                Cập nhật
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-end mt-4">
                {products && (
                  <PaginationPage
                    active={active}
                    handleJump={handleJump}
                    length={productList.length}
                    step={step}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
