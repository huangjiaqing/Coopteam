import fly from 'flyio';

fly.config = {
  ...fly.conifg,
  baseURL: 'http://localhost:4455',
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
  parseJson:true,
};

/**
 * 发起请求
 * @param {string} url
 * @param {string} method
 * @param {object} opt
 *
 * @eg
 * data = body | queryString
 *
 * opt = {
 *  method: 'get',
 *  timeout: 3000,
 *  headers: {},
 *  ..
 * }
 *
 * fly 官网： https://wendux.github.io/dist/#/doc/flyio/readme
 */
export default fly;
