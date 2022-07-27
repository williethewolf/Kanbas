//Dependencies
require('dotenv').config()
const express = require ('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

//Other dependecies
//Imported Routes
const routesRoute = require('./routes/routes')
//const projectRoutes = require('./controllers/projects')
//Logger
const morgan = require('morgan')

//Initalize variables
const app = express()
const {PORT, MONGO_URL} = process.env

//DB config
mongoose.connect(MONGO_URL)
mongoose.connection.on('error', err => { logError(err); })
mongoose.connection.on('connected',() =>{
    console.log('Connected to MongoDB')
})

//Middleware
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(morgan('dev'))

//Custom Middleware
//CORS error handlignimplementation
app.use((req,res,next) =>{
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        "Origin, X-Requested-with, Content-Type, Accept, Authorization"
        )
    if (req.method  === 'OPTIONS'){
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET')
            return res.status(200).json({})
    }
    next()
})
//Reads all the routes in routes.js
app.use('/',routesRoute)


//Listener
app.listen(PORT, ()=> console.log(`express connected on port: ${PORT}`))