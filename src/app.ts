import express, { Response, NextFunction } from "express";
import mongoose from "mongoose";
import usersRouter from "./routes/users";
import cardsRouter from "./routes/cards";
import { IRequestWhithUser } from "./utils/types";

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/mestodb");

app.use((req: IRequestWhithUser, res: Response, next: NextFunction) => {
  req.user = {
    _id: "63eb6a678890ff9caab7f7fa", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
