const connect_obj = require("../database/myConnector");

class Faculty
{
    Add_Faculty(req,res){
        if(req.method=='GET'){
            res.render('signup')
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
                    // const photoPath = req.file ? 'static/student_image/' + req.file.filename : '';

                    const q=`insert into faculty(name,email,password,gender,department,mobile,city)values('${req.body.name}','${req.body.email}','${req.body.password}','${req.body.gender}','${req.body.department}','${req.body.mobile}','${req.body.city}')`
                    myconnection.query(q,(err)=>{
                        if(err)
                        {
                            res.send(err)
                            res.end()
                        }
                        else{
                            res.render('signup',{message:req.body.name+' Record Saved Successfully, wait for approval to Login'})
                            res.end()
                        }
                        })
                    }
                    
                })
            }
        }


        Loginfac(req, res) {
            console.log("Login method triggered");  // To check if form is reaching here
            const { email, password } = req.body;
        
            if (!email || !password) {
                res.render('login', { message: 'Please fill in all fields' });
                return;
            }
        
            // Proceed with the rest of the logic below...
        
            const trimmedEmail = email.trim();
            const trimmedPassword = password.trim();
            const q = 'SELECT * FROM faculty WHERE email = ? AND password = ?';
            connect_obj.getConnection((err, myconnection) => {
                if (err) {
                    console.log("Database connection error:", err);
                    res.render('login', { message: 'Database connection error' });
                    return;
                }
            
                myconnection.query(q, [trimmedEmail, trimmedPassword], (err, results) => {
                    if (err) {
                        console.log("Query execution error:", err);
                        res.render('login', { message: 'Error querying the database' });
                        return;
                    }
            
                    console.log("Query results:", results);  // Log the results for debugging
            
                    if (results.length === 0) {
                        res.render('login', { message: 'Incorrect email or password' });
                        return;
                    }
            
                    const user = results[0];
            
                    if (user.approved === 1) {
                        console.log("User approved. Redirecting to dashboard...");
                        req.session.user = user; // Store user in session
                        res.redirect('/student_dashboard'); // Redirect to dashboard
                    } else {
                        console.log("User not approved.");
                        res.render('login', { message: 'Your account is not approved yet' });
                    }
                });
            });
        }    
        

    // Method for faculty dashboard
    Faculty_dashboard(req, res) {
    if (req.session.user && req.session.user.role === 'faculty') 
        {
        res.render('faculty_dashboard', { user: req.session.user });
        }   
        else 
        {
            res.redirect('/login');
        }
    }
}
const obj= new Faculty()
module.exports=obj