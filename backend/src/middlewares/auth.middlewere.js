import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new ApiError(401, "Authorization token missing"));
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // IMPORTANT: use decoded.id (not userId)
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return next(new ApiError(401, "Invalid token"));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, "Token verification failed"));
  }
};

export default authMiddleware;
