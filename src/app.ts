/* eslint-disable no-useless-escape */
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { celebrate, Joi, errors } from "celebrate";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import usersRouter from "./routes/users";
import cardsRouter from "./routes/cards";
import { PORT, URL_BD } from "./config";
import { login, createUser } from "./controllers/users";
import auth from "./middlewares/auth";
import error from "./middlewares/errors";
import { requestLogger, errorLogger } from "./middlewares/logger";
import NotFoundError from "./errors/not-found-err";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.set("strictQuery", true);
mongoose.connect(URL_BD);

app.use(requestLogger);

app.post("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);

app.post("/signup", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(/^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), createUser);

app.use(auth);

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError("Не верный путь"));
});

app.use(errorLogger);

app.use(errors());

app.use(error);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
