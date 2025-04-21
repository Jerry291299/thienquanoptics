import React, { useEffect, useState } from "react";
import { notification } from "antd";
import { getWishlist, removeFromWishlist } from "../service/wishlist";
import Header2 from "./Header2";
import Footer from "./Footer";

interface Product {
  _id: string;
  masp: string;
  name: string;
  moTa: string;
  brand: { _id: string; name: string };
  category: { _id: string; name: string };
  gender: string;
  status: boolean;
  variants: Array<{
    color: { _id: string; name: string; hexCode: string };
    basePrice: number;
    discount?: number;
    images: string[];
    subVariants: Array<{
      specification: string;
      value: string;
      additionalPrice: number;
      quantity: number;
    }>;
  }>;
}

const Wishlist = () => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<{
    info: { role: string; name: string; email: string; id: string };
    id: string;
  } | null>(null);

  // Load user data from sessionStorage when the component mounts
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  }, []); // Empty dependency array: Run only once on mount

  // Fetch the wishlist when the user is available
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.id) return; // Don't fetch if userId is not available

      setLoading(true);
      try {
        const wishlistData = await getWishlist(user.id);
        setWishlist(wishlistData);
      } catch (error: any) {
        notification.error({
          message: "Lỗi",
          description: error.message || "Không thể tải danh sách yêu thích, vui lòng thử lại!",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]); // Depend on user directly

  // Function to remove a product from the wishlist
  const handleRemoveFromWishlist = async (productId: string) => {
    if (!user?.id) {
      notification.error({
        message: "Lỗi",
        description: "Không thể xác định người dùng. Vui lòng đăng nhập lại!",
      });
      return;
    }

    try {
      await removeFromWishlist(user.id, productId);
      setWishlist(wishlist.filter((item) => item._id !== productId));
      notification.success({
        message: "Thành công",
        description: "Sản phẩm đã được xóa khỏi danh sách yêu thích!",
      });
    } catch (error: any) {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể xóa sản phẩm khỏi danh sách yêu thích!",
      });
    }
  };

  return (
    <>
    <Header2/>
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
        Danh Sách Yêu Thích
      </h1>

      {!user ? (
        <div className="text-center text-gray-500">
          Vui lòng đăng nhập để xem danh sách yêu thích.
        </div>
      ) : loading ? (
        <div className="text-center text-gray-500">Đang tải...</div>
      ) : wishlist.length === 0 ? (
        <div className="text-center text-gray-500">
          Danh sách yêu thích của bạn đang trống.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col"
            >
              <div className="w-full h-48 mb-4">
                <img
                  src={product.variants[0]?.images[0] || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Thương hiệu: {product.brand.name}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Danh mục: {product.category.name}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Giá: {product.variants[0]?.basePrice.toLocaleString()} VND
                {product.variants[0]?.discount && (
                  <span className="text-red-500 ml-2">
                    (Giảm: {product.variants[0].discount.toLocaleString()} VND)
                  </span>
                )}
              </p>
              <button
                onClick={() => handleRemoveFromWishlist(product._id)}
                className="mt-auto px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
              >
                Xóa khỏi danh sách yêu thích
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default Wishlist;