import router from './router/router';
import store from './store/store';
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css'; // Progress 进度条样式

const whiteList = ['Login', 'Register']; // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (!whiteList.some(item => item === to.name)) {
    store.dispatch('getUserInfo');
  }
  next();
});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
});
