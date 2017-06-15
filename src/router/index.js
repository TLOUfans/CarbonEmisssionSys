'use strict';
import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import Home from '@/components/Home'
import Register from '@/components/Register'

import users from '@/components/users/users'
import matAndmach from '@/components/factorTable/matAndMach.vue'
import city from '@/components/city/editCity.vue'
import energy from '@/components/factorTable/energy'
import project from '@/components/project/project'
import projectHistory from '@/components/projectHistory/projectHistory.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: '',
      hidden: true,
      component: Login
    },
    {
      path: '/register',
      hidden: true,
      component: Register
    },
    {
      path: '/',
      component: Home,
      name: '用户管理',
      iconCls: 'fa fa-users',
      type: 'admin',
      leaf: true,
      children: [
        {path: '/users', component: users, name: '用户管理', hidden: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '因子表维护',
      type: 'admin',
      iconCls: 'fa fa-table',
      children: [
        {path: '/matAndMach', component: matAndmach, name: '材料、机械因子表'},
        {path: 'energy', component: energy, name: '能源因子表'},
        {path: 'city', component: city , name: '城市维护'}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '建筑物碳排放计算',
      iconCls: 'fa fa-building',
      leaf: true,
      children: [
        {path: '/project', component: project, name: '建筑物碳排放计算', hidden: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '建筑物碳排放计算',
      iconCls: 'fa fa-history',
      leaf: true,
      children: [
        {path: '/projectHistory', component: projectHistory, name: '项目历史信息', hidden: true}
      ]
    }
  ]
})
