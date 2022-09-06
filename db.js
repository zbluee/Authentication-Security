import mongoose from 'mongoose';

try{
    mongoose.connect('mongodb://localhost:27017/userDB');
    console.log('Successfully Connected');
}catch(e){
    console.log('Failed');
}

const userSchema = {
    email : String,
    password : String
};

export const User = mongoose.model('User', userSchema);
