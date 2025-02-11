import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    recieverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    text:{
        type:String
    },
    image:{
        type:String
    }
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("MessageModel", messageSchema);

export default MessageModel;
