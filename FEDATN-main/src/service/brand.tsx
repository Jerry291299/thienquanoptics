import { axiosservice } from "../config/API";
import { IBrand } from "../interface/brand";

export const getAllBrands = async (): Promise<IBrand[]> => {
  const response = await axiosservice.get("/api/brands");
  return response.data;
};

export const getBrandById = async (id: string): Promise<IBrand> => {
  const response = await axiosservice.get(`/api/brands/${id}`);
  return response.data;
};

export const createBrand = async (payload: { name: string; image: string }): Promise<IBrand> => {
  const response = await axiosservice.post("/api/brands", payload);
  return response.data;
};

export const updateBrand = async (id: string, payload: { name: string; image?: string }): Promise<IBrand> => {
  const response = await axiosservice.put(`/api/brands/${id}`, payload);
  return response.data;
};

export const deleteBrand = async (id: string): Promise<void> => {
  await axiosservice.delete(`/api/brands/${id}`);
};