import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import blogRoutes from "./routes/blog-routes";
import router from "./routes/user-routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/user", router);
app.use("/api/blog", blogRoutes);

const mongoUri = process.env.MONGODB_API;

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("App is running on http://localhost:3000");
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
