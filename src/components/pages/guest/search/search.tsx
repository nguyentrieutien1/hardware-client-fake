import Link from "next/link";
import React from "react";
import { LINK } from "~/lib/constants";
interface SearchProps {
    isShowBanner?: any
}
export default function Search(props: SearchProps) {
    const {isShowBanner} = props
  return (
    <div className="col-lg-9 col-sm-12 p-0">
      <div className="hero__search d-flex" style={{ paddingLeft: "10px" }}>
        <div className="hero__search__form col-lg-9 col-sm-12">
          <form action="#" className=" justify-content-center m-auto">
            <div className="hero__search__categories">
              All Categories
              <span className="arrow_carrot-down" />
            </div>
            <input type="text" placeholder="What do yo u need?" />
            <button type="submit" className="site-btn">
              SEARCH
            </button>
          </form>
        </div>
        <div className="d-none d-lg-block col-lg-3 p-0 ml-1">
          <div className="hero__search__phone">
            <div className="hero__search__phone__icon">
              <i className="fa fa-phone" />
            </div>
            <div className="hero__search__phone__text">
              <h5>+84 983787454</h5>
              <span>Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>
      </div>
      {isShowBanner && <div
        className="hero__item set-bg row "
        data-setbg="images/bowl-2.png"
        style={{ paddingLeft: "10px" }}
      >
        <div className="hero__text col-lg-6 col-md-12 text-center text-lg-left ">
          <p className="">Chuyên mua bán và sửa chữa phần cứng</p>
          <h2 className="">
            Dịch vụ tốt <br />
            nhất
          </h2>
          <p className="">cho thiết bị của bạn!</p>
          <Link href={LINK.SHOP} className="primary-btn mb-3 ">
            Mua ngay
          </Link>
        </div>
        <div className="col-12 col-md-12 col-lg-6 justify-content-center d-flex">
          <img
            className=""
            src="https://previews.123rf.com/images/trodler/trodler1701/trodler170100003/72181166-pc-hardware-components-isolated-on-white-3d-rendering.jpg"
            width={300}
          />
        </div>
      </div>}
    </div>
  );
}
