import mongoose, { Schema, Document } from "mongoose";

export interface IColor extends Document {
  name: string;
  hexCode: string; // Store the color as a hex code (e.g., #FF0000 for red)
  createdAt: Date;
  updatedAt: Date;
}

const ColorSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    hexCode: { type: String, required: true }, // Hex code for the color
  },
  { timestamps: true }
);

const Color = mongoose.model<IColor>("Color", ColorSchema);

export default Color;