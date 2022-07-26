//Dependencies
const express = require('express')
const app = express()

const router = express.Router()



//imported routes
const projectRoutesController = require('../controllers/projects')
const issueRoutesController = require('../controllers/issues')
//TBD import User routes


router
 .get('/',  (req,res)=>{
        res.send('we are home')
        //res.redirect('/projects')
    })
  .use('/projects', projectRoutesController)
  .use('/issues', issueRoutesController)
  .use((req, res, next) => {
    const err = new Error('Not found')
    res.status(404)
    next(err)
  })
  //for when the request has its own error
  .use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
        err:{
          message: err.message
        }
    })
  })

module.exports = router
// module.exports = pRoutes
