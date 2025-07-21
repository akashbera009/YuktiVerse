// middlewares/auth.js
export const protect = (req, res, next) => {
  // For now, mock an authenticated user
  req.user = { _id: '64b7e223ff3d2a13c8549d99' }; // Replace with a valid ObjectId from your DB
  next();
};
