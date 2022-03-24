import request from '@/utils/request';

//添加视频
export const addVideo = ({ title, cover, desc, type }) => {
    return request.post('v1/admin/video/import', { title, cover, desc, type });
}

//删除视频
export const deleteVideo = (id) => {
    return request.post('v1/admin/video/delete', { id });
}

//获取视频列表
export const getVideoList = (page, page_size, video_from) => {
    return request.get('v1/admin/video/list?page=' + page + '&page_size=' + page_size + '&video_from=' + video_from);
}

//获取视频资源列表
export const getResourceList = (vid) => {
    return request.get('v1/admin/video/resource/list?vid=' + vid);
}

//添加资源
export const addResource = ({ vid, title, res360, res480, res720, res1080, original }) => {
    vid = Number(vid);
    return request.post('v1/admin/video/resource/import', { vid, title, res360, res480, res720, res1080, original });
}

//删除资源
export const deleteResource = (uuid) => {
    return request.post('v1/admin/video/resource/delete', { uuid });
}

//搜索视频
export const searchVideo = (page, page_size, keyword) => {
    return request.get('v1/admin/video/search?page=' + page + '&page_size=' + page_size + '&keyword=' + keyword);
}