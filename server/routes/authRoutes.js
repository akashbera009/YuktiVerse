import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
// import User from "../models/User.js";
// import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getMe);


// router.post("/create-dummy", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check if user already exists
//     let existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ msg: "User already exists" });

//     const hashed = await bcrypt.hash(password, 10);

//     const user = new User({
//       name,
//       email,
//       password: hashed,
//     });

//     await user.save();

//     res.status(201).json({ msg: "Dummy user created", user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

export default router;
