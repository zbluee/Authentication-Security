import { User } from "../db.js";
import { check } from "express-validator";
import bcrypt from 'bcryptjs';

const schema = check("username").custom(async (value, { req }) => {
  const user = await User.findOne({
    email: value,
  });
  if (!user) {
    return Promise.reject('Please provide a valid email address and password.');
  }
  
  const isMatch = await bcrypt.compare(req.body.password, user.password);
  return isMatch ? null : Promise.reject('Please provide a valid email address and password.');

});

export {schema as loginSchema};