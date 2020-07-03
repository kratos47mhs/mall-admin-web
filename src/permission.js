import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress Bar
import 'nprogress/nprogress.css' // Progress Bar Style
import {Message} from 'element-ui'
import {getToken} from '@/utils/auth' // 验权

const whiteList = ['/login']; // Do not redirect whitelist
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (getToken()) {
    if (to.path === '/login') {
      next({path: '/'});
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { // Pull user information
          let menus = res.data.menus;
          let username = res.data.username;
          store.dispatch('GenerateRoutes', {menus, username}).then(() => { // Generate accessible routing table
            router.addRoutes(store.getters.addRouters); // Dynamically add accessible routing table
            next({...to, replace: true})
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again');
            next({path: '/'})
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login');
      NProgress.done()
    }
  }
});

router.afterEach(() => {
  NProgress.done() // End Progress
});
