import axios from 'axios';
import store from '../store/store';
import { Message } from 'element-ui';
import Router from '@/router/router';

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'http://antisony.org:3001/'
    : 'http://localhost:3000/';
// const baseUrl = 'http://antisony.org:3001/'

// 创建axios实例
const service = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  // api的base_url
  timeout: 60000, // 请求超时时间
  // transformRequest: [function(data) {
  //   // Do whatever you want to transform the data
  //   let ret = '';
  //   for (const it in data) {
  //     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
  //   }
  //   return ret
  // }],
  headers: {
    // 'Content-Type': 'application/json;charset=utf-8'
  }
});

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      console.log(store.getters.token);

      // config.headers['Authorization'] = 'Bearer ' + store.getters.token // 让每个请求携带自定义token 请根据实际情况自行修改
      // config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
  },
  error => {
    // Do something with request error
    console.log(error);
    Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    console.log(error);
    console.log(error.message);
    console.log(error.response);
    const response = error.response;
    const status = response.status;
    if (status === 401) {
      Router.push({
        path: '/login'
      });
      Message({
        message: response.data,
        type: 'error',
        duration: 5 * 1000
      });
    }

    if (status === 500) {
      Message({
        message: response,
        type: 'error',
        duration: 5 * 1000
      });
    }

    return Promise.reject(response);
  }
);

export default service;
export { baseUrl };
