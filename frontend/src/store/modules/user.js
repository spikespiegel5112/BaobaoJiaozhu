import { login, logout, getInfo } from '@/api/login';
import { Message } from 'element-ui';
import service, { baseUrl } from '@/utils/request';

const user = {
  state: {
    token: '',
    login_id: '',
    nick_name: '',
    image: '',
    avatar: '',
    roles: [],
    userInfo: {}
  },

  mutations: {
    serUserInfo(state, payload) {
      state.userInfo = payload;
    }
  },

  actions: {
    // 登录

    // 获取用户信息
    getUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        const logoutRequest = baseUrl + 'user/logout';

        service
          .get('user/getUserInfo')
          .then(response => {
            const userInfo = response.data;
            commit('serUserInfo', userInfo);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        const logoutRequest = baseUrl + 'user/logout';

        service
          .post(logoutRequest, {
            token: state.token
          })
          .then(response => {
            commit('SET_TOKEN', '');
            // commit('SET_ROLES', [])
            resolve();
          })
          .catch(error => {
            reject(error);
          });
        // logout(state.token).then(() => {
        //   commit('SET_TOKEN', '');
        //   // commit('SET_ROLES', [])
        //   removeToken();
        //   removeLoginId();
        //   resolve();
        // }).catch(error => {
        //   reject(error);
        // });
      });
    },

    // 前端 登出
    FedLogout({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        resolve();
      });
    }
  }
};

export default user;
