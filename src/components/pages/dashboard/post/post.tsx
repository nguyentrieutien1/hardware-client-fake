"use client";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { AppModal } from "~/components/modal/modal";
import { useGetPosts, useIsUserLogined } from "~/queries";
import { DOMFormatter, axiosConfig, toastConfig } from "~/lib";
import { Editor, EditorTools } from "@progress/kendo-react-editor";
import ImageUploading from "react-images-uploading";
import { useCreatePostMutation } from "~/mutations";
import { formattedDate, toastErrorAuthen } from "~/lib/helpers";
import Tippy from "@tippyjs/react";
import Spinner from "~/components/spinner/spinner";
import "@progress/kendo-theme-default/dist/all.css";
import { useDeletePostMutation } from "~/mutations/post/delete-post-mutation";
import { useUpdatePostMutation } from "~/mutations/post/update-post-mutation";
import PaginationPage from "../../guest/pagination/pagination";
export default function Post() {
  const [show, setShow] = useState<boolean>(false);
  const [showUrl, setShowUrl] = useState<boolean>(false);
  const [url, setUrl] = useState("");
  const textRef = useRef<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [post, setPost] = useState<any>({ title: "", content: "" });
  const [images, setImages] = useState([]);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [postList, setPostList] = useState<any>([]);
  const [postId, setPostId] = useState<any>();
  const [selectedFile, setSelectedFile] = useState(null);
  const [active, setActive] = useState(1);
  const step = 8;
  const { data: res, isLoading: isPostLoading } = useGetPosts();
  const posts = res?.data;
  const { mutateAsync: createPost, isLoading: isCreatePostLoading } =
    useCreatePostMutation();
  const { mutateAsync: updatePost, isLoading: isUpdateLoading } =
    useUpdatePostMutation();
  const { mutateAsync: deletePost, isLoading: isDeleteLoading } =
    useDeletePostMutation();
  const { data: account } = useIsUserLogined();
  const {
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignRight,
    AlignCenter,
    Indent,
    Outdent,
    OrderedList,
    UnorderedList,
    Undo,
    Redo,
    Link,
    Unlink,
    InsertImage,
  } = EditorTools;

  const setPostInit = () => {
    setPost({ title: "", content: "" });
  };
  const onChangeImages = (imageList: any) => {
    setImages(imageList);
  };
  useEffect(() => {
    const siblingElements: any = document.querySelector(".k-editor-content");
    if (siblingElements) {
      siblingElements.nextElementSibling.style.backgroundImage = "none";
    }
  });

  const handleCreatePost = () => {
    for (const key in post) {
      if (Object.prototype.hasOwnProperty.call(post, key)) {
        if (!post[key]) {
          toastConfig(`Các trường phải đảm bảo không được trống !`);
          return;
        }
      }
    }
    if (!isUpdate) {
      createPost({ ...post, accountId: account?.data?.id, images })
        .then((res) => {
          setShow(false);
          setPostInit();
          toastConfig("Tạo bài viết thành công !", { status: "success" });
          setImages([]);
        })
        .catch((err) => {
          toastErrorAuthen(err, "Tạo bài viết");
        });
    } else {
      updatePost({
        id: postId,
        data: {
          ...post,
          images: images.map((image: any) => {
            return { url: image.data_url };
          }),
        },
      }).then(() => {
        setShow(false);
        setIsUpdate(false);
        setPostInit();
        toastConfig("Cập nhật bài viết thành công !", { status: "success" });
        setImages([]);
      });
    }
  };
  const handleDeletePost = () => {
    try {
      deletePost({ id: postId }).then(() => {
        setPostInit();
        setShowDeleteModal(false);
        setPostId(null);
        toastConfig("Xóa bài viết thành công !", { status: "success" });
      });
    } catch (error) {}
  };

  useEffect(() => {
    if (posts) {
      setPostList([...posts]);
    }
  }, [posts?.length, posts]);

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleJump = (number: any) => {
    setActive(number);
  };

  const handleCopy = () => {
    if (textRef.current) {
      const textToCopy = textRef.current.textContent;
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          toastConfig("Sao chép thành công", { status: "success" });
        })
        .catch((error) => {
          console.error("Failed to copy text to clipboard:", error);
        });
    }
  };
  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("upload", selectedFile);
      axiosConfig
        .post("/upload", formData)
        .then((res) => res.data)
        .then((result) => {
          setUrl(result);
          setShowUrl(true);
        })
        .catch(() => {
          toastConfig("Lỗi file, vui lòng chọn file ảnh khác !", {
            status: "error",
          });
        });
    }
  };

  return (
    <div className="content-wrapper">
      {showUrl && (
        <AppModal
          closeModal={() => setShowUrl(false)}
          content={
            <div>
              <div ref={textRef}>{url}</div>
              <a
                onClick={() => handleCopy()}
                className="btn btn-success btn-md mt-4"
                href="#"
                role="button"
              >
                Sao chép nội dung
              </a>
            </div>
          }
          onConfirm={() => {
            setShowUrl(false);
            setSelectedFile(null);
          }}
          modalIsOpen={showUrl}
          title="Đây là đường dẫn ảnh"
        />
      )}
      {show ? (
        <div className="card">
          <div className="card-body">
            <form className="forms-sample">
              <div className="row">
                <div className="form-group col-lg-4 col-sm-6">
                  <label htmlFor="exampleInputName1">Tiêu đề</label>
                  <input
                    onChange={(event) => {
                      setPost((prev: any) => {
                        return {
                          ...prev,
                          title: event.target.value,
                        };
                      });
                    }}
                    type="text"
                    className="form-control"
                    id="exampleInputName1"
                    placeholder="Tiêu đề"
                    name="title"
                    value={post.title}
                  />
                </div>
                <div className="col-4">
                  <div className="">
                    <label
                      htmlFor="upload"
                      className="form-label d-block cursor-pointer"
                    >
                      Nhấn vào đây để lấy đường dẫn ảnh
                    </label>
                    <input
                      onChange={handleFileChange}
                      type="file"
                      aria-describedby="helpId"
                      placeholder=""
                      id="upload"
                      className="d-block my-2 d-none"
                    />
                    {selectedFile && (
                      <a
                        onClick={handleUpload}
                        className="btn btn-success btn-md"
                        href="#"
                        role="button"
                      >
                        Lấy đường dẫn
                      </a>
                    )}
                  </div>
                </div>
                <div className="col-lg-4 col-sm-12">
                  <label className="mb-2" htmlFor="">
                    Hình ảnh
                  </label>
                  <ImageUploading
                    multiple
                    value={images}
                    onChange={onChangeImages}
                    maxNumber={69}
                    dataURLKey="data_url"
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
                          style={isDragging ? { color: "red" } : undefined}
                          onClick={(e) => {
                            e.preventDefault();
                            onImageUpload();
                          }}
                          {...dragProps}
                        >
                          Nhấn chọn hoặc kéo thả tại đây
                        </button>
                        &nbsp;
                        {images.length > 0 && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={(e) => {
                              e.preventDefault();
                              onImageRemoveAll();
                            }}
                          >
                            Xóa tất cả cá ảnh
                          </button>
                        )}
                        <div className="my-2 d-flex align-items-center row">
                          {imageList.map((image, index) => (
                            <div
                              key={index}
                              className=" image-item d-flex flex-column align-items-center justify-content-between col-3 flex-md-wrap"
                            >
                              <img
                                src={image["data_url"]}
                                width="100"
                                className="rounded"
                                height="100"
                                style={{ objectFit: "cover" }}
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
                </div>
                <div className="col-lg-12 col-sm-12">
                  <div className="">
                    <label htmlFor="exampleTextarea1">Mô tả bài viết</label>
                    <Editor
                      tools={[
                        [Bold, Italic, Underline],
                        [Undo, Redo],
                        [InsertImage],
                      ]}
                      defaultContent={post.content}
                      onChange={(event) => {
                        setPost((prev: any) => {
                          return {
                            ...prev,
                            content: event.html,
                          };
                        });
                      }}
                      value={post.content}
                      contentStyle={{ height: 430, width: "100%" }}
                    />
                  </div>
                </div>
              </div>
            </form>
            <div className="d-flex justify-content-end">
              <a
                onClick={() => {
                  setIsUpdate(false);
                  setShow(false);
                  setPostInit();
                  setImages([]);
                }}
                className="btn btn-danger btn-md mt-2 align-items"
                href="#"
                role="button"
              >
                {"Đóng"}
              </a>
              <a
                onClick={() => handleCreatePost()}
                className="btn btn-success btn-md mt-2 align-items mx-2"
                href="#"
                role="button"
              >
                {isUpdate ? "Cập nhật bài viết" : "Tạo bài viết"}
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="col-12">
          <div className="row">
            <div className="col-12 ">
              <div className="row mb-2 justify-content-between d-flex ">
                <div className="col-2 ">
                  <div className="d-grid gap-2">
                    <button
                      onClick={() => setShow(true)}
                      type="button"
                      className="btn btn-success p-2"
                    >
                      + Thêm bài viết
                    </button>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Danh sách bài viết</h4>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th> Ảnh </th>
                          <th> Người tạo </th>
                          <th> Tiêu đề </th>
                          <th> Nội dung </th>
                          <th> Ngày tạo </th>
                          <th>Xóa/Cập nhật</th>
                        </tr>
                      </thead>
                      <tbody>
                        {postList?.map((post: any) => {
                          return (
                            <tr>
                              <td>
                                <img
                                  src={
                                    post?.images?.length > 0 &&
                                    post?.images[0]?.url
                                  }
                                  className="me-1 rounded"
                                  alt=""
                                />
                              </td>
                              <td>{post?.account?.fullName}</td>
                              <td>{post?.title.slice(0, 10)}...</td>
                              <td className="cursor-pointer">
                                <Tippy
                                  placement="right"
                                  className="bg-light"
                                  trigger="click"
                                  maxWidth={500}
                                  allowHTML={true}
                                  arrow={false}
                                  content={
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: DOMFormatter(post?.content),
                                      }}
                                    ></div>
                                  }
                                >
                                  <div>
                                    <button
                                      type="button"
                                      className="btn btn-success btn-md"
                                    >
                                      Nhấp vào đây để xem chi tiết
                                    </button>
                                  </div>
                                </Tippy>
                              </td>
                              <td>{formattedDate(post?.createdAt)}</td>
                              <td>
                                <button
                                  onClick={() => {
                                    setShowDeleteModal(true);
                                    setPostId(post?.id);
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
                                    setPost({
                                      content: post?.content,
                                      title: post?.title,
                                    });
                                    setPostId(post?.id);
                                    setImages(
                                      post?.images.map((image: any) => {
                                        return {
                                          data_url: image.url,
                                        };
                                      })
                                    );
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
                      {posts && (
                        <PaginationPage
                          active={active}
                          handleJump={handleJump}
                          length={postList.length}
                          step={step}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <AppModal
          title="Xóa bài viết"
          content={<p>Bạn có muốn xóa bài viết này không ?</p>}
          closeModal={() => setShowDeleteModal(false)}
          modalIsOpen={showDeleteModal}
          onConfirm={() => handleDeletePost()}
        />
      )}
      <Spinner
        isLoading={
          isDeleteLoading ||
          isCreatePostLoading ||
          isUpdateLoading ||
          isPostLoading
        }
      />
    </div>
  );
}
