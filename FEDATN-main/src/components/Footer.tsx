import React from "react";

// Import icons (you can use react-icons or any other icon library)
import { FaFacebookF, FaYoutube, FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t pt-[130px] border-gray-200 py-8">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Support Information */}
          <div className="border-r-2 border-gray  pr-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Bạn cần trợ giúp không?
            </h3>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold text-[#]">028 7777 7999</span>
            </p>
            <p className="text-gray-600 mb-2">
              Miễn phí trên toàn quốc định vị và đóng gói Hóa Kỳ.
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Email:</span>{" "}
              <a href="mailto:sales@matbao.ws" className="text-gray-600 hover:text-gray-800">
                thienquanoptics@gmail.com
              </a>
            </p>
            <p className="text-gray-600">
              Giờ làm việc của Trung tâm cuộc gọi Thứ Hai - Chủ Nhật 09:00-19:00
            </p>
          </div>

          {/* Column 2: Helpful Information */}
          <div className="pl-[80px]">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Hay để chúng tôi giúp bạn
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Tuyển vễ vệ khách hàng trực cấp
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Đơn đặt hàng của bạn
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Tra lại & Thay thế
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Giao & Chính sách vận chuyển
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Chính sách hoàn tiền và trả lại
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Điều khoản và Điều kiện
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Cai đặt cookie
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Trung tâm trợ giúp
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Enjoy with Us */}
          <div className="pl-[80px]">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Kiếm tiền với chúng tôi
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Bán trên Blonwe
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Bán dịch vụ của bạn trên Blonwe
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Bán trên Blonwe Business
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Bán ứng dụng của bạn trên Blonwe
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Trở thành một chi nhánh
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Quảng cáo sản phẩm của bạn
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Bán-Xuất bản với chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Trở thành nhà cung cấp Blonwe
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Get to Know Us */}
          <div className="pl-[80px]">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Làm quen với chúng tôi
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Sứ nghiệp cho Blonwe
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Giới thiệu về Blonwe
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Quan hệ đầu ngước
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Thiết bị Blonwe
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Đánh giá của khách hàng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Trách nhiệm xã hội
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Địa điểm cửa hàng
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media, App Links, and Payment Methods */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 border-t border-gray-200 pt-6">
          {/* Social Media Icons */}
          <div className="flex space-x-4 mb-4 md:mb-0">
            <p className="text-gray-600 font-medium">Theo dõi chúng tôi:</p>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <FaYoutube size={20} />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <FaWhatsapp size={20} />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <FaTiktok size={20} />
            </a>
          </div>

          {/* App Store Links */}
          <div className="flex space-x-4 mb-4 md:mb-0">
            <p className="text-gray-600 font-medium">Tải xuống ứng dụng:</p>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="App Store"
                className="h-8"
              />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
                className="h-8"
              />
            </a>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center">
            <a href="#" className="text-gray-600 hover:text-gray-800 flex items-center">
              <span className="mr-2">Chứng tối chi nhánh:</span>
              <img
                src="https://via.placeholder.com/20x20?text=Payment"
                alt="Payment Methods"
                className="h-5"
              />
            </a>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="text-center mt-6 border-t border-gray-200 pt-4">
          <p className="text-gray-600">
            Copyright 2025 © Maitbao WordPress Theme. Được bảo lưu. Được cung cấp bởi Maitbao.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;