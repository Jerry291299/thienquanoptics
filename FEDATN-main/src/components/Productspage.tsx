import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import Header2 from "./Header2";
import { getAllproducts } from "../service/products";
import { addToWishlist, removeFromWishlist, getWishlist } from "../service/wishlist"; // Adjust path if needed
import { notification } from "antd";
import Footer from "./Footer";

// Define interfaces based on your API response
interface ISubVariant {
  specification: string;
  value: string;
  additionalPrice: number;
  quantity: number;
  _id?: string;
}

interface IVariant {
  _id?: string;
  color: { _id: string; name: string; hexCode: string }; // Populated color
  basePrice: number;
  discount?: number;
  images: string[];
  subVariants: ISubVariant[];
}

interface Icategory {
  _id: string;
  name: string;
  status: string;
  __v?: number;
}

interface IProduct {
  _id: string;
  masp: string;
  name: string;
  moTa: string;
  brand: string;
  category: Icategory;
  gender: string;
  status: boolean;
  variants: IVariant[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

const ProductPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [colors, setColors] = useState<{ name: string; count: number; hexCode: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100000000);
  const [itemsPerPage, setItemsPerPage] = useState<number>(16);
  const [sortOption, setSortOption] = useState<string>("default");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [user, setUser] = useState<{
    info: { role: string; name: string; email: string; id: string };
    id: string;
  } | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]); // Store product IDs in wishlist

  // Fetch user data from sessionStorage
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  }, []);

  // Fetch products and wishlist
  useEffect(() => {
    const fetchProductsAndWishlist = async () => {
      try {
        setLoading(true);

        // Fetch products
        const response = await getAllproducts({ limit: 50, page: 1 });
        const fetchedProducts = response.docs || [];
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(fetchedProducts.map((product: IProduct) => product.category?.name).filter(Boolean)),
        ] as string[];
        setCategories(uniqueCategories);
        console.log("Fetched products:", fetchedProducts);
        console.log("Unique categories:", uniqueCategories);

        // Extract unique colors and their counts
        const colorMap: { [name: string]: { hexCode: string; count: number } } = {};
        fetchedProducts.forEach((product: IProduct) => {
          product.variants.forEach((variant: IVariant) => {
            if (variant.color) {
              const name = variant.color.name;
              const hex = variant.color.hexCode || "#000";
              if (colorMap[name]) {
                colorMap[name].count += 1;
              } else {
                colorMap[name] = { hexCode: hex, count: 1 };
              }
            }
          });
        });
        const uniqueColors = Object.entries(colorMap).map(([name, data]) => ({
          name,
          count: data.count,
          hexCode: data.hexCode,
        }));
        setColors(uniqueColors);
        console.log("Unique colors:", uniqueColors);

        // Fetch wishlist if user is logged in
        if (user?.id) {
          const wishlistData = await getWishlist(user.id);
          const wishlistProductIds = wishlistData.map((item: IProduct) => item._id);
          setWishlist(wishlistProductIds);
        }
      } catch (error) {
        console.error("Failed to fetch products or wishlist:", error);
        setCategories([]);
        setColors([]);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProductsAndWishlist();
  }, [user]); // Depend on user to refetch wishlist when user changes

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Filter by status (only show active products)
    filtered = filtered.filter((product) => product.status);
    console.log("After status filter:", filtered);

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category?.name)
      );
      console.log("After category filter:", filtered);
    }

    // Filter by color
    if (selectedColors.length > 0) {
      filtered = filtered.filter((product) =>
        product.variants.some((variant) => selectedColors.includes(variant.color?.name))
      );
      console.log("After color filter:", filtered);
    }

    // Filter by price
    filtered = filtered.filter((product) => {
      const price = calculateLowestPrice(product);
      console.log(`Lowest price for ${product.name}:`, price);
      return price >= minPrice && price <= maxPrice;
    });
    console.log("After price filter:", filtered);

    // Sort products
    if (sortOption === "price-low-to-high") {
      filtered.sort((a, b) => calculateLowestPrice(a) - calculateLowestPrice(b));
    } else if (sortOption === "price-high-to-low") {
      filtered.sort((a, b) => calculateLowestPrice(b) - calculateLowestPrice(a));
    }

    setFilteredProducts(filtered);
    console.log("Final filtered products:", filtered);
  }, [products, selectedCategories, selectedColors, minPrice, maxPrice, sortOption]);

  // Calculate the lowest possible price for a product
  const calculateLowestPrice = (product: IProduct): number => {
    if (!product.variants || product.variants.length === 0) return 0;

    const variant = product.variants[0];
    const basePrice = variant.basePrice;
    const discount = variant.discount || 0;

    const subVariantPrices = variant.subVariants.map((subVariant) => {
      const totalPrice = basePrice + (subVariant.additionalPrice || 0);
      return totalPrice - (totalPrice * discount) / 100;
    });

    return subVariantPrices.length > 0 ? Math.min(...subVariantPrices) : basePrice - (basePrice * discount) / 100;
  };

  // Calculate the original price (before discount) for display
  const calculateOriginalPrice = (product: IProduct): number => {
    if (!product.variants || product.variants.length === 0) return 0;

    const variant = product.variants[0];
    const basePrice = variant.basePrice;

    const subVariantPrices = variant.subVariants.map((subVariant) => basePrice + (subVariant.additionalPrice || 0));
    return subVariantPrices.length > 0 ? Math.min(...subVariantPrices) : basePrice;
  };

  // Format price for display
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  // Handle color filter
  const handleColorChange = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setMinPrice(0);
    setMaxPrice(100000000);
    setSortOption("default");
    setItemsPerPage(16);
  };

  // Handle add/remove from wishlist
  const handleToggleWishlist = async (productId: string) => {
    if (!user?.id) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích!",
      });
      return;
    }

    try {
      if (wishlist.includes(productId)) {
        // Remove from wishlist
        await removeFromWishlist(user.id, productId);
        setWishlist(wishlist.filter((id) => id !== productId));
        notification.success({
          message: "Thành công",
          description: "Sản phẩm đã được xóa khỏi danh sách yêu thích!",
        });
      } else {
        // Add to wishlist
        await addToWishlist(user.id, productId);
        setWishlist([...wishlist, productId]);
        notification.success({
          message: "Thành công",
          description: "Sản phẩm đã được thêm vào danh sách yêu thích!",
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể cập nhật danh sách yêu thích!",
      });
    }
  };

  return (
    <>
      <Header2 />
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-gray-700">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">Cửa hàng</span>
          </nav>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Cửa hàng</h1>
          <div className="flex flex-col border-b-2 pb-[40px] border-gray sm:flex-row justify-between items-center mb-6 gap-4">
            <p className="text-gray-600">
              Hiển thị 1–{Math.min(itemsPerPage, filteredProducts.length)} trong số {filteredProducts.length} sản phẩm
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <label className="mr-2 text-gray-600">Sắp xếp:</label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border border-gray-300 rounded p-1"
                >
                  <option value="default">Sắp xếp mặc định</option>
                  <option value="price-low-to-high">Giá: Thấp đến cao</option>
                  <option value="price-high-to-low">Giá: Cao đến thấp</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="mr-2 text-gray-600">Hiển thị:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="border border-gray-300 rounded p-1"
                >
                  <option value={16}>16 sản phẩm</option>
                  <option value={32}>32 sản phẩm</option>
                  <option value={48}>48 sản phẩm</option>
                </select>
              </div>
              <button
                className="lg:hidden text-gray-600 hover:text-gray-800"
                onClick={() => setIsSidebarOpen(true)}
              >
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
                    d="M3 4h18M3 12h18M3 20h18"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col py-[80px] lg:flex-row gap-6">
            {/* Sidebar (Filters) */}
            <div className={`lg:w-1/4 ${isSidebarOpen ? "block" : "hidden"} lg:block`}>
              <div className="bg-white p-6 border-r-2 border-gray">
                {/* Toggle Button for Mobile */}
                <button
                  className="lg:hidden mb-4 text-gray-600 hover:text-gray-800"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Đóng bộ lọc
                </button>

                {/* Filter by Category */}
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Lựa chọn danh mục sản phẩm</h3>
                <div className="space-y-2">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                        />
                        <span className="text-gray-600">{category}</span>
                      </label>
                    ))
                  ) : (
                    <span className="text-gray-600">Không có danh mục nào</span>
                  )}
                </div>

                {/* Filter by Color */}
                <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Màu sắc</h3>
                <div className="space-y-2">
                  {colors.map((color) => (
                    <label key={color.name} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color.name)}
                        onChange={() => handleColorChange(color.name)}
                      />
                      <span
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: color.hexCode }}
                        title={color.name}
                      ></span>
                      <span className="text-gray-600">{color.name}</span>
                    </label>
                  ))}
                </div>

                {/* Filter by Price */}
                <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Lọc theo giá</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-1/2 p-2 border border-gray-300 rounded"
                    placeholder="Giá tối thiểu"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-1/2 p-2 border border-gray-300 rounded"
                    placeholder="Giá tối đa"
                  />
                </div>
                <div className="mt-4">
                  <p className="text-gray-600">
                    {formatPrice(minPrice)} - {formatPrice(maxPrice)}
                  </p>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="lg:w-3/4">
              {loading ? (
                <p className="text-center text-gray-600">Đang tải...</p>
              ) : filteredProducts.length === 0 ? (
                <p className="text-center text-gray-600">Không tìm thấy sản phẩm nào.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.slice(0, itemsPerPage).map((product) => {
                    const originalPrice = calculateOriginalPrice(product);
                    const discountedPrice = calculateLowestPrice(product);
                    const discount = product.variants && product.variants.length > 0 ? product.variants[0].discount || 0 : 0;
                    const isInWishlist = wishlist.includes(product._id);

                    return (
                      <div key={product._id} className="relative">
                        {/* Discount Badge */}
                        {discount > 0 && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                            {discount}%
                          </span>
                        )}
                        {/* Wishlist Icon */}
                        <button
                          onClick={() => handleToggleWishlist(product._id)}
                          className={`absolute top-2 right-2 transition-colors duration-200 ${
                            isInWishlist ? "text-red-500" : "text-gray-400 hover:text-red-500"
                          }`}
                        >
                          <svg
                            className="w-6 h-6"
                            fill={isInWishlist ? "currentColor" : "none"}
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
                            src={
                              product.variants &&
                              product.variants.length > 0 &&
                              product.variants[0].images &&
                              product.variants[0].images.length > 0
                                ? product.variants[0].images[0]
                                : "https://via.placeholder.com/150?text=No+Image"
                            }
                            alt={product.name}
                            className="w-full h-48 object-contain"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/150?text=Image+Failed";
                            }}
                          />
                        </NavLink>
                        {/* Product Info */}
                        <div className="mt-2 text-center">
                          <h3 className="text-gray-800 text-sm">{product.name}</h3>
                          <div className="flex justify-center items-center space-x-2 mt-1">
                            {discount > 0 && (
                              <span className="text-gray-500 text-sm line-through">
                                {formatPrice(originalPrice)}
                              </span>
                            )}
                            <span className="text-gray-800 text-sm font-semibold">
                              {formatPrice(discountedPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;