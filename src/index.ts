import express from "express";
import eventsRouter from "./routes/events";
import cors from "cors";
const app = express();
const port = 5000;

app.use(cors());

app.get("/", (_, res) => {
  res.status(200).send();
});
app.use("/events", eventsRouter);
app.listen(port, () => console.log(`Running on port ${port}`));
