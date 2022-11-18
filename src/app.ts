import express from "express";
import eventsRouter from "./routes/events";
const app = express();

app.get("/", (_, res) => {
  res.status(200).send();
});

app.use("/events", eventsRouter);

export default app;
