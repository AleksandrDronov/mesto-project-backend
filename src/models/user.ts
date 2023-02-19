/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-useless-escape */
import { model, Schema } from "mongoose";
import validator from "validator";

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    maxlength: 30,
    minlength: 2,
  },
  about: {
    type: String,
    maxlength: 200,
    minlength: 2,
  },
  avatar: {
    type: String,
    match: /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v:string) => validator.isEmail(v),
      message: "Неправильный формат почты",
    },
  },
  password: {
    type: String,
    // required: true,
  },
});

export default model<IUser>("user", userSchema);
