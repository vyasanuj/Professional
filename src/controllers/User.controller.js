import {asycnHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { UploadOnCloudinary } from "../utils/Cloudinary.js";
import {User} from "../models/User.model.js"

const registerUser = asycnHandler ( async (req , res) => {
    const {Username , email , fullname , avatar , password} = req.body
    console.log (" EMAIL :" , email )
    if (
        [Username , email , fullname , avatar , password].some((field)=>field?.trim() ==="")
    ){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser = await User.findOne({
        $or : [{Username},{email}]
    })

    if (existedUser) {
        throw new ApiError(409 , "user with this username or email already exists")
    }
    const avatarLocalpath = req.files?.avatar?.[0]?.path;
    console.log("Avatar local file path:", avatarLocalpath);

    if (!avatarLocalpath) {
        throw new ApiError(400, "Avatar file not found in the request");
    }

    const Avatar = await UploadOnCloudinary(avatarLocalpath);
    console.log("Cloudinary upload result:", Avatar);

    if (!Avatar) {
        throw new ApiError(500, "Error uploading avatar to Cloudinary");
    }

    const user = await User.create({
        fullname,
        avatar: Avatar.url,
        email,
        password,
        Username: Username.toLowerCase()
    });

    const CreateUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!CreateUser){
        throw new ApiError (500 , "Somthing went worng while registring the user")
    }
    return res.status(201).json(
        new ApiResponse(200, CreateUser, "User registered Successfully")
    )
})

export {registerUser}