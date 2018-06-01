const Koa = require('koa');
const router = require('koa-router')();
const path = require('path');
const proxy = require('http-proxy-middleware');
const static = require('koa-static');
const fs = require('fs');

const app = new Koa();

const apiUrl = 'http://120.27.21.73:8280';

app.use(async (ctx, next) => {
    if(ctx.url.startsWith('/api')) {    // 以api开头的异步请求接口都会被转发
        ctx.respond = false;
        return proxy({
            target: url, // 服务器地址
            changeOrigin: true,
            secure: false,
            // pathRewrite: {
            //     '^/api' : '/webapp/api'
            // }
            /* ^^^
            上面这个pathRewrite字段不是必须的，
            你的开发环境和生产环境接口路径不一致的话，才需要加这个。
            */
        })(ctx.req, ctx.res, next);
    }
    // ...这里省略N个接口
    return next();
});

// 指定静态资源文件夹
app.use(static(path.join(__dirname, './dist')));

// 指定首页
// app.use(async (ctx) => {
//     ctx.body = fs.createReadStream('./dist/index.html');
// });
router.get('/*', async (ctx, next) => {
    ctx.type = 'html';
    ctx.body = fs.createReadStream('./dist/index.html');
});

app.use(router.routes());

app.listen(8380, () => {
  console.log('server is running at http://localhost:8380');
})