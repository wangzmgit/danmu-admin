import request from '@/utils/request';

//添加分区
export const addPartition = ({ content, fid }) => {
    return request.post('v1/admin/partition/add', { content, fid });
}

//删除分区
export const deletePartition = (id) => {
    return request.post('v1/admin/partition/delete', { id });
}

//获取分区
export const getPartition = (fid) => {
    return request.get('v1/admin/partition/list?fid=' + fid);
}

//获取所有
export const getAllPartition = () => {
    return request.get('v1/admin/partition/all');
}