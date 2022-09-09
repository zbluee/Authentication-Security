import {} from 'dotenv/config';
import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import passport from 'passport';

const password = encodeURIComponent(process.env.DB_PASSWORD);
const url = `mongodb+srv://admin-blue:${password}@cluster0.il2bjzs.mongodb.net/userDB?retryWrites=true&w=majority`;
try{
    mongoose.connect(
        url,
        { useNewUrlParser: true, useUnifiedTopology: true},
        ()=>console.log('Successfully Connected'));
}catch(e){
    console.log('Failed');
}


const userSchema = new mongoose.Schema({
    email : String,
    password : String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


export {User as User};

