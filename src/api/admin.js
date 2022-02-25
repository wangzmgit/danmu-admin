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
