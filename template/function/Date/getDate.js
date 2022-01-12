exports.getDate = (ctx) => {
  ctx.body = new Date().toString()
}