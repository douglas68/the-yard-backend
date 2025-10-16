import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
    {
        name: { 
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        letters:{ // greek letter
            type: String,
            trim: true,
            maxlength: 10,
        },
        organization: {
            type: String,
            required: true,
            trim: true,
        },
        crestUrl: {
            type: String,
            trim: true,
        },
        about: {
            type: String,
            trim: true,
            maxlength: 2000,
        },
        establishedDate:{
            type:Date,
        },
        isActive:{
            type:Boolean,
            default: true,
        },

    },
    {timestamps: true}
);



export default mongoose.model("chapter", chapterSchema);