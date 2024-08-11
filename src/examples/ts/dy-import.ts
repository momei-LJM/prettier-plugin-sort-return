import { RouteRecordRaw } from 'vue-router'

export const exampleRoute = [
  {
    path: '/iconTest',
    name: 'IconTest',
    component: () => import('@/example/icon/index.vue')
  },
  {
    path: '/imgDown',
    name: 'ImgDown',
    component: () => import('@/views/imgDown/index.vue')
  },
  {
    path: '/animateList',
    name: 'AnimateList',
    component: () => import('@/views/example/AnimateList/index.vue')
  }
]

export const formatterRoute = (routes: RouteRecordRaw[]) => {
  return routes.map(item => {
    return { ...item, path: '/:menuId' + item.path }
  })
}
