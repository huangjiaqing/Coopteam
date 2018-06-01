import React from 'react';
import Loadable from './utils/loadable';
import PageLoading from './components/pageLoading/';

export default [
  {
    name: '首页',
    path: '/',
    exact: true,
    component: Loadable(() => import('./pages/org'), <PageLoading />)
  },
  {
    name: '组织',
    path: '/org',
    exact: true,
    component: Loadable(() => import('./pages/org'), <PageLoading />)
  },
  {
    name: '登录',
    path: '/login',
    exact: true,
    component: Loadable(() => import('./pages/login'), <PageLoading />)
  },
  {
    name: '项目',
    path: '/project/:_projectId',
    exact: true,
    component: Loadable(() => import('./pages/project'), <PageLoading />)
  },
];
