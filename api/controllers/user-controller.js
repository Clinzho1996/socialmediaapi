import User from "../model/User";
import bcrypt from "bcrypt";

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
      return res.status(200).json({ message: "Login Successful" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
