"use client";
import React, { useEffect, useState } from "react";
import { useGetProducts } from "~/queries";
import Product from "../product/product";
import Categories from "../categories/categories";
import Post from "../post/post";
import Search from "../search/search";
import PaginationPage from "../pagination/pagination";
export default function ShopPage() {
  const { data: products } = useGetProducts();
  const [productList, setProductList] = useState([]);
  const [active, setActive] = useState(1);
  const step = 4;

  const handleJump = (number) => {
    setActive(number);
  };

  const setFilterByCategory = (id) => {
    const filterProducts = [...products.data].filter((product) => {
      return product.categoriesId == id;
    });
    setProductList([...filterProducts]);
    setActive(1);
  };
  useEffect(() => {
    if (products?.data) {
      setProductList(products?.data);
    }
  }, [products?.data]);
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="row">
            <Categories setFilterByCategory={setFilterByCategory} />
            <Search isShowBanner={true} />
          </div>
        </div>
      </section>
      <section className="featured spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <h2>Tất cả sản phẩm</h2>
                {productList.length > 0 && (
                  <div className="product__pagination float float-right mt-4">
                    <PaginationPage
                      active={active}
                      handleJump={handleJump}
                      length={productList.length}
                      step={step}
                    />
                  </div>
                )}
              </div>
              <div className="featured__controls">
                <ul>
                  {/* <li data-filter=".oranges">Oranges</li>
                  <li data-filter=".fresh-meat">Fresh Meat</li>
                  <li data-filter=".vegetables">Vegetables</li>
                  <li data-filter=".fastfood">Fastfood</li> */}
                </ul>
              </div>
            </div>
          </div>

          <div className="row featured__filter">
            {productList.length > 0 ? (
              productList
                .slice(step * active - step, step * active)
                .map((product, i) => (
                  <Product numberColumn={3} key={i} product={product} />
                ))
            ) : (
              <h5 className="col-12 text-center mb-5">
                Sản
              </h5>
            )}
          </div>
          <div className="mb-3"></div>
          <div className="row mt-3">
            <div className="col-12">
              <div className="section-title">
                <h2>Bài viết gần đây</h2>
              </div>
            </div>
          </div>
          <Post />
        </div>
      </section>
    </>
  );
}
