import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IColor } from "../../../../interface/color";
import { getAllColors, deleteColor } from "../../../../service/color";

const ColorList = () => {
  const [colors, setColors] = useState<IColor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        setLoading(true);
        const data = await getAllColors();
        setColors(data);
      } catch (error) {
        console.error("Error fetching colors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchColors();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa màu này không?")) {
      try {
        await deleteColor(id);
        setColors(colors.filter((color) => color._id !== id));
      } catch (error) {
        console.error("Error deleting color:", error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Danh sách màu sắc</h1>
        <Link
          to="/admin/colors/add"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        >
          Thêm màu mới
        </Link>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 animate-pulse"
            >
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
              <div className="flex justify-center space-x-2">
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : colors.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">Không tìm thấy màu sắc nào.</p>
          <Link
            to="/admin/colors/add"
            className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
          >
            Thêm màu ngay
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {colors.map((color) => (
            <div
              key={color._id}
              className="bg-white shadow-md rounded-lg p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
            >
              <div
                className="w-full h-48 rounded-lg border border-gray-200 shadow-sm"
                style={{ backgroundColor: color.hexCode }}
              ></div>
              <div className="mt-4 text-center">
                <h3 className="text-gray-800 text-lg font-semibold truncate">{color.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{color.hexCode}</p>
                <div className="mt-4 flex justify-center space-x-3">
                  <Link
                    to={`/admin/colors/edit/${color._id}`}
                    className="px-4 py-2 bg-yellow-500 text-white font-medium rounded-lg shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-200"
                  >
                    Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(color._id)}
                    className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorList;