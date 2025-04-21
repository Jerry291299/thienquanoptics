import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Icategory } from "../interface/category";
import { getAllCategories } from "../service/category";
import logo from "./img/logothiênquangdo-01.png";
import nguoi from "../anh/user.png";
import iconarrow from "./icons/down-arrow_5082780.png";
import axios from "axios";

const Header = () => {
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
    <div className="relative">
      {/* Banner Section */}
      <div className="relative w-full h-[80vh] min-h-[600px]">
        {/* Video Banner */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://klbtheme.com/blonwe/glasses/wp-content/uploads/sites/11/2023/08/glasses-video.mp4"
            type="video/mp4"
          />
          {/* Fallback content if video fails to load */}
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-600">Không thể tải video. Vui lòng thử lại sau.</p>
          </div>
        </video>
        {/* Overlay for darkening the background */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Banner Text and CTA */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <p className="text-lg md:text-xl uppercase tracking-wider mb-2">
            Ưu đãi độc quyền cho tần này
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            GIẢI PHÁP KINH TUYỆT CHÍNH CHO <br /> MỖI KHÔNG GIAN.
          </h1>
          <p className="text-sm md:text-base max-w-2xl mb-6">
            Mong muốn đáp ứng nhu cầu cho chúng tôi là mang đến cho bạn những sản
            phẩm chất lượng thương hiệu kinh doanh đầu, hãy cân nhắc Dùng bộ lọc
            nhất có hội ngay...
          </p>
          <button className="bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            Bắt đầu tìm kiếm ngay
          </button>
        </div>
      </div>

      {/* Header Section */}
      <header className="absolute top-0 left-0 w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Section */}
          <div className="flex justify-between items-center py-4">
            {/* Left Info */}
            <div className="flex items-center space-x-7">
            
              <div className="flex items-center">
                
                <p className="text-white text-sm hover:text-gray-200 transition-colors duration-200">
                  Giới thiệu
                </p>
              </div>
              <div className="flex items-center">
               
                <p className="text-white text-sm hover:text-gray-200 transition-colors duration-200">
                  Liên hệ
                </p>
              </div>
              <div className="flex items-center">
                <p className="text-white text-sm hover:text-gray-200 transition-colors duration-200">
                  Câu hỏi thường gặp
                </p>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
            <div className="">
              <p className="text-white text-sm">
                
Bạn có thể liên hệ với chúng tôi 24/7 
<span className="pl-[10px] text-[#fc5e22]">(028) 7777 7999</span>


              </p>
             </div>
              
              
             
            </div>
          </div>

          {/* Main Header Section */}
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="Logo"
                className="h-10 w-auto transition-transform duration-300 hover:scale-105 md:h-24 lg:h-[82px]"
              />
            </Link>

            {/* Navigation and Search */}
            <div className="flex items-center space-x-8">
              {/* Navigation Links */}
              <nav className="hidden lg:flex space-x-8">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `text-white font-medium text-lg uppercase tracking-wide transition-all duration-200 ${
                      isActive
                        ? "border-b-2 border-white"
                        : "hover:border-b-2 hover:border-white"
                    }`
                  }
                >
                  Trang chủ
                </NavLink>
                <NavLink
                  to="/products"
                  className={({ isActive }) =>
                    `text-white font-medium text-lg uppercase tracking-wide transition-all duration-200 ${
                      isActive
                        ? "border-b-2 border-white"
                        : "hover:border-b-2 hover:border-white"
                    }`
                  }
                >
                  Sản phẩm
                </NavLink>
                <NavLink
                  to="/tintuc"
                  className={({ isActive }) =>
                    `text-white font-medium text-lg uppercase tracking-wide transition-all duration-200 ${
                      isActive
                        ? "border-b-2 border-white"
                        : "hover:border-b-2 hover:border-white"
                    }`
                  }
                >
                  Tin tức
                </NavLink>
                <NavLink
                  to="/gioithieu"
                  className={({ isActive }) =>
                    `text-white font-medium text-lg uppercase tracking-wide transition-all duration-200 ${
                      isActive
                        ? "border-b-2 border-white"
                        : "hover:border-b-2 hover:border-white"
                    }`
                  }
                >
                  Giới thiệu
                </NavLink>
              </nav>

              {/* Search Bar and User Actions */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    className="w-64 pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
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
                      className="flex items-center cursor-pointer text-white hover:text-gray-200 transition-colors duration-200"
                      onClick={toggleSubMenu}
                    >
                      <img
                        src={profileData.img || nguoi}
                        alt="Hồ sơ"
                        className="w-8 h-8 rounded-full object-cover mr-2"
                      />
                      <span className="flex items-center gap-1">
                        {user.info.name}
                        <img className="w-4 h-4" src={iconarrow} alt="Dropdown" />
                      </span>
                    </div>
                    {isSubMenuOpen && (
                      <ul className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-10 border border-gray-200">
                        <li className="hover:bg-gray-50">
                          <Link
                            to={`/profileinfo/${user.id}`}
                            className="block px-4 py-2 text-gray-700 hover:text-gray-900"
                          >
                            Cá nhân
                          </Link>
                        </li>
                        {(user.info.role === "admin" || user.info.role === "shipper") && (
                          <li className="hover:bg-gray-50">
                            <Link
                              to={user.info.role === "admin" ? "/admin" : "/shipper"}
                              className="block px-4 py-2 text-gray-700 hover:text-gray-900"
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
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:text-gray-900"
                          >
                            Đăng xuất
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center text-white hover:text-gray-200 transition-colors duration-200"
                    >
                      <img src={nguoi} alt="Login" className="w-6 h-6 mr-2" />
                      My Account
                    </Link>
                  </>
                )}
                
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;