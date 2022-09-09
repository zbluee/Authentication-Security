import {} from 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import {User} from './db.js';
import {validationResult} from 'express-validator';
import {registrationSchema} from './schema/register-schema.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const exp = express();
const port = 3000;

exp.use(express.static(path.join(__dirname, 'public')));
exp.set('view engine', 'ejs');
exp.use(bodyParser.urlencoded({extended : true}));

exp.use(session({
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : false
}));

exp.use(passport.initialize());
exp.use(passport.session());

exp.get('/', (req, res)=>{
    res.render('home');
});

exp.get('/login', (req, res)=>{
    res.render('login');
});

exp.get('/register', (req, res)=>{
    res.render('register');
});

exp.get('/secrets', (req, res)=>{
    if(req.isAuthenticated()){
        res.render('secrets');
    }else{
        res.render('login', {alerts : [{msg : 'You must log in first'}]});
    }
});

exp.get('/logout', (req, res) => {
    req.logOut((err) => {
        if(!err){
            res.redirect('/');
        }else{
            console.log(err);
        }
    });
})
exp.post(
    '/register',
    registrationSchema,
    (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const alerts = errors.array();
        res.render('register', {alerts : alerts});
    }else{
        User.register({username : req.body.username}, req.body.password, (err, user)=>{
            if(err){
                console.log(err);
                res.render('register', {alerts : [{msg : 'user authentication failed', msg : err}]});
            }else{
                passport.authenticate('local')(req, res, ()=>{
                    res.redirect('/secrets');
                });
            }
        });                 
    }}
);

exp.post(
    '/login',
     (req, res)=>{   
    const user = new User({
        username : req.body.username,
        password : req.body.password
    });
    
    req.login(user, (err) => {
        if(err){
            res.render('login', {alerts : [{msg : 'user authentication failed'}]});
        }else{
            passport.authenticate('local' )  (req, res, ()=>{
                    res.redirect('/secrets');  
                });
        }
    });
   
});

exp.get('*', (req, res) => {
    res.sendStatus(404);
})
exp.listen(port, ()=> console.log(`Server started on port ${port}`));
