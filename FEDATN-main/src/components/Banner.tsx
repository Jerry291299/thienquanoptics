import React from "react";


const Banner = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* First Banner Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-16">
          {/* Text Section */}
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mb-4">
              Một cách để chọn ống kính hoàn hảo cho gọng kính của bạn!
            </h2>
            <p className="text-gray-600 text-base md:text-lg mb-6">
              Kính hở trắng không chỉ là phụ kiện làm nổi bật phong cách mà còn là đầu tư cho sức
              khỏe đôi mắt. Để chiếc kính luôn giữ được vẻ đẹp ban đầu và chất lượng bảo vệ tối ưu,
              việc chăm sóc và bảo quản đúng cách vô cùng quan trọng.
            </p>
            <button className="bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-200">
              Mua ngay
            </button>
          </div>
          {/* Image Section */}
          <div className="lg:w-1/2 flex justify-center">
            <img
              src="https://klbtheme.com/blonwe/glasses/wp-content/uploads/sites/11/2023/05/glasses-custom-image-01.png"
              alt="Lens 1"
              className="w-full max-w-md object-contain"
            />
          </div>
        </div>

        {/* Second Banner Section */}
        <div className="flex flex-col lg:flex-row-reverse items-center justify-between">
          {/* Text Section */}
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mb-4">
              Tạo ra những kết tắc thú vị, từng dự án một.
            </h2>
            <p className="text-gray-600 text-base md:text-lg mb-6">
              Kính hở trắng không chỉ là phụ kiện làm nổi bật phong cách mà còn là đầu tư cho sức
              khỏe đôi mắt. Để chiếc kính luôn giữ được vẻ đẹp ban đầu và chất lượng bảo vệ tối ưu,
              việc chăm sóc và bảo quản đúng cách vô cùng quan trọng.
            </p>
            <button className="bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-200">
              Mua ngay
            </button>
          </div>
          {/* Image Section */}
          <div className="lg:w-1/2 flex justify-center">
            <img
              src="https://klbtheme.com/blonwe/glasses/wp-content/uploads/sites/11/2023/05/glasses-custom-image-02.png"
              alt="Lens 2"
              className="w-full max-w-md object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;