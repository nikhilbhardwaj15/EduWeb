const connect_obj = require("../database/myConnector");

class AdminPanel {

    AdminLogin(req, res) {
        if (req.method === 'GET') {
            res.render('admin_login');
            res.end();
        } else {
            const { username, password } = req.body;
            const q = `SELECT * FROM admin WHERE username = '${username}' AND password = '${password}'`;

            connect_obj.getConnection((err, myconnection) => {
                if (err) {
                    res.send('Database connection error');
                    res.end();
                } else {
                    myconnection.query(q, (err, results) => {
                        if (err || results.length === 0) {  // this || is logical OR here
                            res.render('admin_login', { message: 'Invalid username or password' });
                            res.end();
                        } else {
                            req.session.admin = results[0]; // Set session for logged-in admin
                            res.redirect('admin_dashboard'); // Redirect to admin dashboard
                        }
                    });
                }
            });
        }
    }


    AdminLogout(req, res) {
        req.session.destroy(); // Destroy admin session
        res.redirect('login');
    }


    Dashboard(req, res) {
        if (req.session.admin) {
            res.render('admin_dashboard', { admin: req.session.admin });
        } else {
            res.redirect('admin_login'); // Redirect if not logged in
        }
    }


    View_Students(req, res) {
        connect_obj.getConnection((err, myconnection) => {
            if (err) {
                res.send(err);
                res.end();
            } else {
                const q = `SELECT * FROM student WHERE approved = 0`;
                myconnection.query(q, (err, results) => {
                    if (err) {
                        res.send(err);
                        res.end();
                    } else {
                        // Render the view with students data
                        res.render('admin_students', { students: results });
                        res.end();
                    }
                });
            }
        })
    }


    View_Faculty(req, res) {
        if (req.method === 'GET') {
            
            connect_obj.getConnection((err, myconnection) => {
                if (err) {
                    res.send(err);
                } else {
                    // Query for unapproved faculty
                    const q = `SELECT * FROM faculty WHERE approved = 0`;
                    myconnection.query(q, (err, results) => {
                        if (err) {
                            res.send(err);
                        } else {
                            // Pass the faculty data to the view
                            res.render('admin_faculty', { faculty: results });
                        }
                    });
                }
            });
        }
    }


    Approve_Student(req, res) {
        const studentId = req.params.id;
        const q = `UPDATE student SET approved = 1 WHERE id = ${studentId}`;  // Approving student
    
        connect_obj.getConnection((err, myconnection) => {
            if (!err) {
                myconnection.query(q, (err) => {
                    if (err) 
                        {
                        res.send(err);
                        res.end();
                        }
                        else 
                        {
                        res.redirect('/admin_approved_students');  // Absolute path
                        }
                });
            } else {
                res.send(err);
                res.end();
            }
        });
    }
    

    Approve_Faculty(req, res) {
        const facultyId = req.params.id;
        const q = `UPDATE faculty SET approved = 1 WHERE id = ${facultyId}`;  // Approving faculty

        connect_obj.getConnection((err, myconnection) => {
            if (!err) {
                myconnection.query(q, (err) => {
                    if (!err) {
                        res.redirect('admin_faculty');  // if approved, redirect
                    } else {
                        res.send(err);
                        res.end();
                    }
                });
            } else {
                res.send(err);
                res.end();
            }
        });
    }


    View_Approved_Students(req, res) {
        connect_obj.getConnection((err, myconnection) => {
            if (err) 
                {
                res.send(err);
                }
                else 
                {
                const q = `SELECT * FROM student WHERE approved = 1`; // Change to 1 for approved students
                myconnection.query(q, (err, results) => {
                    if (err) 
                        {
                        res.send(err);
                    } 
                    else 
                    {
                        res.render('admin_approved_students', { students: results });
                    }
                });
            }
        });
    }


    BlockStudent(req, res) {
        const studentId = req.params.id; // Get student ID from the request parameters
    
        connect_obj.getConnection((err, myconnection) => {
            if (err) {
                res.send(err);
            }
            else{
            const query = `UPDATE student SET approved = 0 WHERE id = ?`; // Update the approved status
            myconnection.query(query, [studentId], (err, results) => {
                if (err) {
                    res.send(err);
                }
                else
                {
                return res.redirect('/admin_approved_students')     // Redirect back to the approved students list
                }
            })}
        });
    }


    Delete_student(req, res) {
        const studentId = req.params.id; // Get student ID from the request parameters
    
        connect_obj.getConnection((err, myconnection) => {
            if (err) {
                // Handle error
                return res.redirect('/error_page'); // Redirect to an error page if needed
            }
    
            const query = `DELETE FROM student WHERE id = ?`; // Update the approved status
            myconnection.query(query, [studentId], (err, results) => {
                if (err) {
                    return res.redirect('/error_page'); // Redirect to an error page if needed
                }
                else{
    
                // Successfully deleted, now redirect back to the approved students page
                return res.redirect('/admin_approved_students');
                } // Redirect back to the approved students list
            });
        });
    }

}
const obj = new AdminPanel();
module.exports = obj;

// add more records to the student and faculty database.(done)
// make adminController in your method, tweak the logics. (done)
// seperate the general student and faculty functions of the project in the other controller. (done)
// either redirect or print a message after signing up , in faculty/student. (done)
// login issue , only this message block working: 'User does not exist or is not approved' even if correct.
// make the same logics, ejs and routes for faculty in admin 
// add note aside the sign up form: instructions
// make view approved faculty files