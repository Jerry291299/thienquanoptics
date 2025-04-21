import React, { useEffect, useState } from "react";
import { Form, Input, Select, notification } from "antd";
import { getProductByID, updateProduct } from "../../../service/products";
import { Icategory } from "../../../interface/category";
import { getAllCategories } from "../../../service/category";
import { IColor } from "../../../interface/color";
import { getAllColors } from "../../../service/color";
import { IBrand } from "../../../interface/brand";
import { getAllBrands } from "../../../service/brand";
import { upload } from "../../../service/upload";
import LoadingComponent from "../../Loading";
import { useNavigate, useParams } from "react-router-dom";
import { IProductLite, ISubVariant, IVariant } from "../../../interface/products";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Mở rộng IVariant để bao gồm ảnh mới để tải lên
type ExtendedVariant = IVariant & {
  newImages: File[];
  imagePreviews: string[];
};

const ProductUpdate = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Icategory[]>([]);
  const [colors, setColors] = useState<IColor[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [product, setProduct] = useState<IProductLite | null>(null);
  const [variants, setVariants] = useState<ExtendedVariant[]>([]);
  const [description, setDescription] = useState<string>("");
  const navigate = useNavigate();

  // Cấu hình thanh công cụ React Quill
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["link"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "align",
    "font",
    "size",
    "link",
  ];

  const showNotification = (type: "success" | "error", title: string, description: string) => {
    notification[type]({
      message: title,
      description,
      placement: "topRight",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy danh mục
        const categoryData = await getAllCategories();
        setCategory(categoryData);

        // Lấy màu sắc
        const colorData = await getAllColors();
        setColors(colorData);

        // Lấy thương hiệu
        const brandData = await getAllBrands();
        setBrands(brandData);

        // Lấy sản phẩm
        const productData = await getProductByID(id);
        setProduct(productData);
        setDescription(productData.moTa || "");
        const extendedVariants = productData.variants.map((variant: IVariant) => ({
          ...variant,
          newImages: [],
          imagePreviews: variant.images,
        }));
        setVariants(extendedVariants);
        form.setFieldsValue({
          masp: productData.masp,
          name: productData.name,
          moTa: productData.moTa,
          brand: typeof productData.brand === "string" ? productData.brand : productData.brand._id,
          category: typeof productData.category === "string" ? productData.category : productData.category._id,
          gender: productData.gender,
        });
        console.log("Dữ liệu sản phẩm:", productData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        showNotification("error", "Lỗi", "Không thể tải dữ liệu, vui lòng thử lại!");
      }
    };
    fetchData();
  }, [id, form]);

  const activeCategories = category.filter((cat) => cat.status === "active");

  const handleVariantImageChange = (variantIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].newImages = [...updatedVariants[variantIndex].newImages, ...newFiles];
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    updatedVariants[variantIndex].imagePreviews = [...updatedVariants[variantIndex].imagePreviews, ...newPreviews];
    setVariants(updatedVariants);
  };

  const handleRemoveVariantImage = (variantIndex: number, url: string) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].imagePreviews = updatedVariants[variantIndex].imagePreviews.filter((image) => image !== url);
    updatedVariants[variantIndex].images = updatedVariants[variantIndex].images.filter((image) => image !== url);
    updatedVariants[variantIndex].newImages = updatedVariants[variantIndex].newImages.filter((file) => !URL.createObjectURL(file).includes(url));
    setVariants(updatedVariants);
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
        console.error("Lỗi khi tải ảnh lên:", error);
        showNotification("error", "Lỗi tải ảnh", "Không thể tải ảnh lên, vui lòng thử lại!");
      }
    }
    return urls;
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        color: "",
        basePrice: 0,
        discount: undefined,
        images: [],
        newImages: [],
        imagePreviews: [],
        subVariants: [{ specification: "", value: "", additionalPrice: 0, quantity: 0 }],
      },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const addSubVariant = (variantIndex: number) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].subVariants.push({ specification: "", value: "", additionalPrice: 0, quantity: 0 });
    setVariants(updatedVariants);
  };

  const removeSubVariant = (variantIndex: number, subIndex: number) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].subVariants = updatedVariants[variantIndex].subVariants.filter((_, i) => i !== subIndex);
    setVariants(updatedVariants);
  };

  const handleVariantChange = (index: number, key: keyof IVariant, value: string | number | undefined) => {
    const newVariants = [...variants];
    if (index >= newVariants.length) return;
    if (key === "color") {
      newVariants[index][key] = value as string;
      const colorIds = newVariants.map((v) => v.color);
      if (colorIds.filter((c) => c === value).length > 1) {
        showNotification("error", "Lỗi", "Màu sắc này đã tồn tại trong các biến thể khác!");
        return;
      }
    } else if (key === "basePrice") {
      newVariants[index][key] = value === "" || value === undefined ? 0 : Number(value);
    } else if (key === "discount") {
      newVariants[index][key] = value === "" || value === undefined ? undefined : Number(value);
    }
    setVariants(newVariants);
  };

  const handleSubVariantChange = (
    variantIndex: number,
    subIndex: number,
    key: keyof ISubVariant,
    value: string | number
  ) => {
    const updatedVariants = [...variants];
    if (variantIndex >= updatedVariants.length || subIndex >= updatedVariants[variantIndex].subVariants.length) return;
    const subVariants = [...updatedVariants[variantIndex].subVariants];
    if (key === "specification" || key === "value") {
      subVariants[subIndex][key] = value as string;
    } else if (key === "additionalPrice" || key === "quantity") {
      subVariants[subIndex][key] = value === "" || value === undefined ? 0 : Number(value);
    }
    updatedVariants[variantIndex].subVariants = subVariants;
    setVariants(updatedVariants);
  };

  const onFinish = async (values: any) => {
    if (!description || description === "<p><br></p>") {
      showNotification("error", "Lỗi", "Bắt buộc nhập mô tả sản phẩm!");
      return;
    }

    setLoading(true);

    const colorIds = variants.map((variant) => variant.color);
    const hasDuplicates = colorIds.length !== new Set(colorIds).size;
    if (hasDuplicates) {
      showNotification("error", "Lỗi", "Có màu sắc trùng lặp trong các biến thể!");
      setLoading(false);
      return;
    }

    for (const variant of variants) {
      if (!variant.color || variant.basePrice <= 0) {
        const colorName = colors.find((c) => c._id === variant.color)?.name || "chưa có màu";
        showNotification("error", "Lỗi", `Biến thể ${colorName} phải có màu sắc và giá cơ bản hợp lệ!`);
        setLoading(false);
        return;
      }
      if (variant.subVariants.length === 0) {
        const colorName = colors.find((c) => c._id === variant.color)?.name || "chưa có màu";
        showNotification("error", "Lỗi", `Biến thể ${colorName} phải có ít nhất một sub-variant!`);
        setLoading(false);
        return;
      }
      if (variant.images.length === 0 && variant.newImages.length === 0) {
        const colorName = colors.find((c) => c._id === variant.color)?.name || "chưa có màu";
        showNotification("error", "Lỗi", `Biến thể ${colorName} phải có ít nhất một ảnh!`);
        setLoading(false);
        return;
      }
      const subVariantKeys = variant.subVariants.map((sv) => `${sv.specification}-${sv.value}`);
      if (subVariantKeys.length !== new Set(subVariantKeys).size) {
        const colorName = colors.find((c) => c._id === variant.color)?.name || "chưa có màu";
        showNotification("error", "Lỗi", `Có sub-variant trùng lặp trong biến thể ${colorName}!`);
        setLoading(false);
        return;
      }
    }

    try {
      const updatedVariants = await Promise.all(
        variants.map(async (variant) => {
          const newImageUrls = await uploadImages(variant.newImages);
          return {
            color: variant.color, // Đây là _id của Color
            basePrice: Number(variant.basePrice),
            discount: variant.discount !== undefined ? Number(variant.discount) : undefined,
            images: [...variant.images, ...newImageUrls],
            subVariants: variant.subVariants
              .filter((sv) => sv.specification && sv.value && sv.quantity >= 0 && sv.additionalPrice >= 0)
              .map((sv) => ({
                specification: sv.specification,
                value: sv.value,
                additionalPrice: Number(sv.additionalPrice),
                quantity: Number(sv.quantity),
              })),
          };
        })
      );

      const validVariants = updatedVariants.filter(
        (variant) => variant.color && variant.basePrice > 0 && variant.subVariants.length > 0 && variant.images.length > 0
      );

      if (validVariants.length === 0) {
        showNotification("error", "Lỗi", "Phải có ít nhất một biến thể hợp lệ với sub-variant và ảnh!");
        setLoading(false);
        return;
      }

      const payload: IProductLite = {
        _id: id!,
        masp: values.masp,
        name: values.name,
        moTa: description,
        brand: values.brand, // Đây là _id của Brand
        category: values.category, // Đây là _id của Category
        gender: values.gender,
        status: true,
        variants: validVariants,
        discountCode: product?.discountCode,
        createdAt: product?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("Dữ liệu gửi đi:", JSON.stringify(payload, null, 2));

      await updateProduct(id!, payload);
      showNotification("success", "Thành công", "Cập nhật sản phẩm thành công!");
      navigate("/admin/dashboard", { state: { shouldRefetch: true } });
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      showNotification("error", "Lỗi", "Không thể cập nhật sản phẩm, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !product) {
    return <LoadingComponent />;
  }

  return (
    <>
      {loading && <LoadingComponent />}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
          Cập Nhật Sản Phẩm
        </h1>

        <Form form={form} onFinish={onFinish} layout="vertical" className="bg-white shadow-lg rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <Form.Item
                  name="masp"
                  label={<span className="text-sm font-medium text-gray-700">Mã Sản Phẩm</span>}
                  rules={[{ required: true, message: "Mã sản phẩm là bắt buộc!" }]}
                >
                  <Input
                    placeholder="Nhập mã sản phẩm"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  name="name"
                  label={<span className="text-sm font-medium text-gray-700">Tên Sản Phẩm</span>}
                  rules={[{ required: true, message: "Tên sản phẩm là bắt buộc!" }]}
                >
                  <Input
                    placeholder="Nhập tên sản phẩm"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  />
                </Form.Item>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Mô Tả Sản Phẩm</label>
                <ReactQuill
                  value={description}
                  onChange={(value) => setDescription(value)}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Nhập mô tả sản phẩm (hỗ trợ định dạng văn bản)"
                  className="h-40 mb-12"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Form.Item
                  name="category"
                  label={<span className="text-sm font-medium text-gray-700">Danh Mục</span>}
                  rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
                >
                  <Select
                    placeholder="Chọn danh mục"
                    className="w-full"
                    dropdownClassName="rounded-lg"
                    style={{ height: "48px" }}
                  >
                    {activeCategories.map((categoryID: Icategory) => (
                      <Select.Option key={categoryID._id} value={categoryID._id}>
                        {categoryID.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  name="gender"
                  label={<span className="text-sm font-medium text-gray-700">Giới Tính</span>}
                  rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
                >
                  <Select
                    placeholder="Chọn giới tính"
                    className="w-full"
                    dropdownClassName="rounded-lg"
                    style={{ height: "48px" }}
                  >
                    <Select.Option value="Male">Nam</Select.Option>
                    <Select.Option value="Female">Nữ</Select.Option>
                    <Select.Option value="Kids">Trẻ Em</Select.Option>
                  </Select>
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  name="brand"
                  label={<span className="text-sm font-medium text-gray-700">Thương Hiệu</span>}
                  rules={[{ required: true, message: "Vui lòng chọn thương hiệu!" }]}
                >
                  <Select
                    placeholder="Chọn thương hiệu"
                    className="w-full"
                    dropdownClassName="rounded-lg"
                    style={{ height: "48px" }}
                  >
                    {brands.map((brand: IBrand) => (
                      <Select.Option key={brand._id} value={brand._id}>
                        {brand.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Biến Thể Sản Phẩm</h3>
            {variants.map((variant, variantIndex) => (
              <div key={variantIndex} className="mb-6 border border-gray-200 p-6 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Màu Sắc</label>
                    <Select
                      placeholder="Chọn màu sắc"
                      value={variant.color}
                      onChange={(value) => handleVariantChange(variantIndex, "color", value)}
                      className="w-full"
                      dropdownClassName="rounded-lg"
                      style={{ height: "48px" }}
                    >
                      {colors.map((color: IColor) => (
                        <Select.Option key={color._id} value={color._id}>
                          <div className="flex items-center">
                            <span
                              className="inline-block w-4 h-4 mr-2 rounded-full"
                              style={{ backgroundColor: color.hexCode }}
                            ></span>
                            {color.name}
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                  <Form.Item
                    name={`basePrice-${variantIndex}`}
                    label={<span className="text-sm font-medium text-gray-700">Giá Cơ Bản (VND)</span>}
                    rules={[{ required: true, message: "Giá cơ bản là bắt buộc!" }]}
                  >
                    <Input
                      type="number"
                      placeholder="Nhập giá cơ bản"
                      value={variant.basePrice}
                      onChange={(e) => handleVariantChange(variantIndex, "basePrice", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    />
                  </Form.Item>
                  <Form.Item
                    name={`discount-${variantIndex}`}
                    label={<span className="text-sm font-medium text-gray-700">Giảm Giá (VND)</span>}
                  >
                    <Input
                      type="number"
                      placeholder="Nhập giảm giá (không bắt buộc)"
                      value={variant.discount}
                      onChange={(e) => handleVariantChange(variantIndex, "discount", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    />
                  </Form.Item>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeVariant(variantIndex)}
                      className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
                    >
                      Xóa Biến Thể
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 block mb-2">Ảnh Biến Thể</label>
                  <div className="flex flex-wrap gap-4 mb-4">
                    {variant.imagePreviews.map((preview, imageIndex) => (
                      <div
                        key={imageIndex}
                        className="relative w-32 h-32 group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-200"
                      >
                        <img
                          src={preview}
                          alt={`Xem trước ${imageIndex}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveVariantImage(variantIndex, preview)}
                          className="absolute top-2 right-2 bg-red-600 text-white text-xs p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="relative">
                    <Input
                      type="file"
                      multiple
                      onChange={(e) => handleVariantImageChange(variantIndex, e)}
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      accept="image/*"
                    />
                  </div>
                </div>

                <div className="ml-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Sub-Variants</h4>
                  {variant.subVariants.map((subVariant, subIndex) => (
                    <div key={subIndex} className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4 items-end">
                      <Form.Item
                        name={`specification-${variantIndex}-${subIndex}`}
                        label={<span className="text-sm font-medium text-gray-700">Thông Số</span>}
                        rules={[{ required: true, message: "Thông số là bắt buộc!" }]}
                      >
                        <Input
                          placeholder="Ví dụ: Dung lượng"
                          value={subVariant.specification}
                          onChange={(e) => handleSubVariantChange(variantIndex, subIndex, "specification", e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        />
                      </Form.Item>
                      <Form.Item
                        name={`value-${variantIndex}-${subIndex}`}
                        label={<span className="text-sm font-medium text-gray-700">Giá Trị</span>}
                        rules={[{ required: true, message: "Giá trị là bắt buộc!" }]}
                      >
                        <Input
                          placeholder="Ví dụ: 128GB"
                          value={subVariant.value}
                          onChange={(e) => handleSubVariantChange(variantIndex, subIndex, "value", e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        />
                      </Form.Item>
                      <Form.Item
                        name={`additionalPrice-${variantIndex}-${subIndex}`}
                        label={<span className="text-sm font-medium text-gray-700">Giá Thêm (VND)</span>}
                        rules={[{ required: true, message: "Giá thêm là bắt buộc!" }]}
                      >
                        <Input
                          type="number"
                          placeholder="Giá thêm"
                          value={subVariant.additionalPrice}
                          onChange={(e) => handleSubVariantChange(variantIndex, subIndex, "additionalPrice", e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        />
                      </Form.Item>
                      <Form.Item
                        name={`subQuantity-${variantIndex}-${subIndex}`}
                        label={<span className="text-sm font-medium text-gray-700">Số Lượng</span>}
                        rules={[{ required: true, message: "Số lượng là bắt buộc!" }]}
                      >
                        <Input
                          type="number"
                          placeholder="Số lượng"
                          value={subVariant.quantity}
                          onChange={(e) => handleSubVariantChange(variantIndex, subIndex, "quantity", e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        />
                      </Form.Item>
                      <div>
                        <button
                          type="button"
                          onClick={() => removeSubVariant(variantIndex, subIndex)}
                          className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addSubVariant(variantIndex)}
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200"
                  >
                    Thêm Sub-Variant
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addVariant}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
              Thêm Biến Thể
            </button>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
              Cập Nhật Sản Phẩm
            </button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ProductUpdate;