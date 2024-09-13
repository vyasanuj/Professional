import {asycnHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { UploadOnCloudinary } from "../utils/Cloudinary.js";
import {User} from "../models/User.model.js"
import jwt from "jsonwebtoken"

const generateAccessandRefereshTokens = async(UserID) => {
    try {

        const user = await User.findById(UserID)
        const accessToken = user.generateAccesstoken()
        const RefereshToken = user.generaterefereshtoken()

        user.refreshToken = RefereshToken
        user.save({validateBeforeSave:false})
        // console.log("Access Token:", accessToken);
        // console.log("Refresh Token:", RefereshToken);


        return {accessToken,RefereshToken}
        

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating referesh and access token")
    }
}

const registerUser = asycnHandler ( async (req , res) => {
    const {Username , email , fullname , avatar , password} = req.body
    // console.log (" EMAIL :" , email )
    console.log("request.body content :",req.body)
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

    const avatarLocalpath =  req.files?.avatar?.[0]?.path;
    console.log("avatar local file path :" , avatarLocalpath)
    console.log("flies informations :" , req.files)

    if (!avatarLocalpath) {
        throw new ApiError(400, "Avatar file not found in the request");
    }

    const Avatar = await UploadOnCloudinary(avatarLocalpath);
    console.log("Cloudinary upload result:", Avatar);

    if (!Avatar) {
        throw new ApiError(500, "Error uploading avatar to Cloudinary");
    }

    const user = await User.create({
        fullname ,
        avatar : Avatar.url ,
        // coverImage :
        email,
        password,
        Username
        // Username: Username.toLowerCase()
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

// logining User
// get the data from req.body 
// username || email
// check Password 
// access and refresh token 
// send cookies 

const LoginUser = asycnHandler (async (req,res) => {

    const { email , Username , password } = req.body
    // console.log ("data coming or not",fullname) ;

    // if you want only one field 
    // if (!(username || email))
    if (!Username && !email) {
        throw new ApiError(400 , "Username and email are required")
    }

    const user = await User.findOne({
        $or : [{Username} , {email}]
    })

    if (!user) {
        throw new ApiError(400 , "you are not registred")
    }
    
    const isPasswordValid = await user.isPasswordCorrect(password) 
    console.log("correct password is:" , password)
    if (!isPasswordValid){
        throw new ApiError(400 , "password is not valid") 
    }

    const { accessToken , RefereshToken } = 
    await generateAccessandRefereshTokens(user._id)

    const loggedinuser = await User.findById(user._id).select("-password -refreshToken")
    const options = {
        httpOnly : true ,
        secure : true 
    }
    return res
    .status(200)
    .cookie("accessToken" , accessToken , options)
    .cookie("RefereshToken" , RefereshToken , options)
    .json(
        new ApiResponse(
            200,
            {
                user : loggedinuser , accessToken  ,  RefereshToken
            } ,
            "User logged In successfully"
        )
    )
})

const LogoutUser = asycnHandler(async (req,res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : undefined
            } 
        } ,
        {
            new : true 
        }
        
    )
    const options = {
        httpOnly : true ,
        secure : true 
    }

    return res
    .status(200)
    .clearCookie("accessToken" , options)
    .clearCookie("RefereshToken" , options )
    .json(new ApiResponse(200 , {} , "User logged Out"))
})

const refreshAccessToken = asycnHandler (async(req,res) => {

    const incomingrefreshTOken = req.cookie.RefereshToken||req.body.RefereshToken
    
    if (!incomingrefreshTOken) {
        throw new ApiError (401 , "invalid refreshToken")
    }

    try {
        const DecodedToken = jwt.verify(incomingrefreshTOken , process.env.REFRESH_TOKEN_SECRET)
    
        console.log("the value of decoded Token :",DecodedToken)
    
        const user = await User.findById(DecodedToken?._id)
    
        if (!user) {
            throw  new ApiError (401 , "invalid refreshToken")
        }
    
        if (incomingrefreshTOken !== user?.refreshToken) {
            throw new ApiError (401 , "expired refresh token")
        }
    
        const {accessToken , RefereshToken}=await generateAccessandRefereshTokens(user._id)
    
        const options = {
            httpOnly : true ,
            secure : true 
        }
    
        res.status(200)
        .cookie("accesstoken" , accessToken , options)
        .cookie("refreshtoken" , RefereshToken , options)
        .json(
            new ApiResponse(
                200 , 
                {
                    accessToken , newrefreshToken : RefereshToken
                } ,
                "access Token refreshed successfullly"
            )
        )
    } catch (error) {
        throw new ApiError (401 , error.message || "invalid refresh token")
    }

    
})

export {
    registerUser , 
    LoginUser,
    LogoutUser,
    refreshAccessToken 
}