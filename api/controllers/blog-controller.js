import Blog from "../model/Blog";
import User from "../model/User";
import mongoose from "mongoose";

export const getAllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find();
  } catch (error) {
    console.log(error);
  }

  if (!blogs) {
    return res.status(404).json({ message: "No Blog Found" });
  }
  return res.status(200).json({ blogs });
};

export const addNewPosts = async (req, res, next) => {
  const { title, description, image, user } = req.body;

  let existingUser;

  try {
    existingUser = await User.findById(user);
  } catch (err) {
    console.log(err);
  }

  if (!existingUser) {
    return res.status(400).json({ message: "Unable to find this user" });
  }

  const newPost = new Blog({
    title,
    description,
    image,
    user,
  });

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await newPost.save({ session });
    existingUser.blogs.push(newPost);
    await existingUser.save({ session });
    await session.commitTransaction();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
  return res.status(200).json({ newPost });
};

export const updatePost = async (req, res, next) => {
  const { title, description } = req.body;
  const blogId = req.params.id;

  let blog;
  try {
    blog = await Blog.findByIdAndUpdate(blogId, {
      title,
      description,
    });
  } catch (error) {
    console.log(error);
  }

  if (!blog) {
    return res.status(500).json({ message: "Unable to update blog post" });
  }
  return res.status(200).json({ blog });
};

export const getById = async (req, res, next) => {
  const id = req.params.id;

  let blog;

  try {
    blog = await Blog.findById(id);
  } catch (error) {
    console.log(error);
  }

  if (!blog) {
    return res.status(400).json({ message: "Blog not found" });
  }
  return res.status(200).json({ blog });
};

export const deleteById = async (req, res, next) => {
  const id = req.params.id;

  let blog;
  try {
    blog = await Blog.findByIdAndDelete(id).populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
  } catch (error) {
    console.log(error);
  }

  if (!blog) {
    return res.status(500).json({ message: "unable to delete post" });
  }
  return res.status(200).json({ message: "Blog post deleted successfully" });
};

export const getBlogByUserId = async (req, res, next) => {
  const userId = req.params.id;
  let userBlogs;

  try {
    userBlogs = await User.findById(userId).populate("blogs");
  } catch (error) {
    console.log(error);
  }

  if (!userBlogs) {
    return res.status(404).json({ message: "No blog post found" });
  }
  return res.status(200).json({ blogs: userBlogs });
};
