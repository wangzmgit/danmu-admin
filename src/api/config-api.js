import request from '@/utils/request';

//获取OSS配置
export const getOssConfig = () => {
    return request.get('v1/admin/config/oss/get');
}

//获取邮箱配置
export const getEmailConfig = () => {
    return request.get('v1/admin/config/email/get');
}

//配置OSS
export const setOssConfig = ({bucket, endpoint, accesskeyId, accesskeySecret, domain}) => {
    return request.post('v1/admin/config/oss/set', {bucket, endpoint, accesskeyId, accesskeySecret, domain});
}

//配置邮箱
export const setEmailConfig = ({name, host, port, address, password}) => {
    port = Number(port)
    return request.post('v1/admin/config/email/set', {name, host, port, address, password});
}

//配置管理员账号
export const setAdminConfig = ({email, password}) => {
    return request.post('v1/admin/config/admin/set', {email, password});
}