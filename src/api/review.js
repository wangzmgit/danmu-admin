import request from '@/utils/request';

//获取审核视频列表
export const getReviewList = (page, page_size) => {
    return request.get('v1/admin/review/list?page=' + page + '&page_size=' + page_size);
}

export const review = ({ vid, status, remarks }) => {
    return request.post('v1/admin/review', { vid, status, remarks });
}

//获取审核视频的资源
export const videoResource = (vid) => {
    return request.get('v1/admin/video?vid=' + vid);
}
