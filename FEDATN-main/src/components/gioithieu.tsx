import { Link, NavLink, useNavigate } from "react-router-dom";
import Facebook from "../anh/Facebook.png";
import heart from "../anh/heart.png";
import noti from "../anh/notification.png";
import shoppingcard from "../anh/shopping-cart.png";
import insta from "../anh/Instagram.png";
import link from "../anh/LinkedIn.png";
import twitter from "../anh/Twitter.png";
import nguoi from "../anh/user.png";
import logo from "./img/logothiênquangdo-01.png";
import { useEffect, useState } from "react";
import iconarrow from "./icons/down-arrow_5082780.png";
import canho from "./img/etty.png";
import Header2 from "./Header2";
import Footer from "./Footer";

const Gioithieu = () => {
  const [user, setUser] = useState<{
    info: { role: string; email: string; id: string };
    id: string;
  } | null>(null);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const Navigate = useNavigate();

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    Navigate("/");
  };

  return (
    <>
      <Header2 />
      <section
        className="relative bg-cover bg-center py-16"
        style={{
          backgroundImage: `url('https://klbtheme.com/blonwe/glasses/wp-content/uploads/sites/11/2023/10/about-image-1.jpg')`,
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black opacity-30"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Subheading */}
          <h2 className="text-lg font-semibold text-white mb-2">
            Giới thiệu về Blonwe
          </h2>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            BẠN CÓ MUỐN BIẾT CHÚNG TÔI KHÔNG?
          </h1>

          {/* Main Text */}
          <p className="text-xl md:text-2xl text-white mb-4">
          Hãy để chúng tôi giới thiệu ngắn gọn về furnob cho bạn để bạn hiểu rõ hơn về chất lượng của chúng tôi.          </p>

          
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading and Paragraph */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Chào mừng bạn đến với không gian mua sắm mắt kính trực tuyến – nơi hội tụ của sự sáng tạo, công nghệ tiên tiến và phong cách thời trang độc đáo.
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
              Chào mừng bạn đến với không gian mua sắm mắt kính trực tuyến – nơi hội tụ của sự sáng tạo, công nghệ tiên tiến và phong cách thời trang độc đáo. Đây là nơi chúng tôi mang đến cho bạn những sản phẩm mắt kính chất lượng, đa dạng về màu sắc, mẫu mã và phù hợp với nhiều phong cách khác nhau. Mỗi chiếc kính không chỉ là một phụ kiện bảo vệ đôi mắt mà còn là biểu tượng thể hiện cá tính và phong cách sống hiện đại.
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800">350+</h3>
              <p className="text-gray-600">Cửa hàng</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800">30.459</h3>
              <p className="text-gray-600">Đánh giá tốt</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800">800K</h3>
              <p className="text-gray-600">Sản phẩm bán ra</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800">1950+</h3>
              <p className="text-gray-600">Sản phẩm</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800">2.8K</h3>
              <p className="text-gray-600">Đơn hàng</p>
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="flex justify-center">
              <img
                src="https://8518.matbao.website/wp-content/uploads/2023/03/about-image-2.jpg"
                alt="People working with laptop"
                className="w-full  object-cover rounded-lg max-w-lg"
              />
            </div>
            <div className="flex justify-center">
              <img
                src="https://8518.matbao.website/wp-content/uploads/2023/03/about-image-3.jpg"
                alt="People discussing with laptop"
                className="w-full object-cover rounded-lg max-w-md object-[top_20%]"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <span className="text-2xl font-bold text-gray-400 mr-2">01.</span>
            <h2 className="text-lg font-semibold text-gray-600">
              Sứ Mệnh Và Tầm Nhìn
            </h2>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Sứ mệnh của chúng tôi là đem đến trải nghiệm mua sắm trực tuyến hoàn hảo, kết hợp giữa công nghệ hiện đại và thiết kế thời trang định cao.
          </h1>
        </div>

        {/* Content and Image */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image */}
          <div className="lg:w-1/2">
            <img
              src="https://8518.matbao.website/wp-content/uploads/2023/03/about-image-4.jpg"
              alt="People working with laptops"
              className="w-full   object-cover rounded-lg"
            />
          </div>

          {/* Text Content */}
          <div className="lg:w-1/2">
            {/* Paragraph */}
            <p className="text-base md:text-lg text-gray-600 mb-6">
              Sứ mệnh của chúng tôi là đem đến trải nghiệm mua sắm trực tuyến hoàn hảo, kết hợp giữa công nghệ hiện đại và thiết kế thời trang định cao. Chúng tôi cam kết cung cấp những sản phẩm mắt kính được lựa chọn kỹ càng từ các nguồn cung ứng uy tín, đảm bảo tiêu chuẩn chất lượng cao và vẻ đẹp tinh tế. Mục tiêu của trang web là trở thành nguồn cảm hứng hàng đầu cho những ai yêu thích phong cách và bảo vệ sức khỏe đôi mắt.
            </p>
            <p className="text-base md:text-lg text-gray-600 mb-6">
              Tầm nhìn của chúng tôi hướng đến việc tạo ra một cộng đồng yêu thời trang, nơi mọi người đều có thể dễ dàng khám phá và lựa chọn chiếc kính ứng ý, góp phần tôn vinh vẻ đẹp cá nhân. Chúng tôi tin rằng, qua mỗi sản phẩm, thông điệp về sự tự tin và đẳng cấp sẽ được lan tỏa, giúp bạn tự tin thể hiện bản thân trong mọi hoàn cảnh.
            </p>

            {/* List */}
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-gray-800 mr-2">•</span>
                  <strong>Kính Cận:</strong> Những mẫu kính cận được thiết kế với khung mạnh, nhẹ nhàng nhưng không kém phần thời trang, giúp tăng cường vẻ đẹp tự nhiên của khuôn mặt. Thấu kính được tối ưu để giảm thiểu ánh sáng xanh, bảo vệ mắt khỏi những tác hại từ màn hình số.
                </li>
              <li className="flex items-start">
                <span className="text-gray-800 mr-2">•</span>
                  <strong>Kính Râm:</strong> Vẻ ngoài thời thượng và trẻ trung, kính râm không chỉ bảo vệ mắt mà còn mang lại sự tự tin và phong cách thời trang nổi bật. Những mẫu kính râm với khung kính đa dạng, phù hợp với nhiều phong cách khác nhau.
                </li>
              <li className="flex items-start">
                <span className="text-gray-800 mr-2">•</span>
                  <strong>Kính Thể Thao:</strong> Dành cho những tín đồ yêu thể thao, các mẫu kính thể thao được thiết kế để đảm bảo độ bền cao, chống trầy xước, chống tia UV và phù hợp với mọi hoạt động ngoài trời. Mỗi chiếc kính không chỉ giúp bạn bảo vệ đôi mắt mà còn là biểu tượng của phong cách năng động.
                </li>
            </ul>
          </div>
        </div>
      </div>
      </div>

    <Footer/>
    </>
  );
};

export default Gioithieu;