import { Icategory } from "./category";

export interface ISubVariant {
  specification: string;
  value: string;
  additionalPrice: number;
  quantity: number;
}

export interface IVariant {
  color: string;
  basePrice: number;
  discount?: number;
  img: string[];
  subVariants: ISubVariant[];
}

export interface Iproduct {
  _id: string;
  masp: string;
  name: string;
  moTa: string;
  brand: string;
  category: Icategory;
  gender: string;
  status: boolean;
  variants: IVariant[];
  discountCode?: string;
  createdAt: string;
  updatedAt: string;
}

export type IProductLite = Pick<
  Iproduct,
  "_id" | "masp" | "name" | "category" | "status" | "moTa" | "brand" | "variants" | "discountCode" | "createdAt" | "updatedAt" | "gender"
> & {
  price?: number;
  soLuong?: number;
};