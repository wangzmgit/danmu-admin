import request from '@/utils/request';

//获取公告列表
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
