import mongoose from "mongoose";


const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    subtitle: {
      type: String,
      required: true,
      unique: true,
    },
    img: {
      type: String,
      required: true,
    },
    dateInfo:{
        type: String
    },
    text: [],
    url: {
        type: String
    }
  },
  { timestamps: true }
);


export default mongoose.model("News", NewsSchema)