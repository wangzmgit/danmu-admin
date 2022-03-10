import axios from 'axios';
import config from "../config";
import storage from "@/utils/stored-data.js";

const AdminURL = config.url + "api/";
export const SkinURL = AdminURL + "v1/admin/config/skin/upload";
export const CarouselUrl = AdminURL + "v1/admin/carousel/upload/img";
export const CoverUrl = AdminURL + "v1/admin/video/cover/upload";
export const VideoUrl = AdminURL + "v1/admin/video/resource/upload";

const service = axios.create({
    baseURL: AdminURL,
    timeout: 5000,
    headers: {},
});

service.interceptors.request.use((config) => {
    Object.assign(config.headers, { Authorization: `Bearer ${storage.get('admin')}` });
    return config;
}), (error) => {
    return Promise.reject(error);
}

export default service;