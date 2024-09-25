const connect_obj = require("../database/myConnector");

class Message
{
    Add_message(req,res)
    {

  if(req.method=='GET'){
    res.render('About')
    res.end()
}
else{
    connect_obj.getConnection((err,myconnection)=>
    {
        if(err){
            res.send(err)
            res.end()
        }
        else{
            const q=`insert into feedback(name,email,message)values('${req.body.name}','${req.body.email}','${req.body.message}')`
            myconnection.query(q,(err)=>{
                if(err)
                {
                    res.send(err)
                    res.end()
                }
                else{
                    res.render('About',{message:req.body.name+' Thanks for the Message!'})
                    res.end()
                }
                })
            }
            
        })
    }

    }


    Add_review(req,res)
    {

  if(req.method=='GET'){
    res.render('Contact')
    res.end()
}
else{
    connect_obj.getConnection((err,myconnection)=>
    {
        if(err){
            res.send(err)
            res.end()
        }
        else{
            const q=`insert into feedback(name,email,message)values('${req.body.name}','${req.body.email}','${req.body.message}')`
            myconnection.query(q,(err)=>{
                if(err)
                {
                    res.send(err)
                    res.end()
                }
                else{
                    res.render('Contact',{message:req.body.name+' Thanks for the Review !'})
                    res.end()
                }
                })
            }
            
        })
    }

    }
}

const obj=new Message()

module.exports=obj

