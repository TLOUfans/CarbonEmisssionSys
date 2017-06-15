'use strict';

const Koa = require('koa');
const koaRouter = require('koa-router')();
const json = require('koa-json');
const logger = require('koa-logger');
const jwt = require('koa-jwt');
const path = require('path');
const serve = require('koa-static');
const historyApiFallback = require('koa2-history-api-fallback');
const session = require('koa-session2');

const user = require('./server/routes/user');
const matAndMach = require('./server/routes/matAndMach');
const building = require('./server/routes/building');
const city = require('./server/routes/city');

const app = new Koa();

app.use(require('koa-bodyparser')())
app.use(json());
app.use(logger());
app.use(serve(path.join(__dirname,'/public')));

app.use(session({
  key:'sessionId',
  maxAge: 50000000
}));

app.use(async function (ctx, next) {
  let start = new Date();
  if(!ctx.session.user && (!['/user/user','/user/register'].filter(v => v== ctx.url).join('')) ){
    ctx.body = {
      success: false,
      info: 'session losed'
    }
    return;
  }
  await next();
  let ms = new Date - start;
  console.log('%s %s - %s', ctx.method, ctx.url, ms);
});

app.use(async function (ctx, next) {
  await next().catch(function (err) {
    if(err.status == 401){
      ctx.status = 401;
      ctx.body = {
        success: false,
        token: null,
        info: 'protected resource,user authorization header to get access'
      };
    }else{
      throw err;
    }
  });
});

app.on('error',function (err, ctx) {
  console.log('server error',err);
});

//routes
koaRouter.use('/user',user.routes());
koaRouter.use('/factor',matAndMach.routes());
koaRouter.use('/build',building.routes());
koaRouter.use('/city',city.routes());

app.use(koaRouter.routes());
app.use(historyApiFallback());
app.use(serve(path.resolve('dist')));


app.listen(9999,() => {
  console.log('app start at port 9999');
});

module.exports = app;
