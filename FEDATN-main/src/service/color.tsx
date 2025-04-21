import { axiosservice } from "../config/API";
import { IColor } from "../interface/color";



export const getAllColors = async (): Promise<IColor[]> => {
  const response = await axiosservice.get("/api/colors");
  return response.data;
};

export const getColorById = async (id: string): Promise<IColor> => {
  const response = await axiosservice.get(`/api/colors/${id}`);
  return response.data;
};

export const createColor = async (payload: { name: string; hexCode: string }): Promise<IColor> => {
  const response = await axiosservice.post("/api/colors", payload);
  return response.data;
};

export const updateColor = async (id: string, payload: { name: string; hexCode: string }): Promise<IColor> => {
  const response = await axiosservice.put(`/api/colors/${id}`, payload);
  return response.data;
};

export const deleteColor = async (id: string): Promise<void> => {
  await axiosservice.delete(`/api/colors/${id}`);
};