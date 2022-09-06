import { User } from '../db.js';
import {check} from 'express-validator';


const schema = [
    check('username')
        .exists().isEmail().withMessage("Invalid Email")
        .custom(async value =>{
            const user = await User.findOne({
                email : value
            });
            if(user){
                return Promise.reject('Sorry. A user with that email address already exists');
            }

        }),
    check('password')
        .exists()
        .isLength({
            min : 8,
            minUppercase : 1,
            minLowercase : 1,
            minNumbers : 1

        }).withMessage('Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number')
        // .isIn(['123456789','Password', 'Iloveyou']).withMessage('Do not use a common word as the password')
        .custom((value, {req})=>{
            if(value !== req.body.passwordConfirmation){
                return Promise.reject('Password confirmation is incorrect');
            }
            return true;

        } )
    ]

export {schema as registrationSchema};