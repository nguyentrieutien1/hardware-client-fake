import React from "react";
import { CiFacebook, CiInstagram, CiLaptop, CiTwitter } from "react-icons/ci";
import Icon from "~/components/icon/icon";
import MessengerCustomerChat from "react-messenger-customer-chat";

export default function Footer() {
  return (
    <footer className="footer spad">
    <div className="container">
      <div className="row">
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="footer__about">
            <div className="footer__about__logo">
              <a href="./index.html">
                <img src="img/logo.png" alt="" />
              </a>
            </div>
            <ul  className="text-center text-md-left">
              <li>Địa chỉ: Thăng Bình, Quảng Nam</li>
              <li>Phone: +84 983787454</li>
              <li>Email:vanhao.0112@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-6 offset-lg-1">
          <div className="footer__widget text-center text-md-left">
            <h6>Useful Links</h6>
            <ul>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">About Our Shop</a>
              </li>
              <li>
                <a href="#">Secure Shopping</a>
              </li>
              <li>
                <a href="#">Delivery infomation</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Our Sitemap</a>
              </li>
            </ul>
            <ul>
              <li>
                <a href="#">Who We Are</a>
              </li>
              <li>
                <a href="#">Our Services</a>
              </li>
              <li>
                <a href="#">Projects</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
              <li>
                <a href="#">Innovation</a>
              </li>
              <li>
                <a href="#">Testimonials</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-lg-4 col-md-12">
          <div className="footer__widget text-center text-md-left">
            <h6>Join Our Newsletter Now</h6>
            <p>Get E-mail updates about our latest shop and special offers.</p>
            <form action="#">
              <input type="text" placeholder="Enter your mail" />
              <button type="submit" className="site-btn">
                Subscribe
              </button>
            </form>
            <div className="footer__widget__social">
              <a href="#">
                <i className="fa fa-facebook" />
              </a>
              <a href="#">
                <i className="fa fa-instagram" />
              </a>
              <a href="#">
                <i className="fa fa-twitter" />
              </a>
              <a href="#">
                <i className="fa fa-pinterest" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="footer__copyright  justify-content-center d-flex">
            <div className="footer__copyright__text">
              <p className="">
                {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                Copyright © All rights reserved | This template is made with
                <i className="fa fa-heart" aria-hidden="true" /> by{" "}
                  Trieu Tien Nguyen
                {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
              </p>
            </div>
            <div className="footer__copyright__payment">
              <img src="img/payment-item.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
  
  );
}
