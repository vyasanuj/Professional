import mongoose , {Schema} from "mongoose";
const Subscriptionschema = new Schema (
    {

    },{timestamps:true}
)

export const  subscription = mongoose.model("subscription",Subscriptionschema)