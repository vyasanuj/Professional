import mongoose , {Schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const Userschema = new Schema(
    {
        Username : {

            type : String ,
            required : true ,
            unique : true ,
            trim : true ,
            // lowercase : true ,
            index : true

        } , 
        email : {

            type : String ,
            required : true ,
            unique : true ,
            lowercase : true ,
            trim : true 

        },
        fullname : {
            type : String ,
            required : true ,
            trim : true ,
            index : true ,
            lowercase : true 
        },
        avatar : {
            type : String , // cloudnary url
            required : true 
        },
        coverimg :  {
            type : String ,
        },
        password : {
            type : String ,
            required : [true , "password is required"],
            unique : true ,
            // lowercase : true 
        },
        watchhistory : [{
            type : Schema.Types.ObjectId,
            ref : "Video"
        }],
        refreshToken : {
            type : String 
        }
    },
    {
        timestamps : true 
    }
)



Userschema.pre("save" , async function (next){
    if (!this.isModified("password")) return next();
    // console.log("original password :",this.password)
    this.password = await bcrypt.hash( this.password , 10 )
    // console.log("hashed password :",this.password)
    next() ;
})

Userschema.methods.isPasswordCorrect = async function (password) {
    console.log("password:",password,"this.password:",this.password)
    return await bcrypt.compare(password,this.password)
}

Userschema.methods.generateAccesstoken = function () {
    return jwt.sign (
        {
            _id : this._id ,
            Username : this.Username ,
            fullname : this.fullname ,
            email : this.email

        } , 
        process.env.ACCESS_TOKEN_SECRET ,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
    )
} 

Userschema.methods.generaterefereshtoken = function () {
    return jwt.sign (
        {
            _id : this._id    
        } ,
        process.env.REFRESH_TOKEN_SECRET ,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

export const User = mongoose.model("User",Userschema)