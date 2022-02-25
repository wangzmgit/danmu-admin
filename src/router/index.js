import Vue from 'vue';
import VueRouter from 'vue-router';
import storage from "@/utils/stored-data.js";

Vue.use(VueRouter);

//解决重复点击报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import('../views/Login.vue'),
  },
  {
    path: '/import/:vid?',
    name: 'ImportVideo',
    meta: { admin: true },
    component: () =>
      import('../views/ImportVideo.vue'),
  },
  {
    path: '/',
    name: 'Home',
    meta: { admin: true },
    component: () =>
      import('../views/Home.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        meta: { admin: true },
        component: () =>
          import('../views/Dashboard.vue'),
      },
      {
        path: '/info',
        name: 'AdminInfo',
        component: () =>
          import('../views/AdminInfo.vue'),
      },
      {
        path: '/user',
        name: 'User',
        component: () =>
          import('../views/User.vue'),
      },
      {
        path: '/video',
        name: 'Video',
        component: () =>
          import('../views/Video.vue'),
      },
      {
        path: '/review',
        name: 'Review',
        component: () =>
          import('../views/Review.vue'),
      },
      {
        path: '/announce',
        name: 'Announce',
        component: () =>
          import('../views/Announce.vue'),
      },
      {
        path: '/carousel',
        name: 'Carousel',
        component: () =>
          import('../views/Carousel.vue'),
      },
      {
        path: '/partition',
        name: 'Partition',
        component: () =>
          import('../views/Partition.vue'),
      },
      {
        path: '/opinion',
        name: 'Opinion',
        component: () =>
          import('../views/Opinion.vue'),
      },
      {
        path: '/config',
        name: 'Config',
        component: () =>
          import('../views/Config.vue'),
      },
      {
        path: '/collection',
        name: 'Collection',
        component: () =>
          import('../views/Collection.vue'),
      },
    ]
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //是否需要登录
  if (to.meta.admin) {
    if (storage.get('admin')) {
      next();
    } else {
      router.push({ name: 'Login' });
    }
  } else {
    next();
  }
})

export default router
