import { Router } from 'express';
import { LogoutUser, LoginUser ,  registerUser } from "../controllers/User.controller.js"
import { upload } from '../middlewares/Multer.middleware.js';
import {jwtverify} from '../middlewares/Auth.middleware.js'
const router = Router()

router.route("/register").post(
    upload.fields(
        [
            {
                name : "avatar",
                maxCount : 1 
            } 
        ]
    ) ,
    registerUser )

    router.route("/login").post(LoginUser)

    router.route("/logout").post( jwtverify , LogoutUser)

export default router 
