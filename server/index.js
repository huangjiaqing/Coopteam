import R from 'ramda';
import Koa from 'koa';
import { resolve } from 'path';
import { connect, initSchemas } from './database/init';

const MIDDLEWARES = ['common', 'router'];

const useMiddleware = (app) => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        initWith => initWith(app)
      ),
      require,
      file => resolve(__dirname, `./middlewares/${file}`)
    )
  )(MIDDLEWARES);
};

(async () => {

  const app = new Koa();

  await connect();

  initSchemas();

  useMiddleware(app);

  if (R.equals(process.env.NODE_ENV, 'development')) {
    // 开发模式下启动前端dev
    require('../tools/dev');
  }

  app.listen(4455, () => {
    console.log('\n==> 🌎  Server listen on 4455 ..');
  });

})();
