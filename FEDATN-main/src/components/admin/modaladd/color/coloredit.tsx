import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { notification } from "antd";
import { SketchPicker } from "react-color";
import { getColorById, updateColor } from "../../../../service/color";
import { IColor } from "../../../../interface/color";

const ColorEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [color, setColor] = useState<IColor | null>(null);
  const [name, setName] = useState<string>("");
  const [hexCode, setHexCode] = useState<string>("");
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
    const fetchColor = async () => {
      if (!id) return;
      try {
        const data = await getColorById(id);
        setColor(data);
        setName(data.name);
        setHexCode(data.hexCode);
      } catch (error) {
        setError("Lỗi khi tải màu sắc");
        console.error(error);
      }
    };
    fetchColor();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !hexCode) {
      setError("Tên và mã màu (hex code) là bắt buộc");
      return;
    }

    try {
      const payload = { name, hexCode };
      if (!id) throw new Error("Color ID is missing");
      await updateColor(id, payload);
      showNotification("success", "Thành công", "Cập nhật màu sắc thành công!");
      navigate("/admin/colors");
    } catch (error) {
      setError("Lỗi khi cập nhật màu sắc");
      console.error(error);
      showNotification("error", "Lỗi", "Không thể cập nhật màu sắc, vui lòng thử lại!");
    }
  };

  if (!color) {
    return (
      <div className="text-center py-10">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="text-gray-600 text-lg mt-4">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Card Container */}
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Chỉnh sửa màu sắc</h1>

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
              Cập nhật màu sắc
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ColorEdit;