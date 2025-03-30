import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Iproduct } from "../interface/products";
import { getAllproducts } from "../service/products";

type Props = {};

const Content: React.FC<Props> = () => {
  const [products, setProducts] = useState<Iproduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sanpham = await getAllproducts({ limit: 12, page: 1 });
        setProducts(sanpham.docs || []);
        console.log(sanpham.docs, "day");
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  // Get discount from the first variant (if available)
  const getDiscount = (product: Iproduct): number => {
    if (product.variants && product.variants.length > 0) {
      return product.variants[0].discount || 0;
    }
    return 0; // Fallback if no variant or discount
  };

  // Calculate price after discount
  const getDiscountedPrice = (basePrice: number, discount: number): number => {
    return basePrice - (basePrice * discount) / 100;
  };

  // Danh sách các filter
  const filters = [
    "Hình chữ nhật",
    "Kính mắt",
    "Kính râm",
    "Lục giác",
    "Mắt mèo",
    "Phi công",
    "Thể thao",
    "Tôn",
  ];

  // Xử lý khi người dùng click vào filter
  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter === activeFilter ? null : filter);
  };

  return (
    <div className="bg-white">
      {/* Filter Bar */}
      <div className="flex justify-center space-x-4 mb-6">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            className={`text-gray-600 hover:text-gray-800 px-3 py-1 rounded-full transition-colors font-sans font-medium tracking-wide text-sm ${
              activeFilter === filter ? "bg-gray-200" : ""
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-800 text-center uppercase mb-8 font-sans tracking-wider">
        ĐỪNG BỎ LỠ SỐT SALE TUẦN NÀY
      </h2>

      {/* Product Grid */}
      <div className="pb-[30px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mt-8 px-4 md:px-8 lg:px-16">
        {loading ? (
          <p className="text-center text-gray-600 col-span-full font-sans font-medium text-lg">
            Đang tải...
          </p>
        ) : (
          products
            .filter((product: Iproduct) => product.status) // Lọc sản phẩm active
            .slice(0, 12) // Hiển thị tối đa 12 sản phẩm
            .map((product: Iproduct) => {
              const discount = getDiscount(product);
              const basePrice =
                product.variants && product.variants.length > 0
                  ? product.variants[0].basePrice
                  : 0;
              const discountedPrice = getDiscountedPrice(basePrice, discount);
              const firstImage =
                product.variants &&
                product.variants.length > 0 &&
                product.variants[0].img &&
                product.variants[0].img.length > 0
                  ? product.variants[0].img[0]
                  : "https://via.placeholder.com/150"; // Fallback image if no variant image

              return (
                <div key={product._id} className="relative">
                  {/* Discount Badge */}
                  {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded font-sans tracking-tight">
                      {discount}%
                    </span>
                  )}
                  {/* Wishlist Icon */}
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                    <svg
                      className="w-6 h-6"
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
                  </button>
                  {/* Product Image */}
                  <NavLink to={`/product/${product._id}`}>
                    <img
                      src={firstImage}
                      alt={product.name}
                      className="w-full h-48 object-contain"
                    />
                  </NavLink>
                  {/* Product Info */}
                  <div className="mt-2 text-center">
                    <h3 className="text-gray-800 text-sm font-sans font-medium tracking-normal">
                      {truncateText(product.name, 50)}
                    </h3>
                    <p className="text-gray-600 text-xs font-sans font-normal tracking-tight">
                      {product.gender || "Unisex"}
                    </p>
                    <div className="flex justify-center items-center space-x-2 mt-1">
                      <span className="text-gray-500 text-sm line-through font-sans font-normal tracking-tight">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(basePrice)}
                      </span>
                      <span className="text-gray-800 text-sm font-sans font-semibold tracking-normal">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(discountedPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
        )}
      </div>

      {/* Banner Mini Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 md:px-8 lg:px-16 mb-8">
        {/* Left Banner */}
        <div className="relative rounded-lg overflow-hidden">
          <img
            src="https://klbtheme.com/blonwe/glasses/wp-content/uploads/sites/11/2023/05/banner-100.jpg"
            alt="Left Banner"
            className="w-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center p-6 text-left">
            <p className="text-gray-800 text-sm font-sans font-medium tracking-wide mb-2">
              Giảm giá cực tần
            </p>
            <h3 className="text-2xl font-bold text-gray-900 font-sans tracking-wider mb-2">
              Kính chất lượng cho cuộc sống chất lượng
            </h3>
            <p className="text-gray-700 text-sm font-sans font-normal tracking-normal mb-4">
              Chỉ trong tuần này. Đừng bỏ lỡ...
            </p>
            <NavLink
              to="/products"
              className="text-gray-900 font-sans font-medium tracking-wide hover:text-gray-700 flex items-center"
            >
              Mua ngay <span className="ml-2">→</span>
            </NavLink>
          </div>
        </div>

        {/* Right Banner */}
        <div className="relative rounded-lg overflow-hidden">
          <img
            src="https://klbtheme.com/blonwe/glasses/wp-content/uploads/sites/11/2023/05/banner-101.jpg"
            alt="Right Banner"
            className="w-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center p-6 text-left">
            <p className="text-gray-800 text-sm font-sans font-medium tracking-wide mb-2">
              Giảm giá cực tần
            </p>
            <h3 className="text-2xl font-bold text-gray-900 font-sans tracking-wider mb-2">
              Nổi thùy tinh đáp ứng sự đổi mới
            </h3>
            <p className="text-gray-700 text-sm font-sans font-normal tracking-normal mb-4">
              Chỉ trong tuần này. Đừng bỏ lỡ...
            </p>
            <NavLink
              to="/products"
              className="text-gray-900 font-sans font-medium tracking-wide hover:text-gray-700 flex items-center"
            >
              Mua ngay <span className="ml-2">→</span>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Bottom Banner */}
 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 md:px-8 lg:px-16 mb-8">
      {/* Banner 1 - Dành cho trẻ em */}
      <div className="relative rounded-lg overflow-hidden bg-gray-100">
        <img
          src="https://klbtheme.com/blonwe/glasses/wp-content/uploads/sites/11/2023/05/banner-102.jpg"
          alt="Dành cho trẻ em"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-left bg-white">
          <p className="text-gray-700 text-sm font-medium tracking-wide mb-1">
            Kính 1.345 dành cho trẻ em
          </p>
          <h3 className="text-xl font-bold text-gray-900 tracking-wide mb-2">
            Dành cho trẻ em
          </h3>
          <p className="text-gray-700 text-sm font-normal tracking-normal mb-4">
            Nếu kính bị bẩn nhiễu hoặc có dầu và tay, hãy dùng dịch làm sạch được thiết kế riêng cho kính. Đừng bao giờ sử dụng dịch chất hóa chất mạnh, vì nó có thể làm hỏng lớp phủ phù chống phản quang cũng như chất liệu của khung kính.
          </p>
          <NavLink
            to="/products"
            className="inline-flex items-center px-4 py-2 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-colors border border-gray-300"
          >
            Mua ngay <span className="ml-2">→</span>
          </NavLink>
        </div>
      </div>

      {/* Banner 2 - Dành cho nữ */}
      <div className="relative rounded-lg overflow-hidden bg-gray-100">
        <img
          src="https://klbtheme.com/blonwe/glasses/wp-content/uploads/sites/11/2023/05/banner-103.jpg"
          alt="Dành cho nữ"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-left bg-white">
          <p className="text-gray-700 text-sm font-medium tracking-wide mb-1">
            Kính 1.345 dành cho nữ
          </p>
          <h3 className="text-xl font-bold text-gray-900 tracking-wide mb-2">
            Dành cho nữ
          </h3>
          <p className="text-gray-700 text-sm font-normal tracking-normal mb-4">
            Nếu kính bị bẩn nhiễu hoặc có dầu và tay, hãy dùng dịch làm sạch được thiết kế riêng cho kính. Đừng bao giờ sử dụng dịch chất hóa chất mạnh, vì nó có thể làm hỏng lớp phủ phù chống phản quang cũng như chất liệu của khung kính.
          </p>
          <NavLink
            to="/products"
            className="inline-flex items-center px-4 py-2 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-colors border border-gray-300"
          >
            Mua ngay <span className="ml-2">→</span>
          </NavLink>
        </div>
      </div>

      {/* Banner 3 - Dành cho nam giới */}
      <div className="relative rounded-lg overflow-hidden bg-gray-100">
        <img
          src="https://klbtheme.com/blonwe/glasses/wp-content/uploads/sites/11/2023/05/banner-104.jpg"
          alt="Dành cho nam giới"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-left bg-white">
          <p className="text-gray-700 text-sm font-medium tracking-wide mb-1">
            Kính 1.345 dành cho nam
          </p>
          <h3 className="text-xl font-bold text-gray-900 tracking-wide mb-2">
            Dành cho nam giới
          </h3>
          <p className="text-gray-700 text-sm font-normal tracking-normal mb-4">
            Nếu kính bị bẩn nhiễu hoặc có dầu và tay, hãy dùng dịch làm sạch được thiết kế riêng cho kính. Đừng bao giờ sử dụng dịch chất hóa chất mạnh, vì nó có thể làm hỏng lớp phủ phù chống phản quang cũng như chất liệu của khung kính.
          </p>
          <NavLink
            to="/products"
            className="inline-flex items-center px-4 py-2 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-colors border border-gray-300"
          >
            Mua ngay <span className="ml-2">→</span>
          </NavLink>
        </div>
      </div>
    </div>
  
    </div>
  );
};

export default Content;