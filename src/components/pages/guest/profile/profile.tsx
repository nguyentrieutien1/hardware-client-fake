import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import "./profile.css";
import { useIsUserLogined } from "~/queries";
import ReactImageUploading from "react-images-uploading";
interface ProfileProps {
  setAccount: Dispatch<SetStateAction<any>>;
  account: any;
}
export default function Profile(props: ProfileProps) {
  const { setAccount, account } = props;
  const [images, setImages] = useState([]);
  const { data: res } = useIsUserLogined();
  const onChangeImages = (images) => {
    setImages(images);
    setAccount((prev) => {
      return {
        ...prev,
        images: images[0].data_url,
      };
    });
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAccount((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  useEffect(() => {
    if (res?.data) {
      setAccount({ ...res?.data });
      console.log(res?.data);
      
      setImages([{ data_url: res?.data?.image?.url }]);
    }
  }, [res?.data]);
  return (
    <div>
      <div className="container">
        <div className="row profile">
          <div className="text-center d-flex justify-content-center">
            <div className="profile-sidebar">
              {/* SIDEBAR USERPIC */}
              <div className="profile-userpic">
                <ReactImageUploading
                  value={images}
                  multiple={false}
                  onChange={onChangeImages}
                  maxNumber={69}
                  dataURLKey="data_url"
                >
                  {({ imageList, onImageUpload, isDragging, dragProps }) => (
                    // write your building UI
                    <div className="upload__image-wrapper">
                      <div
                        style={isDragging ? { color: "red" } : undefined}
                        onClick={(e) => {
                          e.preventDefault();
                          onImageUpload();
                        }}
                        {...dragProps}
                      >
                        <img
                          style={{
                            width: "200px",
                            height: "200px",
                            objectFit: "cover",
                          }}
                          src={
                            images?.length > 0
                              ? images[0]?.data_url
                              : "https://japans.vn/wp-content/uploads/2023/07/avt-anh-gai-xinh-1.jpg "
                          }
                          className="img-responsive rounded-circle object-fit-contain icon-link-hover "
                        />
                      </div>
                    </div>
                  )}
                </ReactImageUploading>
              </div>
              <div className="profile-usertitle">
                <div className="profile-usertitle-name">
                <input
                      type="text"
                      className="form-control small border-0 bg-transparent text-center "
                      aria-describedby="helpId"
                      value={account?.fullName}
                      name="fullName"
                      onChange={handleChange}
                    />
                </div>
                <div className="profile-usertitle-job">Developer</div>
              </div>
              <div className="profile-userbuttons"></div>
              <div className="profile-usermenu">
                <ul className="nav flex-column">
                  <li className="active d-flex align-items-center  mb-1">
                    <p className="w-100 m-0">Email :</p>
                    <input
                      type="text"
                      className="form-control small border-0 bg-transparent "
                      aria-describedby="helpId"
                      value={account?.email}
                      name="email"
                      onChange={handleChange}
                    />
                  </li>
                  <li className="active d-flex align-items-center  mb-1">
                    <p className="w-100 m-0">Số điện thoại :</p>
                    <input
                      type="number"
                      className="form-control small border-0 bg-transparent "
                      aria-describedby="helpId"
                      value={account?.phone}
                      name="phone"
                      onChange={handleChange}
                    />
                  </li>
                  <li className="active d-flex align-items-center  mb-1">
                    <p className="w-100 m-0">Ngày sinh :</p>
                    <input
                      type="date"
                      className="form-control small border-0 bg-transparent "
                      aria-describedby="helpId"
                      value={account?.birthday}
                      name="birthday"
                      onChange={handleChange}
                    />
                  </li>
                  <li className="active d-flex align-items-center  mb-1">
                    <p className="w-100 m-0">Địa chỉ :</p>
                    <input
                      type="text"
                      className="form-control small border-0 bg-transparent "
                      aria-describedby="helpId"
                      value={account?.address}
                      name="address"
                      onChange={handleChange}
                    />
                  </li>
                  <li className="active d-flex align-items-center  mb-1">
                    <p className="w-100 m-0">Giới tính :</p>
                    <select
                        className="form-select form-select-sm border-0"
                        name="sex"
                        onChange={handleChange}
                      >
                        <option selected={res?.data?.sex === 'male'} value="male">Nam</option>
                        <option selected={res?.data?.sex === 'female'} value="female">Nữ</option>
                      </select>
                    
                  </li>
                </ul>
              </div>
              {/* END MENU */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
