import request from '@/utils/request';

//获取轮播图
export const getCarousel = () => {
  return request.get('v1/admin/carousel');
}

//上传轮播图信息
export const addCarousel = ({ img, url }) => {
  return request.post('v1/admin/carousel/upload/info', { img, url });
}

//删除轮播图
export const deleteCarousel = (id) => {
  return request.post('v1/admin/carousel/delete', { id });
}