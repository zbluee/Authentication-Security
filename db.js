import {} from 'dotenv/config';
import mongoose from 'mongoose';
import encrypt from 'mongoose-encryption';

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

const encKey = process.env.SOME_32BYTE_BASE64_STRING;
const sigKey = process.env.SOME_64BYTE_BASE64_STRING;
console.log(encKey);
userSchema.plugin(encrypt, {
    encryptionKey : encKey,
    signingKey : sigKey,
    encryptedFields : ['password']
});

export const User = mongoose.model('User', userSchema);
