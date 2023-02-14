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
  },
});

export default model<IUser>("user", userSchema);
