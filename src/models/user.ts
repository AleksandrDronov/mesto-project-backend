/* eslint-disable no-useless-escape */
import { model, Schema } from "mongoose";

export interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    maxlength: 30,
    minlength: 2,
    required: true,
  },
  about: {
    type: String,
    required: true,
    maxlength: 200,
    minlength: 2,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v: string) {
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
      },
      message: "Введите url", // выводится в случае false
    },
  },
});

export default model<IUser>("user", userSchema);
