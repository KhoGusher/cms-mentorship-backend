import express from "express";
import { signinPassword } from "../controllers/signin";
import { forgotPassword } from "../controllers/forgotPassword";
import { resetPassword } from "../controllers/resetPassword";
import { signout } from "../controllers/signout";
import { signUp } from "../controllers/signup";

const router = express.Router();

// sign with phone or email, both to use sms to sign in
router.post("/signin-password", signinPassword);

router.post("/signup", signUp);


// forgot and reset password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Signing user out
router.post("/logout", signout);

export { router as authRouter };
