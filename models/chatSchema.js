import mongoose from "mongoose"
const Schema = mongoose.Schema;


const chat =  new Schema({
    message: String,
    name: String,
    timeStamp:  String,
    received: Boolean
})


export default mongoose.model("chat-content", chat)