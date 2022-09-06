import { User } from "../db.js";
import { check } from "express-validator";
import md5 from "md5";

const schema = check("username").custom(async (value, { req }) => {
  const user = await User.findOne({
    email: value,
  });
  if (!user) {
    return Promise.reject('Please provide a valid email address and password.');
  }
  return user.password === md5(req.body.password)? null: Promise.reject('Please provide a valid email address and password.');
});

export {schema as loginSchema};