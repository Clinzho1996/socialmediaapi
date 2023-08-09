import express from "express";
import mongoose from "mongoose";
import router from "./routes/user-routes";
import blogRouter from "./routes/blog-routes";
import { config } from "dotenv";

config();

const app = express();
app.use(express.json());
app.use("/api/user", router);
app.use("/api/blog", blogRouter);

const mongoUri = process.env.MONGODB_API;

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log("App is running on http://localhost:3000");
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
