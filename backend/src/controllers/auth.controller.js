import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/generateToken.js";
import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  //   res.send("JAI SHREE RAM");
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be of 6 characters" });
    }
    const AlreadyUser = await UserModel.findOne({ email });
    if (AlreadyUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({ fullName, email, password: hashPassword });

    if (newUser) {
      // generate jwt token
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "Invalid User Data" });
    }
  } catch (error) {
    console.log("Error in SignUp", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  // res.send("JAI SHREE RAM");
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials E" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid Credentials P" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in Login Controller :-", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  // res.send("JAI SHREE RAM");
  try {
    res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
    res.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    console.log("Error in Logout Controller:-", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  console.log("first")
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({ message: "Profile Pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    res.status(200).json(updateUser);
  } catch (error) {
    console.log("Error in Profile Update", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = async (req,res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
