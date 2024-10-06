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
                        console.log('faculty Dashboard about to open')
                        res.redirect('/faculty_dashboard'); // Redirect to dashboard
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


    Display_Student(req, res) {
        if (req.session.user) { // Assuming `req.session.faculty` holds user data

            
            connect_obj.getConnection((err, myconnection) => {
                if (err) {
                    console.log('Database connection error:', err); // Log the error
                    res.send(err);
                    res.end();
                } else {
                    const q = `SELECT * FROM student WHERE approved = 1`;
                    myconnection.query(q, (err, results) => {
                        if (err) {
                            console.log('Query error:', err); // Log the query error
                            res.send(err);
                            res.end();
                        } else {
                            // Render the view with students data and user data
                            console.log('Rendering students:', results) // Log the results
                            res.render('student_display', { 
                                students: results});
                            res.end();
                        }
                    });
                }
            });
        } else {
            console.log('No session found, redirecting to login') // If session not found
            res.redirect('/login')     // Redirect to login if session is missing
        }
    }
    
    
    makeAnnouncement(req, res) {

        if (req.session.user) {

        const query = `INSERT INTO announcements (date, subject, announcement) VALUES ('${req.body.date}','${req.body.subject}','${req.body.announcement}')`;
        
        connect_obj.getConnection((err, myconnection) => {
            if (err) {
                console.log("Database connection error:", err);
                res.render('faculty_dashboard', { message: 'Database connection error', faculty: req.session.user });
                return;
            }

            myconnection.query(query, (err, results) => {
                if (err) {
                    console.log("Query error:", err);
                    res.render('faculty_announcement', { message: 'Error adding announcement', faculty: req.session.user });
                    return;
                }

               else{
                console.log("Announcement added successfully")  // Success: Redirect back to the faculty dashboard
                res.redirect('/announcement')
        }});
        });
    }
     else {
        console.log('No session found, redirecting to login') // If session not found
        res.redirect('/login')     // Redirect to login if session is missing
    }
}

}




const obj= new Faculty()
module.exports=obj