import express from "express";
import cors from "cors";
import app from "./app";
const port = 5000;

app.use(cors());

app.listen(port, () => console.log(`Running on port ${port}`));
