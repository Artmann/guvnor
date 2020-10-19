import Koa from 'koa';
import koaLogger from 'koa-logger';
import Router from 'koa-router';

import { measurementsRoute } from './measurements';

const api = new Koa();
const router = new Router();

router.get('/apis/:id/measurements', measurementsRoute);

api
  .use(router.routes())
  .use(router.allowedMethods())
  .use(koaLogger());

export default api;
