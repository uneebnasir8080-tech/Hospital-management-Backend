import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { Patient } from "../models/patient.js";
import { Admin } from "../models/admin.js";
import { Doctor } from "../models/doctor.js";

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
    const checkUser = await User.findOne({ email })
    .populate("doctor")
    .populate("patient")
    .populate("admin")
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
      id: checkUser._id,
      name: checkUser.name,
      email: checkUser.email,
      role: checkUser.role,
    };
    //checking their profile data filled or not 
    if(checkUser.role==="patient" && checkUser.patient===null){
      return res.status(200).json({
      status: true,
      message: "Profile inComplete",
      user: userdata,
      token,
    });
    }
     if(checkUser.role==="doctor" && checkUser.doctor===null){
      return res.status(200).json({
      status: true,
      message: "Profile inComplete",
      user: userdata,
      token,
    });
  }
   if(checkUser.role==="admin" && checkUser.admin===null){
      return res.status(200).json({
      status: true,
      message: "Profile inComplete",
      user: userdata,
      token,
    });
  }
    return res.status(200).json({
      status: true,
      message: "Login Successfull",
      user: userdata,
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        status: false,
        message: "Internal server error",
        error: error?.message,
      });
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

export const addPatient = async (req, res) => {
  try {
    const { age, history, gender, blood } = req.body;
    if (!blood || !gender) {
      return res
        .status(400)
        .json({ status: false, message: "Feild shouldn't be empty" });
    }
    const { path } = req.file;
    const id = req.userId;
    if (req.user.role !== "patient") {
      return res
        .status(401)
        .json({ status: false, message: "Only patient access this" });
    }
    const checkPatient = await Patient.findOne({ userId: id });
    if (checkPatient) {
      return res
        .status(494)
        .json({ status: false, message: "Patient already exists" });
    }
    const updateData = new Patient({
      profile: path,
      age,
      history,
      gender,
      blood,
      userId: id,
    });
    const data = await updateData.save();
    if (!data) {
      return res
        .status(404)
        .json({ status: false, message: "Form submitted unsuccessful" });
    }
    return res.status(200).json({ status: true, message: "Form Submitted" });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error?.message,
    });
  }
};

// admin added  "/user/admin"

export const createAdmin = async (req, res) => {
  try {
    const { path } = req.file;
    const userId = req.userId;
    if (req.user.role !== "admin") {
      return res
        .status(401)
        .json({ status: false, message: "Only Admin can access this" });
    }
    const checkAdmin = await Admin.findOne({ userId });
    if (checkAdmin) {
      return res.status(404).json({ statsu: false, message: "Already exists" });
    }
    const savedData = new Admin({
      profile: path,
      userId,
    });
    const saved = await savedData.save();
    if (!saved) {
      return res
        .status(404)
        .json({ statsu: false, message: "Upload unsuccessfull" });
    }
    return res
      .status(200)
      .json({ statsu: true, message: "Created successfull" });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error?.message,
    });
  }
};

// create doctor "/doctor"

export const createDoctor = async (req, res) => {
  try {
    const { path } = req.file;
    const userId = req.userId;
    if (!req.body.role) {
      return res
        .status(400)
        .json({ status: false, message: "Role is required" });
    }
    const { age, specialization, gender, experience } = req.body;
    if (!specialization || !experience || !gender) {
      return res
        .status(400)
        .json({ status: false, message: "Complete required data" });
    }
    if (req.body.role === "doctor" || req.body.role === "doctor") {
      const checkDoctor = await Doctor.findOne({ userId });
      if (checkDoctor) {
        return res
          .status(404)
          .json({ status: false, message: "Already exists" });
      }
      const savedData = new Doctor({
        age,
        specialization,
        gender,
        experience,
        profile: path,
        userId,
      });
      const saved = await savedData.save();
      if (!saved) {
        return res
          .status(404)
          .json({ status: false, message: "created unsuccessfull" });
      }
      return res
        .status(200)
        .json({ status: true, message: "Created Successfull" });
    }
    return res.status(401).json({ status: false, message: "Access denied" });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error?.message,
    });
  }
};

//  get user data with role "/user"
export const getUser = async (req, res) => {
  try {
    const {userId} = req.query;
    const role = req.user.role;
    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "Something went wrong",
      });
    }
    const getData = await User.findById(userId);
    if (!getData) {
      return res.status(404).json({ status: false, message: "User not foumd" });
    }
    let data;
    if (role === "admin") {
      data = await getData.populate("admin");
    }
    if (role === "patient") {
      data = await getData.populate("patient");
    }
    if (role === "doctor") {
      data = await getData.populate("doctor");
    }
    if (!data) {
      return res.status(404).json({ status: false, message: "data not foumd" });
    }
    return res.status(200).json({
      data,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error in this",
      error: error?.message,
    });
  }
};

// get all data with all user and all roles "/user-all"

export const getAllUser = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "Something went wrong",
      });
    }
    const role = req.user.role;
    if (role !== "admin") {
      return res
        .status(401)
        .json({ status: false, message: "Only admin can do that" });
    }

    const getData = await User.findById(userId);
    if (!getData) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    const allData = await User.find()
      .populate("admin")
      .populate("patient")
      .populate("doctor");
    if (!allData) {
      return res.status(404).json({ status: false, message: "data not found" });
    }
    return res.status(200).json({ allData });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error?.message,
    });
  }
};


// get all doctors 

export const getAllDoctors = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "Something went wrong",
      });
    }
    const getData = await User.find({role:"doctor"})
    .populate({
    path: "doctor",
    populate: {
      path: "schedule"
    }
  });
    
    if (!getData) {
      return res.status(404).json({ status: false, message: "Doctor not found" });
    }
    return res.status(200).json({ getData });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error?.message,
    });
  }
};


// get all patient 

export const getAllPatient = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "Something went wrong",
      });
    }
    const getData = await User.find({role:"patient"}).populate('patient');
    if (!getData) {
      return res.status(404).json({ status: false, message: "Patient not found" });
    }
    return res.status(200).json({ getData });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error?.message,
    });
  }
};

// delete patient 

export const deletePatient= async(req, res)=>{
  const userId= req.userId
  if(!userId){
     return res.status(400).json({
        status: false,
        message: "Something went wrong",
      });
  }
  const {id} = req.params
  
  // checking exist or not 
  const checkPatient= await User.findById(id)
  if(!checkPatient){
    return res.status(404).json({status:false, message:"Patient not exists"})
  }
  const deleting = await User.deleteOne({_id:id})
  if(!deleting){
    return res.status(404).json({status:false, message:"Patient deleted unsuccessfull"})
  }
    return res.status(200).json({status:true, message:"Patient Deleted"})
}