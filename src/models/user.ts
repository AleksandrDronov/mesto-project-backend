/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-useless-escape */
import mongoose, { model, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import AuthError from "../errors/auth-err";

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}
interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<mongoose.Document<unknown, any, IUser>>;
}

const userSchema = new Schema<IUser, UserModel>({
  name: {
    type: String,
    maxlength: 30,
    minlength: 2,
    default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    maxlength: 200,
    minlength: 2,
    default: "Исследователь",
  },
  avatar: {
    type: String,
    match: /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: "Неправильный формат почты",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.static("findUserByCredentials", function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError("Неправильные почта или пароль"));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthError("Неправильные почта или пароль"));
          }
          return user;
        });
    });
});

export default model<IUser, UserModel>("user", userSchema);
