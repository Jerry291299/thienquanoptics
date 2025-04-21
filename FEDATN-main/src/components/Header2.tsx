import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Icategory } from "../interface/category";
import { getAllCategories } from "../service/category";
import logo from "./img/logothiênquangdo-01.png"; // Replace with your logo
import nguoi from "../anh/user.png";
import iconarrow from "./icons/down-arrow_5082780.png";
import axios from "axios";

const Header2 = () => {
  const [user, setUser] = useState<{
    info: { role: string; name: string; email: string; id: string };
    id: string;
  } | null>(null);
  const [categories, setCategories] = useState<Icategory[]>([]);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [profileData, setProfileData] = useState({ img: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchUserProfile(parsedUser.id);
    }

    const fetchCategories = async () => {
      const data = await getAllCategories();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const fetchUserProfile = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:28017/user/${id}`);
      if (response.data) {
        setProfileData({
          img: response.data.img || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      {/* Top Section */}
      <div className="bg-white text-gray-800 py-2 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Left Info */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <p className="text-sm hover:text-gray-600 transition-colors duration-200 cursor-pointer">
                Giới thiệu
              </p>
            </div>
            <div className="flex items-center">
              <p className="text-sm hover:text-gray-600 transition-colors duration-200 cursor-pointer">
                Liên hệ
              </p>
            </div>
            <div className="flex items-center">
              <p className="text-sm hover:text-gray-600 transition-colors duration-200 cursor-pointer">
                Câu hỏi thường gặp
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <p className="text-sm">
                Liên hệ với chúng tôi chính thức 24/7 <span className="text-orange-500 font-semibold">(028) 7777 7999</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-auto transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* Navigation and Search */}
        <div className="flex items-center space-x-8">
          {/* Navigation Links */}
          <nav className="hidden lg:flex space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-gray-700 font-medium text-base uppercase tracking-wide transition-all duration-200 ${
                  isActive
                    ? "border-b-2 border-gray-700"
                    : "hover:border-b-2 hover:border-gray-700"
                }`
              }
            >
              Trang chủ
            </NavLink>
            <NavLink
              to="/gioithieu"
              className={({ isActive }) =>
                `text-gray-700 font-medium text-base uppercase tracking-wide transition-all duration-200 ${
                  isActive
                    ? "border-b-2 border-gray-700"
                    : "hover:border-b-2 hover:border-gray-700"
                }`
              }
            >
              Giới thiệu
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `text-gray-700 font-medium text-base uppercase tracking-wide transition-all duration-200 ${
                  isActive
                    ? "border-b-2 border-gray-700"
                    : "hover:border-b-2 hover:border-gray-700"
                }`
              }
            >
              Cửa hàng
            </NavLink>
            <NavLink
              to="/tintuc"
              className={({ isActive }) =>
                `text-gray-700 font-medium text-base uppercase tracking-wide transition-all duration-200 ${
                  isActive
                    ? "border-b-2 border-gray-700"
                    : "hover:border-b-2 hover:border-gray-700"
                }`
              }
            >
              Tin tức
            </NavLink>
            <NavLink
              to="/lienhe"
              className={({ isActive }) =>
                `text-gray-700 font-medium text-base uppercase tracking-wide transition-all duration-200 ${
                  isActive
                    ? "border-b-2 border-gray-700"
                    : "hover:border-b-2 hover:border-gray-700"
                }`
              }
            >
              Liên hệ
            </NavLink>
          </nav>

          {/* Search Bar and User Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                className="w-64 pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearchClick()}
              />
              <svg
                className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* User Actions */}
            {user ? (
              <div className="relative">
                <div
                  className="flex items-center cursor-pointer text-gray-700 hover:text-gray-900 transition-colors duration-200"
                  onClick={toggleSubMenu}
                >
                  <img
                    src={profileData.img || nguoi}
                    alt="Hồ sơ"
                    className="w-8 h-8 rounded-full object-cover mr-2"
                  />
                  <span className="flex items-center gap-1 text-sm font-medium">
                    {user.info.name}
                    <img className="w-3 h-3" src={iconarrow} alt="Dropdown" />
                  </span>
                </div>
                {isSubMenuOpen && (
                  <ul className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-10 border border-gray-100">
                    <li className="hover:bg-gray-50">
                      <Link
                        to={`/profileinfo/${user.id}`}
                        className="block px-4 py-2 text-gray-700 hover:text-gray-900 text-sm"
                      >
                        Cá nhân
                      </Link>
                    </li>
                    {(user.info.role === "admin" || user.info.role === "shipper") && (
                      <li className="hover:bg-gray-50">
                        <Link
                          to={user.info.role === "admin" ? "/admin" : "/shipper"}
                          className="block px-4 py-2 text-gray-700 hover:text-gray-900 text-sm"
                          onClick={() => setIsSubMenuOpen(false)}
                        >
                          Quản trị
                        </Link>
                      </li>
                    )}
                    {(user.info.role === "user" ||
                      user.info.role === "admin" ||
                      user.info.role === "shipper") && (
                      <>
                        
                      </>
                    )}
                    <li className="hover:bg-gray-50">
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsSubMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:text-gray-900 text-sm"
                      >
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-sm font-medium">Đăng nhập</span>
              </Link>
            )}
            <Link to="/wishlist" className="relative text-gray-700 hover:text-gray-900">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </Link>
           
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header2;