import request from '@/utils/request';

//登录
export const login = ({ email, password }) => {
  return request.post('v1/admin/login', { email, password });
}

//添加管理员
export const addAdmin = ({ name, email, password, authority }) => {
  authority = Number(authority);
  return request.post('v1/admin/add', { name, email, password, authority });
}

//获取管理员列表
export const getAdminList = (page, page_size) => {
  return request.get('v1/admin/list?page=' + page + '&page_size=' + page_size);
}

//删除管理员
export const deleteAdmin = (id) => {
  return request.post('v1/admin/delete', { id });
}

//获取公告频列表
export const getAnnounceList = () => {
  return request.get('v1/admin/announce/list');
}

//添加公告
export const addAnnounce = ({ title, content, url }) => {
  return request.post('v1/admin/announce/add', { title, content, url });
}

//删除公告
export const deleteAnnounce = (id) => {
  return request.post('v1/admin/announce/delete', { id });
}

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

//获取网站总体数据
export const getTotalData = () => {
  return request.get('v1/admin/data/total');
}

//获取网站近期数据
export const getRecentData = () => {
  return request.get('v1/admin/data');
}

//获取意见反馈列表
export const getOpinionList = (page, page_size) => {
  return request.get('v1/admin/opinion/list?page=' + page + '&page_size=' + page_size);
}

