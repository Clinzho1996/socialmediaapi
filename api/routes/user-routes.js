import express from "express";
import {
  authenticateToken,
  getAllUsers,
  getUserData,
  login,
  signup,
  updateImage,
} from "../controllers/user-controller";
import multer from "multer";

const storage = new multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/", getAllUsers);
router.post("/register", signup);
router.get("/account/:id", authenticateToken, getUserData);
router.post("/login", login);
router.patch("/register/:_id/upload", upload.single("image"), updateImage);

export default router;
