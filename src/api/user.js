import request from '@/utils/request';

//获取用户列表
export const getUserList = (page, page_size) => {
    return request.get('v1/admin/user/list?page=' + page + '&page_size=' + page_size);
}

//删除用户
export const deleteUser = (id) => {
    return request.post('v1/admin/user/delete', { id });
}

//修改用户
export const modifyUser = ({ id, name, email, sign }) => {
    return request.post('v1/admin/user/modify', { id, name, email, sign });
}

//获取用户信息(普通用户接口)
export const getUserByID = (uid) => {
    return request.get('v1/user/info/other?uid=' + uid);
}