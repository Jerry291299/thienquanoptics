import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { notification } from "antd";
import { upload } from "../../../../service/upload";
import { IBrand } from "../../../../interface/brand";
import { getBrandById, updateBrand } from "../../../../service/brand";

const BrandEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [brand, setBrand] = useState<IBrand | null>(null);
  const [name, setName] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const showNotification = (type: "success" | "error", title: string, description: string) => {
    notification[type]({
      message: title,
      description,
      placement: "topRight",
    });
  };

  useEffect(() => {
    const fetchBrand = async () => {
      if (!id) return;
      try {
        const data = await getBrandById(id);
        setBrand(data);
        setName(data.name);
        setImagePreviews([data.image]);
      } catch (error) {
        setError("Error fetching brand");
        console.error(error);
      }
    };
    fetchBrand();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setImages([...images, ...newFiles]);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (imageIndex: number) => {
    setImages(images.filter((_, i) => i !== imageIndex));
    setImagePreviews(imagePreviews.filter((_, i) => i !== imageIndex));
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("images", file);
      try {
        const response = await upload(formData);
        urls.push(response.payload[0].url);
      } catch (error) {
        console.error("Error uploading image:", error);
        showNotification("error", "Lỗi tải ảnh", "Không thể tải ảnh lên, vui lòng thử lại!");
      }
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setError("Tên thương hiệu là bắt buộc");
      return;
    }

    try {
      let imageUrl: string | undefined = brand?.image;
      if (images.length > 0) {
        const uploadedUrls = await uploadImages(images);
        if (uploadedUrls.length === 0) {
          setError("Không thể tải ảnh lên");
          return;
        }
        imageUrl = uploadedUrls[0];
      } else if (imagePreviews.length === 0) {
        setError("Cần ít nhất một hình ảnh");
        return;
      }

      const payload: { name: string; image?: string } = { name };
      if (imageUrl) {
        payload.image = imageUrl;
      }

      if (!id) throw new Error("Brand ID is missing");
      await updateBrand(id, payload);
      showNotification("success", "Thành công", "Cập nhật thương hiệu thành công!");
      navigate("/admin/brands");
    } catch (error) {
      setError("Lỗi khi cập nhật thương hiệu");
      console.error(error);
      showNotification("error", "Lỗi", "Không thể cập nhật thương hiệu, vui lòng thử lại!");
    }
  };

  if (!brand) return <p className="text-center text-gray-500 text-lg">Đang tải...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Card Container */}
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Chỉnh sửa thương hiệu</h1>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Tên thương hiệu
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
              placeholder="Nhập tên thương hiệu"
            />
          </div>

          {/* Image Field */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh
            </label>
            <div className="flex flex-wrap gap-4 mb-4">
              {imagePreviews.map((preview, imageIndex) => (
                <div
                  key={imageIndex}
                  className="relative w-32 h-32 group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <img
                    src={preview}
                    alt={`Preview ${imageIndex}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(imageIndex)}
                    className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16V8m0 0L3 12m4-4l4 4m6 4v-4m0 0l-4-4m4 4l4 4m-4-12v12"
                />
              </svg>
              <span className="mt-2 text-sm text-gray-600">Chọn hình ảnh để tải lên</span>
              <input
                type="file"
                id="image"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              Cập nhật thương hiệu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandEdit;