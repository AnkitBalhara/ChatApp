import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      default: "",
      type: String,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("UserModel", userSchema);

export default UserModel;
