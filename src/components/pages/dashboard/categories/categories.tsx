"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { AppModal } from "~/components/modal/modal";
import { useCategories } from "~/queries";
import { toastConfig, useAppSelector } from "~/lib";
import {
  useCreateCategoriesMutation,
  useDeleteCategoriesMutation,
  useUpdateCategoriesMutation,
} from "~/mutations";
import { formattedDate } from "~/lib/helpers";
import Spinner from "~/components/spinner/spinner";
import PaginationPage from "../../guest/pagination/pagination";
export default function Categories() {
  const [show, setShow] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [categories, setCategories] = useState([]);
  const [categoriesId, setCategoriesId] = useState();

  
  const [category, setCategory] = useState<any>({
    name: "",
  });
  const [active, setActive] = useState(1);
  const step = 8;
  const { data: res, isLoading: isProductLoading } = useCategories();
  const { mutateAsync: create, isLoading: isCreateLoading } =
    useCreateCategoriesMutation();
  const { mutateAsync: del, isLoading: isDeleteLoading } =
    useDeleteCategoriesMutation();
  const { mutateAsync: update, isLoading: isUpdateLoading } =
    useUpdateCategoriesMutation();
  const categoriesData = res?.data;

  const setCategoryInit = () => {
    setCategory({ name: "" });
  };
  const onChangeCategories = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCategory({ [name]: value });
  };
  const handleJump = (number) => {
    setActive(number);
  };
  const handleOnSubmit = () => {
    try {
      for (const key in category) {
        if (Object.prototype.hasOwnProperty.call(category, key)) {
          if (!category[key]) {
            toastConfig(`Tên danh mục không được trống.`);
            return;
          }
        }
      }
      if (!isUpdate) {
        create(category).then(() => {
          setShow(false);
          setCategoryInit();
          toastConfig("Tạo danh mục thành công", { status: "success" });
        });
      } else {
        update({ data: category, id: categoriesId }).then(() => {
          setCategoriesId(null);
          setShow(false);
          setCategoryInit();
          setIsUpdate(false);
          toastConfig("Cập nhật danh mục thành công", { status: "success" });
        });
      }
    } catch (error) {
      toastConfig("Thao tác với danh mục thất bại, quay lại sau 5 phút nữa", {
        status: "error",
      });
    }
  };
  const handleDeleteProduct = () => {
    try {
      del({ id: categoriesId }).then(() => {
        setShowDeleteModal(false);
        setCategoriesId(null);
        toastConfig("Xóa danh mục thành công", { status: "success" });
      });
    } catch (error) {
      toastConfig("Xóa danh mục thất bại, quay lại sau 5 phút nữa", {
        status: "error",
      });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
  };
  useEffect(() => {
    if (categoriesData) {
      setCategories([...categoriesData]);
    }
  }, [categoriesData, categoriesData?.length]);
  return (
    <>
      <Spinner
        isLoading={
          isCreateLoading ||
          isProductLoading ||
          isDeleteLoading ||
          isUpdateLoading
        }
      />
      {show && (
        <AppModal
          title={!isUpdate ? "Thêm danh mục" : "Cập nhật danh mục"}
          onConfirm={() => handleOnSubmit()}
          closeModal={() => {
            setShow(false);
            setCategoryInit();
            setIsUpdate(false);
          }}
          modalIsOpen={show}
          content={
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <form className="forms-sample">
                    <div className="row">
                      <div className="col-lg-12 col-sm-12">
                        <div className="form-group">
                          <label htmlFor="exampleInputName1">
                            Tên danh mục
                          </label>
                          <input
                            onChange={onChangeCategories}
                            type="text"
                            className="form-control"
                            id="exampleInputName1"
                            placeholder="Tên danh mục"
                            name="name"
                            value={category?.name}
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
          title="Xóa danh mục"
          content={<p>Bạn có muốn xóa danh mục không ?</p>}
          closeModal={() => setShowDeleteModal(false)}
          modalIsOpen={showDeleteModal}
          onConfirm={() => handleDeleteProduct()}
        />
      )}
      <Spinner isLoading={false} />

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
                  + Thêm danh mục
                </button>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Danh sách danh mục sản phẩm</h4>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th> ID </th>
                      <th> Tên </th>
                      <th> Ngày tạo</th>
                      <th> Ngày cập nhật </th>
                      <th>Xóa/Cập nhật</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories?.map((cat) => {
                      return (
                        <tr>
                          <td>{cat?.id}</td>
                          <td>{cat?.name}</td>
                          <td className="w-25 cursor-pointer">
                            {formattedDate(cat?.createdAt)}
                          </td>
                          <td>{formattedDate(cat?.updateAt)} </td>
                          <td>
                            <button
                              onClick={() => {
                                setShowDeleteModal(true);
                                setCategoriesId(cat?.id);
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
                                setCategory({ name: cat?.name });
                                setCategoriesId(cat?.id);
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
                <div className="d-flex justify-content-end mt-4">
                  {categoriesData && (
                    <PaginationPage
                      active={active}
                      handleJump={handleJump}
                      length={categories.length}
                      step={step}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
