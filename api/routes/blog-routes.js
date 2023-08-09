import express from "express";
import {
  addNewPosts,
  deleteById,
  getAllBlogs,
  getBlogByUserId,
  getById,
  updatePost,
} from "../controllers/blog-controller";

const blogRoutes = express.Router();

blogRoutes.get("/", getAllBlogs);
blogRoutes.post("/add", addNewPosts);
blogRoutes.put("/update/:id", updatePost);
blogRoutes.get("/:id", getById);
blogRoutes.delete("/:id", deleteById);
blogRoutes.get("/user/:id", getBlogByUserId);

export default blogRoutes;
