import express from "express";
import {
  addNewPosts,
  deleteById,
  getAllBlogs,
  getBlogByUserId,
  getById,
  updatePost,
} from "../controllers/blog-controller";
const blogRouter = express.Router();

blogRouter.get("/", getAllBlogs);
blogRouter.post("/add", addNewPosts);
blogRouter.put("/update/:id", updatePost);
blogRouter.get("/:id", getById);
blogRouter.delete("/:id", deleteById);
blogRouter.get("/user/:id", getBlogByUserId);

export default blogRouter;
