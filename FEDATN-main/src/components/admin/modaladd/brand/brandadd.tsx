import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { upload } from "../../../../service/upload";
import { createBrand } from "../../../../service/brand";

const BrandAdd = () => {
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
      setError("Name is required");
      return;
    }
    if (images.length === 0) {
      setError("At least one image is required");
      return;
    }

    try {
      const imageUrls = await uploadImages(images);
      if (imageUrls.length === 0) {
        setError("Failed to upload image");
        return;
      }

      const payload = {
        name,
        image: imageUrls[0], // Use the first image
      };

      await createBrand(payload);
      showNotification("success", "Thành công", "Thêm thương hiệu thành công!");
      navigate("/admin/brands");
    } catch (error) {
      setError("Error creating brand");
      console.error(error);
      showNotification("error", "Lỗi", "Không thể thêm thương hiệu, vui lòng thử lại!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
        Add New Brand
      </h1>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Brand Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter brand name"
            required
          />
        </div>

        {/* Image Upload Field */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
            Brand Image
          </label>
          <div className="flex flex-wrap gap-4 mb-4">
            {imagePreviews.map((preview, imageIndex) => (
              <div
                key={imageIndex}
                className="relative w-32 h-32 group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-200"
              >
                <img
                  src={preview}
                  alt={`Preview ${imageIndex}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(imageIndex)}
                  className="absolute top-2 right-2 bg-red-600 text-white text-xs p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="relative">
            <input
              type="file"
              id="image"
              multiple
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              accept="image/*"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            Create Brand
          </button>
        </div>
      </form>
    </div>
  );
};

export default BrandAdd;