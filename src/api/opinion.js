import request from '@/utils/request';

//获取意见反馈列表
export const getOpinionList = (page, page_size) => {
    return request.get('v1/admin/opinion/list?page=' + page + '&page_size=' + page_size);
}
