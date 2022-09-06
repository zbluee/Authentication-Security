import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import {User} from './db.js';
import {validationResult} from 'express-validator';
import {registrationSchema} from './schema/register-schema.js';
import { loginSchema } from './schema/login-schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const exp = express();
const port = 3000;

exp.use(express.static(path.join(__dirname, 'public')));
exp.set('view engine', 'ejs');
exp.use(bodyParser.urlencoded({extended : true}));

exp.get('/', (req, res)=>{
    res.render('home');
});

exp.get('/login', (req, res)=>{
    res.render('login');
});

exp.get('/register', (req, res)=>{
    res.render('register');
});

exp.post(
    '/register',
    registrationSchema,
    (req, res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const alerts = errors.array();
        res.render('register', {alerts : alerts});
    }
    else{
        const newUser = new User({
            email : req.body.username,
            password : req.body.password
        });
        newUser.save((err)=>{
            return !err ? res.render('success') : console.log(err);
        });
    }
});

exp.post(
    '/login',
    loginSchema,
     (req, res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const alerts = errors.array();
            res.render('login', { alerts : alerts});
        }
        else{
            res.render('secrets');
        }
});

exp.listen(port, ()=> console.log(`Server started on port ${port}`));
