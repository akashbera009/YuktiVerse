// middlewares/auth.js
// export const protect = (req, res, next) => {
//   // For now, mock an authenticated user
//   req.user = { _id: '64b7e223ff3d2a13c8549d99' }; // Replace with a valid ObjectId from your DB
//   next();
// };

import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
// console.log(req.user);

  const token = req.header("Authorization")?.split(" ")[1];
  // console.log("this is token ", token);
  console.log(token);
  
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    
    req.user = decoded; // { id: userId }
    // console.log("req.user " , req.user);
    
    next();
    // console.log("passde");
    
  } catch (err) {
    console.log(err);
    
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default authMiddleware;

// 64b7e223ff3d2a13c8549d99
// 6897315dae335bd110fe4618
// const authMiddleware = (req, res, next) => {
//   // Mock authenticated user
//   req.user = { _id: '689738740562829489a60a41', name: 'Akash', email: 'ab@gmail.com' };
//   next();
// };

// export default authMiddleware;
