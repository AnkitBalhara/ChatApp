import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { app, server } from "./lib/socket.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const __dirname = path.resolve();
app.use(cookieParser());

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import { connectDB } from "./DataBase/db.js";

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")))


  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(process.env.PORT, () => {
  console.log(`Server is started at Port : ${process.env.PORT}`);
  connectDB();
});
