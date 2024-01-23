"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "./post.css";

// import required modules
import { EffectCoverflow, Pagination } from "swiper/modules";
import { useGetPosts } from "~/queries";
import Link from "next/link";
import { LINK } from "~/lib/constants";
export default function Post() {
  const { data: posts } = useGetPosts();
  return (
    posts?.data?.length ? <div className="container">
    <Swiper
      effect={"coverflow"}
      slidesPerView={3}
      loop={true}
      autoplay={true}
      pagination={true}
      allowSlideNext={true}
      allowTouchMove={true}
      modules={[EffectCoverflow, Pagination]}
    >
      {posts?.data?.map((post) => {
        return (
          <SwiperSlide>
            <Link href={`${LINK.POST_DETAIL}/${post?.id}`} className="z-3">
              <h4 className="text-center">{post?.title}</h4>
            </Link>
            <img src={post?.images?.length > 0 ? post?.images[0]?.url : ""} />
          </SwiperSlide>
        );
      })}
    </Swiper>
  </div> : <h5 className="text-center">Hiện tại chưa có bài viết nào</h5>
  );
}
