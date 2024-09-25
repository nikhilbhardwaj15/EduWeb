const express = require('express')
const app = express()
const port=1994
const myrouter=require('./route')
const path=require('path')

const bodyparser = require('body-parser')       // for collecting form data

const session=require('express-session')    //session is a way to store and manage user data temporarily while they interact with a website or application

app.use(bodyparser.urlencoded({extended:false}))    //Express To set the Body-parser

app.use('/static',express.static(__dirname+'/static')) // to allow external css
app.use('/css',express.static(path.join(__dirname,'node_modules/bootstrap/dist/css')))
app.use('/js',express.static(path.join(__dirname,'node_modules/bootstrap/dist/js')))
app.set('view engine','ejs')

app.use(session(
    {
        secret:'myemailid',
        resave:false,
        saveUninitialized:true,
        cookie:{secure:false}
    }
))

app.use("/",myrouter)

app.listen(port,()=>{
    console.log(`click here http://localhost:${port}`)
})