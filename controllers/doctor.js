import { Appointment } from "../models/appointment.js";
import { Doctor } from "../models/doctor.js";
import { Schedule } from "../models/schedule.js";
import { User } from "../models/user.js";
import { sendMail } from "../utils/emailSender.js";
import { emailVerification } from "../utils/emailTemplate/emailverification.js";

export const setSchedule = async (req, res) => {
  try {
    const { doctorId, days, slot, startTime, endTime, fee } = req.body;
    const role = req.user.role;
    if (role === "patient") {
      return res.status(400).json({ status: false, message: "Access deined" });
    }
    if (!doctorId || !days || !slot || !startTime || !endTime || !fee) {
      return res
        .status(400)
        .json({ status: false, message: "Fill required feilds" });
    }

    const checkDoc = await Doctor.findOne({ userId: doctorId });
    if (!checkDoc) {
      return res
        .status(404)
        .json({ status: false, message: "Doctor not exists" });
    }
    const checkExists = await Schedule.findOne({ doctorId });
    if (checkExists) {
      return res
        .status(404)
        .json({ status: false, message: "Already created" });
    }
    const savedData = new Schedule({
      doctorId,
      days,
      slot,
      startTime,
      endTime,
      fee
    });
    const saved = await savedData.save();
    if (!saved) {
      return res
        .status(404)
        .json({ status: false, message: "Schedule not created" });
    }
    return res
      .status(200)
      .json({ status: true, message: "Created Successfully" });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error?.message,
    });
  }
};

// get doctor with schedule "/schedule"

export const getSchedule = async (req, res) => {
  try {
    const {docId}=req.query
    // const userId = req.userId;
    // console.log("first", docId)
    // const doctorId = req.body;
    if (!docId) {
      return res
        .status(400)
        .json({ status: false, message: "Doctor Id required" });
    }
    const getDoctor = await Doctor.findOne({ _id: docId })
    .populate("schedule")
    .populate('userId')
    if (!getDoctor) {
      return res
        .status(404)
        .json({ status: false, message: "Schedule not found" });
    }
    return res.status(200).json({ getDoctor });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error?.message,
    });
  }
};

// get doctor with appointments "/appointments"

export const getAppointment = async (req, res) => {
  try {
    const doctorId = req.userId;
    if (!doctorId) {
      return res
        .status(400)
        .json({ status: false, message: "Reference not found" });
    }
    if (req.user.role === "patient") {
      return res
        .status(400)
        .json({ status: false, message: "Only Doctor can access this" });
    }
    // getdata
    const getData = await Doctor.findOne({ userId: doctorId }).populate(
      "appointment",
    );
    if (!getData) {
      return res
        .status(404)
        .json({ status: false, message: "Record not found" });
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

// cancel the appointment "/cancel-appointment"

export const cancelAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, patientEmail } = req.body;
    if (!doctorId || !patientId) {
      return res
        .status(400)
        .json({ status: false, message: "Fill the required feild" });
    }

    //  checking appoing exist or not
    const checkAppointment = await Appointment.findOne({ doctorId, patientId });
    if (!checkAppointment) {
      return res
        .status(404)
        .json({ status: false, message: "Appointment not found" });
    }
    if (checkAppointment.status === "cancelled") {
      return res
        .status(404)
        .json({ status: false, message: "Appointment already cancelled" });
    }
    const update = await checkAppointment.updateOne({
      status: "cancelled",
    });
    if (!update) {
      return res
        .status(404)
        .json({ status: false, message: "Appointment not cancelled" });
    }
    await sendMail(
      "Appointment Cancelled",
      patientEmail,
      emailVerification(
        "Appointment Cancelled",
        "Your Appointment are cancelled by the doctor for more information click this button",
        "https://www.linkedin.com/in/uneeb-nasir80",
      ),
    );
    return res
      .status(200)
      .json({ status: true, message: "Appointment cancelled" });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error?.message,
    });
  }
};
