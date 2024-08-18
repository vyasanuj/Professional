import express, { json, urlencoded } from "express" 
import cors from "cors"
import cookieparser from "cookie-parser"

const app = express() 

app.use(cors({
    origin:process.env.CORS_ORIGIN ,
    Credential : true
}))
app.use(json({
    limit : "16kb"
}))
app.use(express.json({
    limit : "16kb"
}))
app.use(express.urlencoded({
    limit : "16kb"
}))
app.use(express.static("public"))
app.use(cookieparser())
export default app