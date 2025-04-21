import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Iproduct } from "../interface/products";
import { getAllproducts } from "../service/products";
import { IBrand } from "../interface/brand";
import { getAllBrands } from "../service/brand";

type Props = {};

const Content = () => {
  const [products, setProducts] = useState<Iproduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Iproduct[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch brands
        const brandData = await getAllBrands();
        setBrands(brandData); // No status field, so no filtering by status

        // Fetch products
        const sanpham = await getAllproducts({ limit: 12, page: 1 });
        console.log("API Response (Products):", sanpham);
        const fetchedProducts = sanpham.docs || [];
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
        console.log("Products set to state:", fetchedProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter products based on activeFilter (brand)
  useEffect(() => {
    let filtered = [...products];

    // Filter by status (only show active products)
    filtered = filtered.filter((product) => product.status);

    // Filter by activeFilter (brand ID)
    if (activeFilter) {
      filtered = filtered.filter((product) => product.brand === activeFilter);
    }

    setFilteredProducts(filtered);
    console.log("Filtered products:", filtered);
  }, [products, activeFilter]);

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  // Calculate the lowest possible price for a product
  const calculateLowestPrice = (product: Iproduct): number => {
    if (!product.variants || product.variants.length === 0) return 0;

    const variant = product.variants[0];
    const basePrice = variant.basePrice;
    const discount = variant.discount || 0;

    const subVariantPrices = variant.subVariants.map((subVariant) => {
      const totalPrice = basePrice + (subVariant.additionalPrice || 0);
      return totalPrice - (totalPrice * discount) / 100;
    });

    const lowestPrice =
      subVariantPrices.length > 0
        ? Math.min(...subVariantPrices)
        : basePrice - (basePrice * discount) / 100;

    console.log(`Lowest price for ${product.name}:`, lowestPrice);
    return lowestPrice;
  };

  // Calculate the original price (before discount) for display
  const calculateOriginalPrice = (product: Iproduct): number => {
    if (!product.variants || product.variants.length === 0) return 0;

    const variant = product.variants[0];
    const basePrice = variant.basePrice;

    const subVariantPrices = variant.subVariants.map(
      (subVariant) => basePrice + (subVariant.additionalPrice || 0)
    );
    const originalPrice =
      subVariantPrices.length > 0 ? Math.min(...subVariantPrices) : basePrice;

    console.log(`Original price for ${product.name}:`, originalPrice);
    return originalPrice;
  };

  // Format price for display
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  // Handle brand filter click
  const handleFilterClick = (brandId: string) => {
    setActiveFilter(brandId === activeFilter ? null : brandId);
  };

  return (
    <div className="bg-white">
      {/* Brand Filter Bar */}
      <div className="flex justify-center flex-wrap gap-6 mb-8 px-4">
        {brands.length === 0 ? (
          <p className="text-gray-600 font-sans font-medium text-sm">
            Đang tải thương hiệu...
          </p>
        ) : (
          brands.map((brand) => (
            <button
              key={brand._id}
              onClick={() => handleFilterClick(brand._id)}
              className={`relative group rounded-full p-2 transition-all duration-300 ${
                activeFilter === brand._id
                  ? "ring-2 ring-blue-500 bg-blue-50 shadow-md"
                  : "hover:ring-2 hover:ring-gray-300 hover:shadow-md"
              }`}
              title={brand.name}
            >
              <img
                src={brand.image || "https://via.placeholder.com/60?text=No+Image"}
                alt={brand.name}
                className={`w-14 h-14 object-contain rounded-full transition-all duration-300 ${
                  activeFilter === brand._id
                    ? "filter-none scale-110"
                    : "filter blur-[1px] opacity-70 group-hover:filter-none group-hover:opacity-100 group-hover:scale-110"
                }`}
                onError={(e) => {
                  console.log(`Brand image failed to load for ${brand.name}: ${brand.image}`);
                  e.currentTarget.src = "https://via.placeholder.com/60?text=No+Image";
                }}
              />
              <p className="text-gray-600 text-xs font-sans font-medium mt-1 transition-colors group-hover:text-gray-800">
                {brand.name}
              </p>
            </button>
          ))
        )}
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
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full font-sans font-medium text-lg">
            Không có sản phẩm nào để hiển thị.
          </p>
        ) : (
          filteredProducts.slice(0, 12).map((product: Iproduct) => {
            const originalPrice = calculateOriginalPrice(product);
            const discountedPrice = calculateLowestPrice(product);
            const discount =
              product.variants && product.variants.length > 0
                ? product.variants[0].discount || 0
                : 0;
            const firstImage =
              product.variants &&
              product.variants.length > 0 &&
              product.variants[0].images &&
              Array.isArray(product.variants[0].images) &&
              product.variants[0].images.length > 0
                ? product.variants[0].images[0]
                : "https://via.placeholder.com/150?text=No+Image";

            console.log(`Product: ${product.name}, First Image: ${firstImage}`);

            return (
              <div key={product._id} className="relative">
                {/* Discount Badge */}
                {discount > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded font-sans tracking-tight">
                    {discount}%
                  </span>
                )}
                {/* Wishlist Icon */}
                <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors duration-200">
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
                    onError={(e) => {
                      console.log(`Image failed to load for ${product.name}: ${firstImage}`);
                      e.currentTarget.src = "https://via.placeholder.com/150?text=Image+Failed";
                    }}
                    onLoad={() => console.log(`Image loaded for ${product.name}: ${firstImage}`)}
                    loading="lazy"
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
                  <div className="flex justify-center items-center space  space-x-2 mt-1">
                    {discount > 0 && (
                      <span className="text-gray-500 text-sm line-through font-sans font-normal tracking-tight">
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                    <span className="text-gray-800 text-sm font-sans font-semibold tracking-normal">
                      {formatPrice(discountedPrice)}
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
            className="w-full pb-[80px] h-full object-cover"
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
            className="w-full pb-[120px] h-full object-cover"
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
            className="w-full pb-[120px] h-full object-cover"
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