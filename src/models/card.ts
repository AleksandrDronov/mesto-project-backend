import { model, Schema } from "mongoose";

export interface ICard {
  name: string;
  link: string;
  likes: Schema.Types.ObjectId[];
  createdAt: Date;
  owner: Schema.Types.ObjectId;
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    maxlength: 30,
    minlength: 2,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  likes: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    default: [],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<ICard>("card", cardSchema);
