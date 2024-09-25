const express = require('express')
const router= express.Router()
const stu_obj = require('./controller/schoolController')
const faculty_obj = require('./controller/facultyController')
const message_obj = require('./controller/usermsg')
const admin_obj = require('./controller/adminController');

//------these library are for file upload of any type -----//

const multer=require('multer')  //upload the destination location
const fs= require('fs')         //Handles the file type and Reads
const path= require('path')     //Finds where you want to store
const session = require('express-session')

//------end -----//

//Set up multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = './static/student_image';
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // unique file name (images or any kind of file)
    }
});  
const upload = multer({ storage: storage });



router.get('/',(req,res)=>
    {
    res.render('Home')
    res.end()
    })

router.get('/ram',(req,res)=>
    {
        res.render('About')
        res.end()
    })

router.get('/zirakpur',(req,res)=>
    {
        res.render('Contact')
        res.end()
    })

router.use('/signup',(req,res)=>
    {
        res.render('signup')
        res.end()
    })

router.post('/submit-feedback', (req, res) => 
    {
        message_obj.Add_message(req,res)
    })

router.post('/submit-feedback2', (req, res) => 
    {
        message_obj.Add_review(req,res)
    })

   
    router.get('/admin_login', (req, res) => {
        admin_obj.AdminLogin(req, res);
    });
    
    router.post('/admin_login', (req, res) => {
        admin_obj.AdminLogin(req, res);
    });
    
    // Admin dashboard (only accessible if logged in)
    router.get('/admin_dashboard', (req, res) => {
        admin_obj.Dashboard(req, res);
    });
    
    // Admin logout
    router.get('/admin_logout', (req, res) => {
        admin_obj.AdminLogout(req, res);
    });
    




router.post('/signup_student', (req, res) => 
    {
        // Logic for student sign-up
        stu_obj.Add_Student(req, res)
    })
        
router.post('/signup_faculty', (req, res) => 
    {
        // Logic for faculty sign-up
        faculty_obj.Add_Faculty(req, res)
    })
    
router.get('/admin_students',(req, res) => 
    {
        admin_obj.View_Students(req, res)
    })

router.get('/admin_faculty', (req, res) => 
    {
        admin_obj.View_Faculty(req, res)
    }) 

router.post('/admin_approve_student/:id',(req, res) => 
    { 
        admin_obj.Approve_Student(req, res)
    })
                       
router.post('/admin_approve_faculty/:id', (req, res) => 
    {  
        admin_obj.Approve_Faculty(req, res)
    })


router.get('/admin_approved_students',(req,res)=>
    {
        admin_obj.View_Approved_Students(req,res)
    });
    
router.post('/block_student/:id', (req, res) => {
    admin_obj.BlockStudent(req, res);
});

router.post('/admin_delete_student/:id', (req, res) => {
    admin_obj.Delete_student(req, res);
});


router.get('/login', (req, res) => {
    res.render('login'); // Render the login page
});


router.post('/login_student', (req, res) => {
    stu_obj.Loginstu(req, res);
})

router.post('/login_faculty', (req, res) => {
    faculty_obj.Loginfac(req, res);
})


// Student dashboard route
router.get('/student_dashboard', (req, res) => {
    if (req.session.user) {
        console.log("Redirecting to dashboard...");
        res.render('student_dashboard', { user: req.session.user }); // Render the dashboard with user data
        res.end()
    } else {
        res.redirect('/login'); // Redirect to login if user is not authenticated
        
    }
});


// Faculty dashboard route
router.get('/faculty_dashboard', (req, res) => {
    if (req.session.user) {
        stu_obj.Faculty_dashboard(req, res);
    } else {
        res.redirect('/login'); // Redirect to login if not authenticated
    }
});


module.exports=router