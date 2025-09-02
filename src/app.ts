import express from "express";
import connectDB from "./database";
import notFound from "./middlewares/NotFound";
import errorHandler from "./middlewares/ErrorHandler";
import morgan from "morgan";
import usersRouter from "./apis/users/users.routes";
import urlsRouter from "./apis/urls/urls.routes";
import dotenv from "dotenv";
import { env } from "./config/env";
const app = express();

app.use(express.json());
app.use(morgan("dev"));
dotenv.config();

const PORT = env.PORT || "5000";
const DB_URL = env.DB_URL;

if (!DB_URL) {
  throw new Error("DB_URL is not defined in environment variables");
}

app.use("/api/users", usersRouter);
app.use("/api/urls", urlsRouter);

app.use(notFound);
app.use(errorHandler);

connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
