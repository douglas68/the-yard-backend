import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName:{
        type: String,
        required: true,
        trim: true,
        maxlength: 80,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    // picture: {


    // },
    chapterID:{
        type:Mongoose.Schema.type.objectId,
        ref: "Chapter",
        required: true,
    },
    role: {
        type: String,
        enum: ["member", "officer", "alumni", "admin"],
        default: "member"
    },

},
{timestamps: true}

);

export default mongoose.model("User", userSchema);