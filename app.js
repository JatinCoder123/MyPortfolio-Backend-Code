import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dbConnection from "./database/dbConnection.js";
import connectCloudinary from './config/cloudinary.js';
import { errorMiddleware } from "./middlewares/error.js";
import messageRouter from "./routes/message.js";
import userRouter from "./routes/user.js";
import timelineRouter from "./routes/timeline.js";
import softwareApplicationRouter from "./routes/softwareApplication.js";
import skillRouter from "./routes/skill.js";
import projectRouter from "./routes/project.js";
import certificateRouter from "./routes/certificate.js";

const app = express();
dbConnection();
connectCloudinary();

app.use(
  cors({
    origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp/",
  })
);

app.use('/api/v1/message',messageRouter);
app.use('/api/v1/user',userRouter);
app.use('/api/v1/timeline',timelineRouter);
app.use('/api/v1/softwareApplication',softwareApplicationRouter);
app.use('/api/v1/skill',skillRouter);
app.use('/api/v1/project',projectRouter);
app.use('/api/v1/certificate',certificateRouter);
app.use(errorMiddleware);


export default app;
