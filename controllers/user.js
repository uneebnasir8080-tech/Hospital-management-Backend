import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

// creating user on "/create"

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res
        .status(401)
        .json({ status: false, message: "Fill the required feilds" });
    }

    // checking existing user
    const checkUser = await User.exists({ email });
    if (checkUser) {
      return res
        .status(404)
        .json({ status: false, message: "User already registered" });
    }

    // hashing password
    const hashed = await bcrypt.hash(password, 12);

    // save user in database

    const saving = new User({
      name,
      email,
      password: hashed,
      role,
    });
    const savedUser = await saving.save();
    if (!savedUser) {
      return res
        .status(404)
        .json({ status: false, message: "Something went wrong" });
    }
    return res
      .status(200)
      .json({ status: true, message: "Successfully registered" });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error?.message,
    });
  }
};

// login user  "/login"

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        status: false,
        message: "Email or Password must not be empty",
      });
    }

    // checking user exists or not
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res
        .status(404)
        .json({ status: false, message: "Invalid Credentials" });
    }

    // checking password

    const verifyPasword = await bcrypt.compare(password, checkUser.password);
    if (!verifyPasword) {
      return res
        .status(404)
        .json({ status: false, message: "Invalid Credentials" });
    }
    const id = checkUser._id.toString();
    // token generating
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT({ userId: id })
      .setIssuedAt()
      .setExpirationTime("24h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);
    const userdata = {
      name: checkUser.name,
      email: checkUser.email,
      role: checkUser.role,
    };
    return res.status(200).json({
      status: true,
      message: "Login Successfull",
      data: userdata,
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

// change password

export const chengePassword = async (req, res) => {
  try {
    const { email, password, newPassword } = req.body;
    if (!email || !password || !newPassword) {
      return res.status(400).json({ status: false, message: "Enter email" });
    }
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res
        .status(404)
        .json({ status: false, message: "Enter valid email" });
    }
    if (!checkUser._id === req.userId) {
      return res.status(401).json({ status: false, message: "Invalid User" });
    }

    // comparing password
    const compare = await bcrypt.compare(password, checkUser.password);
    console.log("compare", compare);
    if (!compare) {
      return res
        .status(404)
        .json({ status: false, message: "Invalid old password" });
    }
    const hashed = await bcrypt.hash(newPassword, 12);
    await checkUser.updateOne({
      password: hashed,
    });
    return res
      .status(200)
      .json({ status: true, message: "Password successfully updated" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};




// patient data added "/patient"

export const addedPatient= async(req,res)=>{
  
}












// admin added  "/user/admin"

export const createAdmin = async (req, res) => {
  console.log("hello admin");
};


