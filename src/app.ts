import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import cors from "cors";
import { UserRouter, AuthRouter, EventsRouter, SpacesRouter } from "./routes";
import session from "express-session";
import { v4 as uuidv4 } from "uuid";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

//TODO: ponder secure cookies use in production
app.use(cookieParser());
app.use(
  session({
    genid: function () {
      return uuidv4();
    },
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.use(express.json());

app.use("/events", EventsRouter);
app.use("/spaces", SpacesRouter);
app.use("/auth", AuthRouter);
app.use("/user", UserRouter);

app.use(ErrorMiddleware);

export default app;
