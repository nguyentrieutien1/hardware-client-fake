import Link from "next/link";
import React from "react";
import { CiAlarmOn, CiInboxOut, CiMedicalCross, CiTextAlignLeft, CiTextAlignRight,  } from "react-icons/ci";
import { LINK } from "~/lib/constants";
import Image from "next/image";
import { useIsUserLogined } from "~/queries";
export default function Sidebar() {
  const {data:res} = useIsUserLogined()
  return (
    <nav className="sidebar sidebar-offcanvas fixed" id="sidebar">
      <ul className="nav">
        <li className="nav-item nav-profile">
          <a href="#" className="nav-link">
            <div className="nav-profile-image">
                <Image src={res?.data?.image?.url} alt={''} width={100} height={100} style={{objectFit: 'cover'}}/>
              <span className="login-status online" />
            </div>
            <div className="nav-profile-text d-flex flex-column">
              <span className="font-weight-bold mb-2">{res?.data?.fullName}</span>
              <span className="text-secondary text-small">{res?.data?.role?.name === 'SUPER_ADMIN' ? 'Quản trị cấp cao' : 'Nhân viên'}</span>
            </div>
            <i className="mdi mdi-bookmark-check text-success nav-profile-badge" />
          </a>
        </li>
        <li className="nav-item">
          <Link className="nav-link" href={LINK.DASHBOARD} prefetch>
            <span className="menu-title">Trang chủ</span>
            <i className="mdi mdi-home menu-icon" />
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link d-flex align-items-center justify-content-between" href={LINK.DASHBOARD_PRODUCT} prefetch>
            <span className="menu-title">Quản lý sản phẩm</span>
            <CiMedicalCross />
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link d-flex align-items-center justify-content-between" href={LINK.DASHBOARD_ORDER} prefetch>
            <span className="menu-title">Quản lý đơn đặt hàng</span>
            <CiInboxOut />
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link d-flex align-items-center justify-content-between" href={LINK.DASHBOARD_CATEGORIES} prefetch>
            <span className="menu-title">Quản lý danh mục</span>
            <CiTextAlignRight />
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link d-flex align-items-center justify-content-between" href={LINK.DASHBOARD_POST} prefetch>
            <span className="menu-title">Quản lý bài viết</span>
            <CiTextAlignLeft />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
