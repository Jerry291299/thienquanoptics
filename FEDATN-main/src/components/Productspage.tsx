import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header2 from "./Header2";

// Placeholder product data (replace with your API data)
interface IProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  discountedPrice: number;
  discount: number;
}

const products: IProduct[] = [
  {
    id: "1",
    name: "Kính mắt Aviator Full Rim màu đen",
    image: "https://via.placeholder.com/300x300.png?text=Glasses+1",
    price: 1200000,
    discountedPrice: 590000,
    discount: 54,
  },
  {
    id: "2",
    name: "Kính mắt Aviator Full Rim trong suốt màu xanh lá cây",
    image: "https://via.placeholder.com/300x300.png?text=Glasses+2",
    price: 1200000,
    discountedPrice: 590000,
    discount: 54,
  },
  {
    id: "3",
    name: "Kính mắt gọng trong suốt màu vàng – Kính rám vuông",
    image: "https://via.placeholder.com/300x300.png?text=Glasses+3",
    price: 2600000,
    discountedPrice: 590000,
    discount: 90,
  },
  {
    id: "4",
    name: "Kính rám kính mắt hình chữ nhật cổ điển trong suốt màu cam",
    image: "https://via.placeholder.com/300x300.png?text=Glasses+4",
    price: 1000000,
    discountedPrice: 640000,
    discount: 75,
  },
  {
    id: "5",
    name: "Kính mắt hình chữ nhật đầy đủ viền màu xanh da trời",
    image: "https://via.placeholder.com/300x300.png?text=Glasses+5",
    price: 1000000,
    discountedPrice: 640000,
    discount: 75,
  },
  {
    id: "6",
    name: "Kính mắt lục giác toàn viền trong suốt màu xanh",
    image: "https://via.placeholder.com/300x300.png?text=Glasses+6",
    price: 1200000,
    discountedPrice: 590000,
    discount: 54,
  },
  {
    id: "7",
    name: "Kính mắt lục giác toàn viền trong suốt màu xanh",
    image: "https://via.placeholder.com/300x300.png?text=Glasses+7",
    price: 1200000,
    discountedPrice: 590000,
    discount: 54,
  },
  {
    id: "8",
    name: "Kính mắt mèo Full Rim",
    image: "https://via.placeholder.com/300x300.png?text=Glasses+8",
    price: 2590000,
    discountedPrice: 2590000,
    discount: 0,
  },
];

const ProductPage: React.FC = () => {
  const [minPrice, setMinPrice] = useState<number>(260000);
  const [maxPrice, setMaxPrice] = useState<number>(5990000);
  const [itemsPerPage, setItemsPerPage] = useState<number>(16);

  return (
    <>
    <Header2/>
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-gray-700">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Cửa hàng</span>
        </nav>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Cửa hàng</h1>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-gray-600">Danh mục sản phẩm</span>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-600">Hình chữ nhật</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-600">Kính mắt</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-600">Kính râm</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-600">Lục giác</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-600">Mắt mèo</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-600">Phi công</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-600">Thể thao</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-600">Tôn</span>
            </label>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar (Filters) */}
          <div className="lg:w-1/4">
            <div className="bg-white p-6">
              {/* Filter by Category */}
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Lựa chọn danh mục sản phẩm
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-gray-600 hover:text-gray-800">
                    Lưu trữ
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 hover:text-gray-800">
                    Thang ba 2023
                  </Link>
                </li>
              </ul>

              {/* Filter by Type */}
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">
                Thể loại
              </h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-600">Mắt kính</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-600">Kính mát</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-600">Kính râm</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-600">Lục giác</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-600">Mắt mèo</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-600">Phi công</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-600">Thể thao</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-600">Tôn</span>
                </label>
              </div>

              {/* Filter by Color */}
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">
                Màu sắc
              </h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-600">Đen (7)</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-600">Cam (4)</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-600">Đỏ (6)</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-600">Khói (5)</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-600">Nâu (8)</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-600">Vàng (4)</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-600">Xanh (4)</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-600">Xanh lá (4)</span>
                </label>
              </div>

              {/* Filter by Price */}
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">
                Lọc theo giá
              </h3>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="w-1/2 p-2 border border-gray-300 rounded"
                  placeholder="Min price"
                />
                <span>-</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-1/2 p-2 border border-gray-300 rounded"
                  placeholder="Max price"
                />
              </div>
              <div className="mt-4">
                <p className="text-gray-600">
                  {minPrice.toLocaleString()} - {maxPrice.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            {/* Sorting and Pagination */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing 1–16 of 29 results
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <label className="mr-2 text-gray-600">Sort:</label>
                  <select className="border border-gray-300 rounded p-1">
                    <option>Default sorting</option>
                    <option>Sort by price: low to high</option>
                    <option>Sort by price: high to low</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="mr-2 text-gray-600">Show:</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="border border-gray-300 rounded p-1"
                  >
                    <option value={16}>16 items</option>
                    <option value={32}>32 items</option>
                    <option value={48}>48 items</option>
                  </select>
                </div>
                <button className="text-gray-600">
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
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                </button>
                <button className="text-gray-600">
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
                      d="M4 6h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 12h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, itemsPerPage).map((product) => (
                <div key={product.id} className="relative">
                  {/* Discount Badge */}
                  {product.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      {product.discount}%
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
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-contain"
                  />
                  {/* Product Info */}
                  <div className="mt-2 text-center">
                    <h3 className="text-gray-800 text-sm">{product.name}</h3>
                    <div className="flex justify-center items-center space-x-2 mt-1">
                      <span className="text-gray-500 text-sm line-through">
                        ₫{product.price.toLocaleString()}
                      </span>
                      <span className="text-gray-800 text-sm font-semibold">
                        ₫{product.discountedPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductPage;