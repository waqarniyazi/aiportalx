import express from "express";
import {
  loginUser,
  signupUser,
  googleAuth,
  githubAuth,
} from "../controllers/authController";

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.get("/google", googleAuth);
router.get("/github", githubAuth);

export default router;
