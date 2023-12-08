import path from "path";
import express from "express";
var cors = require("cors");
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import { AppError } from "./src/utils/appError";

import { authRouter } from "./src/routes/auth";

const globalErrorHandler = require("./src/controllers/errorCtrl");
const app = express();

app.enable("trust proxy");

const corsOptions = {
  origin: ["http://localhost:80", "http://localhost:3000"],
  credentials: true,
};

app.use(cors(corsOptions));

// Serving static files
app.use(express.static(path.join(__dirname, "public")));
// Set security HTTP headers
app.use(helmet());

// Limit number of requests coming from the same API
const limiter = rateLimit({
  max: 250,
  windowMs: 60 * 60 * 1000,
  message:
    "Received too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

app.use("/api/v1", authRouter);

app.all(
  "*",
  (req: { originalUrl: any }, res: any, next: (arg0: any) => void) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  }
);

app.set("view engine", "ejs");

app.use(globalErrorHandler);

export { app };
