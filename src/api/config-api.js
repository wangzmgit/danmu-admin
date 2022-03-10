import request from '@/utils/request';

//获取OSS配置
export const getOssConfig = () => {
    return request.get('v1/admin/config/oss/get');
}

//获取邮箱配置
export const getEmailConfig = () => {
    return request.get('v1/admin/config/email/get');
}

//获取其他配置
export const getOtherConfig = () => {
    return request.get('v1/admin/config/other/get');
}

//配置OSS
export const setOssConfig = ({ storage, bucket, endpoint, accesskeyId, accesskeySecret, domain }) => {
    return request.post('v1/admin/config/oss/set', { storage, bucket, endpoint, accesskeyId, accesskeySecret, domain });
}

//配置邮箱
export const setEmailConfig = ({ name, host, port, address, password }) => {
    port = Number(port)
    return request.post('v1/admin/config/email/set', { name, host, port, address, password });
}

//配置管理员账号
export const setAdminConfig = ({ email, password }) => {
    return request.post('v1/admin/config/admin/set', { email, password });
}

//配置其他信息
export const setOtherConfig = ({ coding, maxRes, videoUser }) => {
    maxRes = Number(maxRes);
    videoUser = Number(videoUser);
    return request.post('v1/admin/config/other/set', { coding, maxRes, videoUser });
}

//获取可用主题
export const getSkinList = () => {
    return request.get('v1/admin/config/skin/get');
}

// 应用主题
export const applySkin = (fileName) => {
    return request.post('v1/admin/config/skin/apply', { fileName });
}

// 删除主题
export const deleteSkin = (fileName) => {
    return request.post('v1/admin/config/skin/delete', { fileName });
}