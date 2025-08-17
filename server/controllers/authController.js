import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET );
};

// @desc Register new user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    // console.log(user);
    
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
// console.log(salt , hashed);

    user = new User({ name, email, password: hashed });
    await user.save();
    // console.log(user);
    

    res.status(201).json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// @desc Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
console.log(email);

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });
// console.log(user);

    const isMatch = await bcrypt.compare(password, user.password);
    // console.log(isMatch);
    
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    res.json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const googleLogin= async(req,res) => {
    try {
    const { tokenId } = req.body;

    // Verify Google token
    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${tokenId}`);
    const googleData = await googleRes.json();

    if (googleData.error_description) {
      return res.status(401).json({ error: "Invalid Google token" });
    }

    let user = await User.findOne({ email: googleData.email });
    if (!user) {
      user = await User.create({
        name: googleData.name,
        email: googleData.email,
        pic: googleData.picture, // Store Google profile pic
        googleId: googleData.sub
      });
    } else if (!user.pic && googleData.picture) {
      // Update profile pic if missing
      user.pic = googleData.picture;
      await user.save();
    }

    const jwtToken = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token: jwtToken, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
} 

export const updateUser =async (req, res )=>{
    try {
    const { name, email, pic } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, pic },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc Get current user (protected)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
