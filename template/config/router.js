const Router = require('koa-router')
const { getDate } = require('../function/Date/getDate')
const { helloWorld } = require('../function/Greeting/helloWorld')
const router = new Router()

router.get('/greeting', helloWorld)
router.get('/date', getDate)

module.exports = router