import User from "../models/user.models";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";


const authmiddleware= async (req,res,next)=>{
     try {
        const token= req.cookies.token || req.header("Authorization")?.replace("Bearer ","");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
          }

          const decode= jwt.verify(token,process.env.JWT_SECRET);

          const user = await User.findById(decoded.userId).select("-password");
          if (!user) {
            throw new ApiError(401, "Invalid token");
          }
      
          req.user = user;
          next();
     } catch (error) {
        next(new ApiError(401, error.message || "Invalid token"));

        
     }
}

export default authMiddleware;
