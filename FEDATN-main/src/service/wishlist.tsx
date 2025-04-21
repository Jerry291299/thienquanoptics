import { axiosservice } from "../config/API";

export const addToWishlist = async (userId: string, productId: string) => {
    try {
      const response = await axiosservice.post("/api/wishlist/add", { userId, productId });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Không thể thêm sản phẩm vào danh sách yêu thích");
    }
  };
  
  // Remove a product from the wishlist
  export const removeFromWishlist = async (userId: string, productId: string) => {
    try {
      const response = await axiosservice.post("/api/wishlist/remove" ,{ userId, productId });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Không thể xóa sản phẩm khỏi danh sách yêu thích");
    }
  };
  
  // Get the user's wishlist
  export const getWishlist = async (userId: string) => {
    try {
      const response = await axiosservice.get(`/api/wishlist/${userId}`);
      return response.data.wishlist;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Không thể lấy danh sách yêu thích");
    }
  };