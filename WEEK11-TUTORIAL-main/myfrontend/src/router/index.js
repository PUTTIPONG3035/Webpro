import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue'), // set home as path '/'
  },
  {
    path: '/blog/create',
    name: 'Create new blog',
    component: () => import('../views/CreateBlog.vue')
  },
  {
    path: '/detail/:id',
    name: 'Blog Detail',
    component: () => import('../views/blogs/BlogDetail.vue')
  }
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router