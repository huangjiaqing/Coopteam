import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';
import cors from 'koa2-cors';

export const addParser = (app) => {
  app.use(bodyparser());
};

export const addLogger = (app) => {
  app.use(logger());
};

export const addCors = (app) => {
  app.use(cors());
};
