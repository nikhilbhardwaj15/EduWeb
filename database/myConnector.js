const mysql=require('mysql')

const connection = mysql.createPool({
    host:'localhost',
    database:'school',
    user:'root',
    password:'',
    multipleStatements:true

})

module.exports=connection