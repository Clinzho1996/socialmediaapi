import User from "../model/User";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import os from "os";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { generateToken, verifyToken } from "../utils/jwUtils";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (error) {
    console.log(error);
  }
  if (!users) {
    return res.status(404).json({ message: "No users found" });
  } else {
    return res.status(200).json({ users });
  }
};

export const signup = async (req, res, next) => {
  const saltRounds = 10;

  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    console.log(error);
  }

  if (existingUser) {
    return res.status(400).json({ message: "User Already exist" });
  } else {
    const user = new User({
      name,
      email,
      password: hashedPassword,
      blogs: [],
    });

    try {
      await user.save();
      const token = generateToken({ userId: user._id });
      return res.status(201).json({ user, token });
    } catch (error) {
      console.log(error);
    }
    return res.status(400).json({ user });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "Couldn't find user by this email" });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect Password" });
    } else {
      const token = generateToken({ userId: existingUser._id });
      return res.status(200).json({ message: "Login Successful", token });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  const decodedToken = verifyToken(token);

  if (!decodedToken) {
    return res.sendStatus(403); // Forbidden
  }

  // Attach the decoded user data to the request object
  req.user = decodedToken;

  next();
};

export const getUserData = async (req, res, next) => {
  const userId = req.params.id;
  console.log("Fetching user with ID:", userId);

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Create an endpoint to update user's image/avatar
export const updateImage = async (req, res, next) => {
  const userId = req.params._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newImage = req.file;
    if (newImage) {
      // Generate a unique identifier for the filename
      const uniqueFilename = `${uuidv4()}.jpg`; // Use a suitable extension for your images

      // Create a temporary file
      const tempFilePath = path.join(os.tmpdir(), uniqueFilename);
      await fs.writeFile(tempFilePath, newImage.buffer);

      // Upload the image to Cloudinary with the generated filename
      const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
        public_id: `avatar/${uniqueFilename}`,
        upload_preset: "kmsx8mak",
        resource_type: "auto",
      });

      await fs.unlink(tempFilePath);

      user.image = uploadResult.secure_url; // Save the Cloudinary image URL to user's image property
      await user.save();
      return res.status(200).json({ message: "Image updated successfully" });
    } else {
      return res.status(400).json({ message: "No image provided" });
    }
  } catch (error) {
    console.error(error);
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};
