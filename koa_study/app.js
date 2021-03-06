// 1.创建koa对象
const Koa = require('koa')
const app = new Koa()
// 2.编写相应函数（中间件）
// ctx:上下文，web容器，ctx.request ctx.response
// next: 下一个中间件，下一层中间件是否能够执行，取决与next这个函数有没有被调用
app.use((ctx, next) => {
  console.log('第1层中间件')
  ctx.response.body = 'hello world'
  next()
  console.log('第1层中间件.......回来了')

})
app.use(async(ctx, next) => {
  console.log('第2层中间件')
  const res = await next()
  console.log(res)
  console.log('第2层中间件......回来了')

})
app.use((ctx, next) => {
  console.log('第3层中间件')
  return 'i love you'
})
// 3.绑定端口号3000
app.listen(3000)