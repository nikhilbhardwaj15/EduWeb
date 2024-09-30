const connect_obj = require("../database/myConnector");

class School
{
    Add_Student(req,res){
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

                    const q=`insert into student(name,email,password,gender,mobile,class,city)values('${req.body.name}','${req.body.email}','${req.body.password}','${req.body.gender}','${req.body.mobile}','${req.body.class}','${req.body.city}')`
                    myconnection.query(q,(err)=>{
                        if(err)
                        {
                            res.send(err)
                            res.end()
                        }
                        else{
                            res.render('signup',{message:req.body.name+' Record Saved Successfully, wait for Approval to login'})
                            res.end()
                        }
                        })
                    }
                    
                })
            }
        }
    




    // Method for student dashboard
    Student_dashboard(req, res) {
    if (req.session.user && req.session.user.role === 'student') 
        {
        res.render('student_dashboard', { user: req.session.user });
        } 
        else 
        {
        res.redirect('/login');
        }
    }

    
// Method for handling user login
Loginstu(req, res) {
    console.log("Login method triggered");  // To check if form is reaching here
    const { email, password } = req.body;

    if (!email || !password) {
        res.render('login', { message: 'Please fill in all fields' });
        return;
    }

    // Proceed with the rest of the logic below...

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const q = 'SELECT * FROM student WHERE email = ? AND password = ?';
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

}
const obj= new School()
module.exports=obj