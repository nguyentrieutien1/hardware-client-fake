"use client";
import React, { useEffect, useState } from "react";
import { useGetProducts } from "~/queries";
import Product from "../product/product";
import Categories from "../categories/categories";
import PaginationPage from "../pagination/pagination";
import Search from "../search/search";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { currencyFormatterConfig } from "~/lib/helpers/currency-formatter";
import ProductNotFound from "../product-not-found/product-not-found";
export default function ShopPage() {
  const { data: products } = useGetProducts();
  const [productList, setProductList] = useState([]);
  const [active, setActive] = useState(1);
  const [price, setPrice] = useState([0, 50000]);
  const [newPrice, setNewPrice] = useState([0, 0]);
  const step = 9;

  const handleJump = (number) => {
    setActive(number);
  };

  const handleSliderChange = (newValue) => {
    setProductList(products?.data);
    const prices = products?.data.map((product) => product.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    setPrice([minPrice, maxPrice]);
    setNewPrice(newValue);
    const filterProducts = [...products.data].filter((product) => {
      return product?.price >= newValue[0] && product?.price <= newValue[1];
    });
    setProductList([...filterProducts]);
    setActive(1);
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
      const prices = products?.data.map((product) => product.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPrice([minPrice, maxPrice]);
      setNewPrice([minPrice, maxPrice]);
    }
  }, [products?.data]);

  return (
    <>
      <>
        <section className="hero-normal container">
          <div className="">
            <div className="row">
              <Categories setFilterByCategory={setFilterByCategory} />
              <Search />
            </div>
          </div>
        </section>
        <section className="product spad container">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-12 d-flex justify-content-center">
                <div className="sidebar">
                  <div className="sidebar__item">
                    <h4>Giá</h4>
                    <div className="">
                      <Slider
                        step={100000}
                        range
                        dots={true}
                        onChange={handleSliderChange}
                        min={0}
                        max={price[1]}
                      />
                    </div>
                    <div className="mt-5 d-flex align-items-center justify-content-between text-nowrap">
                      <p> Khoảng giá: </p>
                      <p className="text-body">
                        {currencyFormatterConfig(newPrice[0])}
                      </p>
                      <p>-</p>
                      <p className="ml-3 text-body">{`${currencyFormatterConfig(
                        newPrice[1]
                      )}`}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-12 mt-3">
                <div className="">
                  <div className="">
                    <div className="">
                      <div className="section-title product__discount__title text-center">
                        <h2>Khuyến mãi</h2>
                      </div>
                      <div className="d-flex justify-content-end">
                        {productList.length > 0 && (
                          <PaginationPage
                            active={active}
                            handleJump={handleJump}
                            length={productList.length}
                            step={step}
                          />
                        )}
                      </div>
                    </div>
                    <div className="row">
                      {productList.length > 0 ? (
                        productList
                          .slice(step * active - step, step * active)
                          .map((product) => (
                            <Product numberColumn={4} product={product} />
                          ))
                      ) : (
                        <ProductNotFound />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    </>
  );
}
