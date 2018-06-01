import Router from 'koa-router';
// import _ from 'lodash';
import R from 'ramda';
import glob from 'glob';
import { resolve } from 'path';

const symbolPrefix = Symbol('prefix');
const routerMap = new Map();

// const isArray = c => _.isArray(c) ? c : [c];
const isArray = c => R.is(Array, c) ? c : [c];

export class Route {
  constructor (app, apiPath) {
    this.app = app
    this.apiPath = apiPath
    this.router = new Router({
      // prefix: '/api'
    })
  }

  init () {
    // 将路由文件都require进来 => require('routes/**.js')
    glob.sync(resolve(this.apiPath, './**/*.js')).forEach(require);

    for (let [conf, controller] of routerMap) {
      const controllers = isArray(controller);
      let prefixPath = conf.target[symbolPrefix];
      if (prefixPath) prefixPath = normalizePath(prefixPath);
      const routerPath = prefixPath + conf.path;
      this.router[conf.method](routerPath, ...controllers);
    }

    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }
}

const normalizePath = path => path.startsWith('/') ? path : `/${path}`;

/**
 * router修饰器
 * @param {*object} conf method, path 
 */
const router = conf => (target, key, descriptor) => {
  conf.path = normalizePath(conf.path);
  routerMap.set({
    target,
    ...conf
  }, target[key]);
};

/**
 * 控制器修饰器
 * @param {*string} path 控制器所在的路径
 */
export const controller = path => target => (target.prototype[symbolPrefix] = path);

export const get = path => router({
  method: 'get',
  path
});

export const post = path => router({
  method: 'post',
  path
});

export const put = path => router({
  method: 'put',
  path
});

export const del = path => router({
  method: 'delete',
  path
});

export const use = path => router({
  method: 'use',
  path
});

export const all = path => router({
  method: 'all',
  path
});

const decorate = (args, middleware) => {
  let [ target, key, descriptor ] = args;

  target[key] = isArray(target[key]);
  target[key].unshift(middleware);

  return descriptor;
};

const convert = middleware => (...args) => decorate(args, middleware);

export const auth = convert(async (ctx, next) => {
  console.log(`ctx.session.user: ${ctx.session.user}`);

  if (!ctx.session.user) {
    return (
      ctx.body = {
        success: false,
        code: 401,
        err: '登录信息失效，重新登录'
      }
    )
  }

  await next();
})

export const admin = roleExpected => convert(async (ctx, next) => {
  const { role } = ctx.session.user;

  console.log(`admin session: ${ctx.session.user}`);

  if (!role || role !== roleExpected) {
    return (
      ctx.body = {
        success: false,
        code: 403,
        err: '该用户没有权限'
      }
    );
  }

  await next();
})

export const required = rules => convert(async (ctx, next) => {
  let errors = [];

  const checkRules = R.forEachObjIndexed(
    (value, key) => {
      errors = R.filter(i => !R.has(i, ctx, ctx.request[key]))(value)
    }
  );

  checkRules(rules);

  if (errors.length) {
    ctx.body = {
      success: false,
      code: 412,
      err: `${errors.join(',')} is required`
    };
  }

  await next();
})
