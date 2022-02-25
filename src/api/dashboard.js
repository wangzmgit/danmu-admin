import request from '@/utils/request';

//获取网站总体数据
export const getTotalData = () => {
    return request.get('v1/admin/data/total');
  }
  
  //获取网站近期数据
  export const getRecentData = () => {
    return request.get('v1/admin/data');
  }