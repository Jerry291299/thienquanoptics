import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { SketchPicker } from "react-color";
import { createColor } from "../../../../service/color";

const ColorAdd = () => {
  const [name, setName] = useState<string>("");
  const [hexCode, setHexCode] = useState<string>("#000000");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const showNotification = (type: "success" | "error", title: string, description: string) => {
    notification[type]({
      message: title,
      description,
      placement: "topRight",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !hexCode) {
      setError("Tên và mã màu (hex code) là bắt buộc");
      return;
    }

    try {
      const payload = { name, hexCode };
      await createColor(payload);
      showNotification("success", "Thành công", "Thêm màu sắc thành công!");
      navigate("/admin/colors");
    } catch (error) {
      setError("Lỗi khi thêm màu sắc");
      console.error(error);
      showNotification("error", "Lỗi", "Không thể thêm màu sắc, vui lòng thử lại!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Card Container */}
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Thêm màu sắc mới</h1>

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
              Tên màu sắc
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
              placeholder="Nhập tên màu sắc"
            />
          </div>

          {/* Color Picker Field */}
          <div>
            <label htmlFor="hexCode" className="block text-sm font-medium text-gray-700 mb-2">
              Mã màu (Hex Code)
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <SketchPicker
                  color={hexCode}
                  onChangeComplete={(color) => setHexCode(color.hex)}
                  className="shadow-md rounded-lg"
                />
              </div>
              <div
                className="w-16 h-16 rounded-lg border border-gray-200 shadow-sm"
                style={{ backgroundColor: hexCode }}
              ></div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              Thêm màu sắc
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ColorAdd;