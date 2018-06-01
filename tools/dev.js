import Koa from 'koa';
import webpack from 'webpack';
import stream from 'stream';
import dev from 'webpack-dev-middleware';
import hot from 'webpack-hot-middleware';
import config from './webpack/webpack.config.js';
import fallback from './fallback';

const app = new Koa();
const compiler = webpack(config);

const devMiddleware = (compiler, opts) => {
  const middleware = dev(compiler, opts);
  return async (ctx, next) => {
    await middleware(ctx.req, {
      end: (content) => {
        ctx.body = content;
      },
      setHeader: (name, value) => {
        ctx.set(name, value);
      }
    }, next);
  };
};

const hotMiddleware = (compiler, opts) => {
  const middleware = hot(compiler, opts);
  return async (ctx, next) => {
    let pt = new stream.PassThrough();
    ctx.body = pt;
    await middleware(ctx.req, {
      write: pt.write.bind(pt),
      writeHead: (status, headers) => {
        ctx.status = status;
        ctx.set(headers);
      }
    }, next);
  };
};

app.use(fallback());

app.use(devMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

app.use(hotMiddleware(compiler));

app.listen(3000, () => {
  console.log('\n 🌍 => Coopteam Front-end listen on 3000');
});
