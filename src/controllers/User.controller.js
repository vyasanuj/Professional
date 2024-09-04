import {asycnHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asycnHandler ( async (req , res) => {
    const {Username , email , fullname , avatar , password} = req.body
    console.log (" EMAIL :" , email )
    if (
        [Username , email , fullname , avatar , password].some((field)=>field?.trim() ==="")
    ){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser = User.findOne({
        $or : [{Username},{email}]
    })

    if (existedUser) {
        throw new ApiError(409 , "user with this username or email already exists")
    }
    const avatarLocalpath = req.files?.avatar[0]?.path 
    if (!avatarLocalpath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const Avatar = UploadOnCloudinary(avatarLocalpath)

    if (!Avatar){
        throw new ApiError(400, "Avatar file is required")
    }

    const CoverImageLocalpath = rep.files?.coverimg[0]?.path
    const CoverImage = await UploadOnCloudinary(CoverImageLocalpath)

    const User = await User.create({
        fullname ,
        Avatar : avatar.url ,
        // coverImage :
        email,
        password,
        Username : Username.toLowerCase()
    })

    const CreateUser = User.findById(User._id).select(
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