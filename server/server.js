import express from "express";
import cors from "cors";
import colors from "colors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import testRoute from "./routes/testRoute.js";

import Test from "./models/testmodel.js";
import Question from "./models/questionmodel.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: process.env.Client_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json());

const Endpoint = "/server/api";
app.use(`${Endpoint}/auth`, authRoute);
app.use(`${Endpoint}/test`, testRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`.bgGreen.white);
});
