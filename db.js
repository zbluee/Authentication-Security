import {} from 'dotenv/config';
import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import GoogleStrategy from 'passport-google-oauth20';
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
    password : String,
    googleId : String,
    name : String,
    secret : String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);
passport.use(User.createStrategy());
passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser((_id, done) => {
    User.findById(_id, (err, user) => {
        done(err, user);
    })
});


passport.use(new GoogleStrategy.Strategy({
    clientID : process.env.CLIENT_ID,
    clientSecret : process.env.CLIENT_SECRET,
    callbackURL : "http://localhost:3000/auth/google/secrets",
    userProfileURL : "https://www.googleapis.com/oauth2/v3/userinfo"
},(accessToken, refreshToken, profile, cb) => {
    console.log(profile);
    User.findOne({googleId : profile.id}, (err, user) => {
        if(err){
            return cb(err);
        }
        if(!user){
            const user = new User({
                googleId : profile.id,
                name : profile.displayName,
            });
            user.save((err)=>{
                if(err) console.log(err);
                return cb(err, user)
            });
        }else{

            return cb(err, user);
        }

    });
}
));

export {User as User};

