import { User } from "../db.js";
import { check } from "express-validator";

const schema = check("username").custom(async (value, { req }) => {
  const user = await User.findOne({
    email: value,
  });
  if (!user) {
    return Promise.reject('Please provide a valid email address and password.');
  }
  return user.password === req.body.password? null: Promise.reject('Please provide a valid email address and password.');
});

export {schema as loginSchema};