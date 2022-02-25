import request from '@/utils/request'

//获取合集列表
export const getCollectionList = (page, page_size) => {
    return request.get('v1/collection/list/get?page=' + page + '&page_size=' + page_size);
}

//删除合集
export const deleteCollection = (id) => {
    return request.post('v1/admin/collection/delete', { id });
}