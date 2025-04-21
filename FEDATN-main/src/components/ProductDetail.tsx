import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { IUser } from "../interface/user";
import { getAllproducts, getProductByID } from "../service/products";
import { addToWishlist, removeFromWishlist, getWishlist } from "../service/wishlist"; // Adjust path if needed
import { notification } from "antd";
import Header2 from "./Header2";
import Footer from "./Footer";
import CommentSection from "../components/CommentProduct";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DOMPurify from "dompurify";

// Define interfaces
interface ISubVariant {
  specification: string;
  value: string;
  additionalPrice: number;
  quantity: number;
  _id?: string;
}

interface IColor {
  _id: string;
  name: string;
  hexCode: string;
  createdAt?: string;
  updatedAt?: string;
}

interface IVariant {
  _id?: string;
  color: IColor | string; // Allow color to be either IColor or ObjectId string
  basePrice: number;
  discount: number;
  images: string[];
  subVariants: ISubVariant[];
}

interface IBrand {
  _id: string;
  name: string;
}

interface ICategory {
  _id: string;
  name: string;
  status: string;
}

interface Iproduct {
  _id: string;
  masp: string;
  name: string;
  moTa: string;
  brand: IBrand | string; // Allow brand to be populated or ObjectId
  category: ICategory | string; // Allow category to be populated or ObjectId
  gender: string;
  status: boolean;
  variants: IVariant[];
  createdAt: string;
  updatedAt: string;
  comments?: { stars: number }[];
  __v?: number;
}

const ProductDetail = () => {
  const [products, setProducts] = useState<Iproduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Iproduct | undefined>(undefined);
  const [categoryName, setCategoryName] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [selectedSubVariant, setSelectedSubVariant] = useState<number | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [isInWishlist, setIsInWishlist] = useState<boolean>(false);

  // Fetch user data from sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser: IUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  // Fetch product details and check if the product is in the wishlist
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch product details
        const data = await getProductByID(id);
        console.log("Product fetched:", data);
        setProduct(data);

        // Initialize states based on variants
        if (data.variants && data.variants.length > 0 && data.variants[0].images && data.variants[0].images.length > 0) {
          setSelectedImage(data.variants[0].images[0]);
          setSelectedVariant(0);
          const firstColor = data.variants[0].color;
          setSelectedColorId(typeof firstColor === "string" ? firstColor : firstColor._id);
          if (data.variants[0].subVariants.length > 0) {
            setSelectedSubVariant(0);
          }
        } else {
          setSelectedImage(null);
          setSelectedVariant(null);
          setSelectedColorId(null);
          setSelectedSubVariant(null);
        }

        // Set category name directly from populated category
        if (typeof data.category !== "string" && data.category && data.category.name) {
          setCategoryName(data.category.name);
        } else {
          setCategoryName("Không xác định");
        }

        // Check if the product is in the wishlist
        if (user?.id && data._id) {
          const wishlistData = await getWishlist(user.id);
          const wishlistProductIds = wishlistData.map((item: Iproduct) => item._id);
          setIsInWishlist(wishlistProductIds.includes(data._id));
        }
      } catch (error) {
        console.error("Failed to fetch product or wishlist", error);
        setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id, user]);

  // Fetch similar products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const sanpham = await getAllproducts({ limit: 4, page: 1 });
        console.log("Similar products fetched:", sanpham.docs);
        setProducts(sanpham.docs || []);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  // Debug logging for selected states
  useEffect(() => {
    console.log("Selected Variant:", selectedVariant);
    console.log("Selected Sub-Variant:", selectedSubVariant);
    console.log("Selected Color ID:", selectedColorId);
    console.log("Selected Image:", selectedImage);
  }, [selectedVariant, selectedSubVariant, selectedColorId, selectedImage]);

  const handleVariantChange = (index: number) => {
    setSelectedVariant(index);
    setSelectedSubVariant(0);
    if (product && product.variants[index]?.images && product.variants[index].images.length > 0) {
      setSelectedImage(product.variants[index].images[0]);
    }
    if (product && product.variants[index]) {
      const color = product.variants[index].color;
      setSelectedColorId(typeof color === "string" ? color : color._id);
    }
  };

  const handleSubVariantChange = (index: number) => {
    setSelectedSubVariant(index);
  };

  const handleColorChange = (colorId: string) => {
    setSelectedColorId(colorId);
    if (!product || !product.variants) return;
    const variantIndex = product.variants.findIndex((v) => {
      const color = v.color;
      return (typeof color === "string" ? color : color._id) === colorId;
    });
    if (variantIndex !== -1) {
      setSelectedVariant(variantIndex);
      setSelectedSubVariant(0);
      if (product.variants[variantIndex].images && product.variants[variantIndex].images.length > 0) {
        setSelectedImage(product.variants[variantIndex].images[0]);
      }
    }
  };

  const calculateTotalPrice = (variant: IVariant | undefined, subVariantIndex: number | null): number => {
    if (!variant || subVariantIndex === null) return 0;
    const subVariant = variant.subVariants[subVariantIndex];
    const basePrice = variant.basePrice + (subVariant?.additionalPrice || 0);
    const discount = variant.discount || 0;
    const discountedPrice = basePrice - (basePrice * discount) / 100;
    return discountedPrice;
  };

  const calculateTotalQuantity = (variants: IVariant[] = [], variantIndex: number | null, subVariantIndex: number | null): number => {
    if (!variants || variantIndex === null || subVariantIndex === null) return 0;
    const selectedVariant = variants[variantIndex];
    const selectedSubVariant = selectedVariant.subVariants[subVariantIndex];
    return selectedSubVariant ? selectedSubVariant.quantity : 0;
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const isHTML = (str: string) => /<[a-z][\s\S]*>/i.test(str);

  // Handle add/remove from wishlist
  const handleToggleWishlist = async () => {
    if (!user?.id) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích!",
      });
      return;
    }

    if (!product?._id) {
      notification.error({
        message: "Lỗi",
        description: "Không thể xác định sản phẩm!",
      });
      return;
    }

    try {
      if (isInWishlist) {
        // Remove from wishlist
        await removeFromWishlist(user.id, product._id);
        setIsInWishlist(false);
        notification.success({
          message: "Thành công",
          description: "Sản phẩm đã được xóa khỏi danh sách yêu thích!",
        });
      } else {
        // Add to wishlist
        await addToWishlist(user.id, product._id);
        setIsInWishlist(true);
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
      <ToastContainer />
      <div className="max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-500">Đang tải sản phẩm...</p>
          </div>
        ) : error ? (
          <p className="text-center text-red-500 py-12">{error}</p>
        ) : product ? (
          <>
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-4">
              <NavLink to="/" className="hover:underline">Home</NavLink> {" > "}
              <NavLink to="/products" className="hover:underline">Phụ kiện</NavLink> {" > "} {product.name}
            </nav>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: Product Image and Thumbnails */}
              <div className="lg:w-1/2">
                {/* Discount Badge */}
                {selectedVariant !== null && product.variants && product.variants.length > 0 && product.variants[selectedVariant] && product.variants[selectedVariant].discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-semibold rounded-full px-3 py-1">
                    {product.variants[selectedVariant].discount}%
                  </div>
                )}

                {/* Main Image */}
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-96 object-contain rounded-lg mb-4 shadow-md"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/300?text=Image+Failed";
                    }}
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg shadow-md">
                    <p className="text-gray-500">Không có ảnh</p>
                  </div>
                )}

                {/* Thumbnails */}
                <div className="flex gap-2 overflow-x-auto">
                  {selectedVariant !== null && product.variants && product.variants.length > 0 && product.variants[selectedVariant] && product.variants[selectedVariant].images && product.variants[selectedVariant].images.length > 0 ? (
                    product.variants[selectedVariant].images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className={`w-16 h-16 object-contain border rounded-lg cursor-pointer ${selectedImage === image ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-300"} hover:shadow-md transition-all duration-200`}
                        onClick={() => setSelectedImage(image)}
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/150?text=Image+Failed";
                        }}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500">Không có ảnh thu nhỏ</p>
                  )}
                </div>
              </div>

              {/* Right: Product Details */}
              <div className="lg:w-1/2">
                {/* Product Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>

                {/* Pricing */}
                <div className="flex items-center mb-4">
                  {selectedVariant !== null && product.variants && product.variants.length > 0 && product.variants[selectedVariant] && product.variants[selectedVariant].discount > 0 ? (
                    <>
                      <span className="text-lg text-gray-500 line-through mr-2">
                        {formatPrice(product.variants[selectedVariant].basePrice)}
                      </span>
                      <span className="text-2xl font-bold text-red-500">
                        {formatPrice(calculateTotalPrice(product.variants[selectedVariant], selectedSubVariant))}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-gray-800">
                      {formatPrice(calculateTotalPrice(selectedVariant !== null && product.variants && product.variants.length > 0 ? product.variants[selectedVariant] : undefined, selectedSubVariant))}
                    </span>
                  )}
                  <span
                    className={`ml-4 text-xs font-semibold px-2.5 py-0.5 rounded ${calculateTotalQuantity(product.variants, selectedVariant, selectedSubVariant) > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {calculateTotalQuantity(product.variants, selectedVariant, selectedSubVariant) > 0 ? "Còn hàng" : "Hết hàng"}
                  </span>
                </div>

                {/* Color Selection */}
                {product.variants && product.variants.length > 0 && (
                  <div className="my-4">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Màu sắc:</h2>
                    <div className="flex gap-3 flex-wrap">
                      {Array.from(new Set(product.variants.map((v) => (typeof v.color === "string" ? v.color : v.color._id)))).map((colorId, index) => {
                        const variant = product.variants.find((v) => (typeof v.color === "string" ? v.color : v.color._id) === colorId);
                        if (!variant) return null;
                        const color = variant.color;
                        const isPopulated = typeof color !== "string";
                        return (
                          <button
                            key={index}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                              selectedColorId === colorId ? "bg-blue-100 border-blue-500 text-blue-700" : "bg-white border-gray-300 text-gray-700"
                            } hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            onClick={() => handleColorChange(colorId)}
                            aria-pressed={selectedColorId === colorId}
                            title={isPopulated ? color.name : "Không xác định"}
                          >
                            <span
                              className={`w-6 h-6 rounded-full shadow-sm ${
                                selectedColorId === colorId ? "ring-2 ring-blue-500" : ""
                              }`}
                              style={{ backgroundColor: isPopulated ? color.hexCode : "#808080" }}
                            ></span>
                            <span className="text-sm font-medium">{isPopulated ? color.name : "Không xác định"}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sub-variant Selection */}
                {selectedVariant !== null && product.variants && product.variants.length > 0 && product.variants[selectedVariant]?.subVariants.length > 0 && (
                  <div className="my-4">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Tùy chọn:</h2>
                    <div className="flex gap-3 flex-wrap">
                      {product.variants[selectedVariant].subVariants.map((subVariant, index) => (
                        <button
                          key={index}
                          className={`px-4 py-2 rounded-lg border ${selectedSubVariant === index ? "bg-blue-100 border-blue-500 text-blue-700" : "bg-white border-gray-300 text-gray-700"} hover:bg-blue-50 transition-colors duration-200`}
                          onClick={() => handleSubVariantChange(index)}
                          aria-pressed={selectedSubVariant === index}
                        >
                          {subVariant.value} ({subVariant.specification})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex items-center mb-6 gap-4">
                  <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200">
                    Liên hệ
                  </button>
                  <button
                    onClick={handleToggleWishlist}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors duration-200 ${
                      isInWishlist
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
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
                    {isInWishlist ? "Xóa khỏi danh sách yêu thích" : "Thêm vào danh sách yêu thích"}
                  </button>
                </div>

                {/* Product Details List */}
                <ul className="space-y-2 mb-6 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✔</span>
                    Giao hàng ngay hôm nay (đặt hàng trước Thứ Hai-Thứ Sáu trước 12:00, giao hàng từ 17:00 đến 22:00)
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✔</span>
                    Bao gồm chi phí vận chuyển, được gửi bởi Matbao.com
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✔</span>
                    Có thể nhận hàng tại điểm thu gom Matbao.com
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✔</span>
                    30 ngày để trả hoặc đổi nếu bạn không hài lòng
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✔</span>
                    Đổi trả miễn phí nếu có lỗi
                  </li>
                </ul>

                {/* SKU, Category, Tags */}
                <div className="text-gray-600 mb-6 space-y-1">
                  <p><strong>SKU:</strong> {product.masp}</p>
                  <p><strong>Danh mục:</strong> {categoryName}</p>
                  <p><strong>Giới tính:</strong> {product.gender}</p>
                </div>

                {/* Social Media Sharing */}
                <div className="flex gap-3">
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.326 3.608 1.301.975.975 1.24 2.242 1.301 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.326 2.633-1.301 3.608-.975.975-2.242 1.24-3.608 1.301-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.326-3.608-1.301-.975-.975-1.24-2.242-1.301-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.326-2.633 1.301-3.608.975.975 2.242 1.24 3.608 1.301 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.405.064-2.813.364-3.986 1.537S1.592 4.418 1.528 5.823C1.47 7.103 1.456 7.511 1.456 12s.014 4.897.072 6.177c.064 1.405.364 2.813 1.537 3.986s2.581 1.473 3.986 1.537c1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.405-.064 2.813-.364 3.986-1.537s1.473-2.581 1.537-3.986c.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.064-1.405-.364-2.813-1.537-3.986S19.582 1.59 18.177 1.526c-1.28-.058-1.688-.072-4.947-.072zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-blue-400 transition-colors duration-200">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-blue-700 transition-colors duration-200">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.62 0H4.38C1.96 0 0 1.96 0 4.38v15.24C0 22.04 1.96 24 4.38 24h15.24C22.04 24 24 22.04 24 19.62V4.38C24 1.96 22.04 0 19.62 0zM7.2 20.4H3.6V9H7.2v11.4zM5.4 7.56c-1.2 0-2.16-.96-2.16-2.16S4.2 3.24 5.4 3.24 7.56 4.2 7.56 5.4 6.6 7.56 5.4 7.56zm15 12.84h-3.6V14.4c0-1.44-.48-2.4-1.68-2.4-1.2 0-1.92.84-2.16 1.68-.12.36-.12.84-.12 1.32v5.4H9.24V9h3.48v1.56c.48-.72 1.32-1.68 3.12-1.68 2.28 0 4.08 1.56 4.08 4.92v6.6z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="mt-12 bg-white p-8 rounded-lg shadow-md">
              {product && (
                <>
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">Mô tả sản phẩm</h2>
                  {product.moTa ? (
                    <div className="text-gray-700 text-lg leading-relaxed">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {selectedVariant !== null && product.variants && product.variants.length > 0 && product.variants[selectedVariant]?.images.length > 0 ? (
                          <>
                            <img
                              className="w-full object-cover rounded-lg shadow-sm"
                              src={product.variants[selectedVariant].images[0]}
                              alt="Product description image 1"
                              onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/300?text=Image+Failed";
                              }}
                            />
                            {product.variants[selectedVariant].images.length > 1 && (
                              <img
                                className="w-full h-64 object-cover rounded-lg shadow-sm"
                                src={product.variants[selectedVariant].images[1]}
                                alt="Product description image 2"
                                onError={(e) => {
                                  e.currentTarget.src = "https://via.placeholder.com/300?text=Image+Failed";
                                }}
                              />
                            )}
                          </>
                        ) : (
                          <p className="text-gray-500 italic col-span-2">Không có ảnh mô tả.</p>
                        )}
                      </div>
                      <div className="mt-4 prose prose-lg max-w-none">
                        {isHTML(product.moTa) ? (
                          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.moTa) }} />
                        ) : (
                          <p>{product.moTa}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-lg">Chưa có mô tả cho sản phẩm này.</p>
                  )}
                </>
              )}
            </div>

            {/* Warranty and Shipping */}
            <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-blue-600 mb-4 text-center uppercase tracking-wider">
                Chính Sách Bảo Hành & Vận Chuyển - Click Mobile
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Bảo Hành</h3>
                  <ul className="list-disc pl-5 text-gray-700 space-y-2">
                    <li>Tất cả sản phẩm tại Click Mobile đều là hàng chính hãng, được kiểm định chất lượng trước khi đến tay khách hàng.</li>
                    <li>Click Mobile áp dụng chính sách bảo hành từ 6 tháng đến 12 tháng tùy theo từng sản phẩm.</li>
                    <li>Nếu sản phẩm gặp lỗi kỹ thuật do nhà sản xuất, khách hàng có thể liên hệ ngay với Click Mobile để được hỗ trợ sửa chữa hoặc đổi mới.</li>
                    <li>Không tự ý tháo lắp hoặc sửa chữa sản phẩm khi gặp lỗi, hãy liên hệ Click Mobile qua hotline 0344357227 để được hướng dẫn chi tiết.</li>
                    <li className="text-red-600">Lưu ý: Click Mobile không bảo hành các trường hợp hư hỏng do rơi vỡ, vào nước, tác động ngoại lực hoặc sử dụng sai cách.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Vận Chuyển</h3>
                  <ul className="list-disc pl-5 text-gray-700 space-y-2">
                    <li>Click Mobile hỗ trợ giao hàng toàn quốc với nhiều hình thức vận chuyển linh hoạt.</li>
                    <li>Miễn phí giao hàng trong khu vực nội thành TP. Hà Nội với đơn hàng trên 2 triệu VNĐ.</li>
                    <li>Đối với các tỉnh thành khác, phí vận chuyển sẽ được tính theo bảng giá của đơn vị vận chuyển.</li>
                    <li>Thời gian giao hàng từ 2-5 ngày tùy theo khu vực. Đơn hàng tại nội thành Hà Nội có thể được giao trong ngày.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Similar Products */}
            <div className="mt-12">
              <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Sản phẩm tương tự</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.slice(0, 4).map((product: Iproduct) => {
                  const basePrice = product.variants && product.variants.length > 0 ? product.variants[0].basePrice : 0;
                  const additionalPrice =
                    product.variants && product.variants.length > 0 && product.variants[0].subVariants.length > 0
                      ? product.variants[0].subVariants[0].additionalPrice || 0
                      : 0;
                  const discount = product.variants && product.variants.length > 0 ? product.variants[0].discount : 0;
                  const totalPrice = basePrice + additionalPrice;
                  const discountedPrice = totalPrice - (totalPrice * discount) / 100;

                  return (
                    <div key={product._id} className="relative">
                      {/* Discount Badge */}
                      {discount > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
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
                          src={
                            product.variants && product.variants.length > 0 && product.variants[0].images.length > 0
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
                            <span className="text-gray-500 text-sm line-through">{formatPrice(totalPrice)}</span>
                          )}
                          <span className="text-gray-800 text-sm font-semibold">{formatPrice(discountedPrice)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comments */}
            <div className="mt-12">
              {user ? (
                <CommentSection productId={id || ""} user={user} />
              ) : (
                <p className="text-gray-500 text-center">Bạn cần đăng nhập để bình luận.</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 py-12">Không tìm thấy sản phẩm.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;