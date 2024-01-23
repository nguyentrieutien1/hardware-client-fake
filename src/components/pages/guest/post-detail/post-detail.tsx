"use client";
import { useParams } from "next/navigation";
import React from "react";
import Spinner from "~/components/spinner/spinner";
import { DOMFormatter } from "~/lib";
import { formattedDate } from "~/lib/helpers";
import { useGetPostDetail } from "~/queries";

export default function PostDetail() {
  const { id } = useParams();
  const { data: post, isLoading } = useGetPostDetail({ id });
  return (
    post?.data ? 
    <div>
      <h3 className="d-block">{post?.data?.title}</h3>
      <i className="d-block my-3">Ngày viết {formattedDate(post?.data?.createdAt)}</i>
      <div
        dangerouslySetInnerHTML={{
          __html: DOMFormatter(post?.data?.content),
        }}
      ></div>
    </div>
    : <Spinner isLoading={isLoading} />
  );
}
