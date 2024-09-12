import { ApiError } from "../utils/ApiError.js"
import { asycnHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import { User } from "../models/User.model.js"


const jwtverify = asycnHandler (async (req , res , next) => {
try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("bearer " , "")
        if (!token) {
            throw new ApiError (401,"unauthorized request")
        }
    
        const decodedtoken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
    
        // const user = await User.findById(decodedtoken?._id).select("-password - refreshToken")
        const user = await User.findById(decodedtoken?._id).select("-password -refreshToken");

        if (!user){
            throw new ApiError (402 , "invalide Access Token")
        }
        
      
        req.user = user ;
        next()
    }

    catch (error) {
        throw new ApiError(401 , error?.message || "invalide Access Token")
    }
}
)

export {jwtverify}

