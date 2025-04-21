import mongoose, { Schema, Document } from "mongoose";

export interface IBrand extends Document {
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true }, // URL or path to the brand image
  },
  { timestamps: true }
);

const Brand = mongoose.model<IBrand>("Brand", BrandSchema);

export default Brand;