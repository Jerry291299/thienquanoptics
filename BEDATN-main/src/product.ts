import mongoose, { Schema, Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface SubVariant {
  specification: string;
  value: string;
  additionalPrice: number;
  quantity: number;
}

export interface Variant {
  color: mongoose.Schema.Types.ObjectId; // Reference to Color model
  basePrice: number;
  discount?: number;
  images: string[];
  subVariants: SubVariant[];
}

export interface Product extends Document {
  masp: string;
  name: string;
  moTa: string;
  brand: mongoose.Schema.Types.ObjectId; // Reference to Brand model
  category: mongoose.Schema.Types.ObjectId;
  gender: string;
  status: boolean;
  variants: Variant[];
  createdAt: Date;
  updatedAt: Date;
}

const SubVariantSchema: Schema = new Schema({
  specification: { type: String, required: true },
  value: { type: String, required: true },
  additionalPrice: { type: Number, required: true, default: 0 },
  quantity: { type: Number, required: true, min: 0 },
});

const VariantSchema: Schema = new Schema({
  color: { type: Schema.Types.ObjectId, ref: "Color", required: true }, // Reference to Color
  basePrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  images: [{ type: String, required: true }],
  subVariants: [SubVariantSchema],
});

const ProductSchema: Schema = new Schema(
  {
    masp: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    moTa: { type: String, required: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true }, // Reference to Brand
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    gender: {
      type: String,
      enum: ["Male", "Female", "Kids"],
      required: true,
    },
    status: { type: Boolean, required: true },
    variants: [VariantSchema],
  },
  { timestamps: true }
);

export function checkDuplicateVariants(variants: Variant[]): Error | null {
  const variantSet = new Set();
  for (const variant of variants) {
    const variantKey = `${variant.color}`;
    if (variantSet.has(variantKey)) {
      return new Error(
        `Có biến thể trùng lặp trong sản phẩm: Color: ${variant.color}`
      );
    }
    variantSet.add(variantKey);

    const subVariantSet = new Set();
    for (const subVariant of variant.subVariants) {
      const subKey = `${subVariant.specification}-${subVariant.value}`;
      if (subVariantSet.has(subKey)) {
        return new Error(
          `Có sub-variant trùng lặp trong ${variant.color}: ${subVariant.specification}-${subVariant.value}`
        );
      }
      subVariantSet.add(subKey);
    }
  }
  return null;
}

ProductSchema.index({ masp: 1, name: 1 }, { unique: true });
ProductSchema.plugin(mongoosePaginate);

const Product = mongoose.model<Product, mongoose.PaginateModel<Product>>(
  "Product",
  ProductSchema
);

export default Product;