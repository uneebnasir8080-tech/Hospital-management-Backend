import { Appointment } from "../models/appointment.js";
import { Doctor } from "../models/doctor.js";
import { Patient } from "../models/patient.js";
import { normalizeDate, weekDays } from "../lib/weekdays.js";
import {sendMail} from "../utils/emailSender.js"
import {emailVerification} from "../utils/emailTemplate/emailverification.js"
import { User } from "../models/user.js";

// patient make appointment "/patient/appointment"

export const makeAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, date, time, status } = req.body;
    if (!doctorId || !patientId || !date || !date || !time) {
      return res
        .status(400)
        .json({ status: false, message: "Fill the required feild" });
    }
    //   formating time
    const timeRegex = /^([1-9]|1[0-2]):[0-5][0-9]\s?(am|pm)$/i;

    if (!timeRegex.test(time)) {
      return res.status(400).json({
        message: "Time must be in format hh:mm AM or PM",
      });
    }

    const normalizedDate = normalizeDate(date);
    // date convert into weekday

    const day = weekDays(date);

    //   checking doctor
    const checkDoctor = await Doctor.findOne({ _id: doctorId })
    .populate("schedule",)
    .populate("appointment")

    if (!checkDoctor || !checkDoctor.schedule) {
      return res
        .status(404)
        .json({ status: false, message: "Doctor or schedule not exists" });
    }

    
    const checkingAppointment= checkDoctor?.appointment
    //   checking patient
    const checkPatient = await Patient.findOne({ _id: patientId });
    if (!checkPatient) {
      return res
        .status(404)
        .json({ status: false, message: "Patient not exists" });
    }
    // checking doctor avaiable on specific day 
    if (!checkDoctor.schedule.days.includes(day)) {
      return res
        .status(401)
        .json({ status: false, message: `Doctor is not available on ${day}` });
    }

   // check Appointment doctor has already appointment on that day or not 
// const isBooked = checkingAppointment.some((check) =>
//   check.doctorId === doctorId &&
//   check.time === time &&
//   normalizeDate(check.date) === date
// );


// if (isBooked) {
//   return res.status(404).json({
//     status: false,
//     message: "Doctor slot already booked",
//   });
// }


    //  check appointment avaiable or not
    const slotBooked = await Appointment.findOne({
      doctorId,
      date: normalizedDate,
      time,
    });
    if (slotBooked) {
      return res
        .status(404)
        .json({ status: false, message: "Slot already booked" });
    }

    //  check appointment already book or not
    const checking = await Appointment.findOne({ doctorId, patientId, date });
    if (checking) {
      return res
        .status(404)
        .json({ status: false, message: "Appointment Already booked" });
    }
    const savedData = new Appointment({
      doctorId,
      patientId,
      time,
      date,
      status,
    });
    const saved = await savedData.save();
    if (!saved) {
      return res
        .status(404)
        .json({ status: false, message: "Appointment not booked" });
    }
    await sendMail(
      "Appointment Booked",
      checkPatient.email,
      emailVerification(
        "Appointment Booked",
        "we booked your appointment with this doctor and the date is this 12/02/2026 and the time is: 9:00 am for more information click this button",
        "https://www.linkedin.com/in/uneeb-nasir80",
      ),
    );
    await sendMail(
      "Appointment Booked",
      checkDoctor.email,
      emailVerification(
        "Appointment Booked",
        "Your Appointment is booked ",
        "https://www.linkedin.com/in/uneeb-nasir80",
      ),
    );
    return res
      .status(200)
      .json({ status: true, message: "Confirm Payment" });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server Error",
      error: error?.message,
    });
  }
};

// get Appointment from patient "/patient"

export const getAppointment = async (req, res) => {
  try {
    const {userId} = req.query;
    if (!userId) {
      return res
        .status(400)
        .json({ status: false, message: "Reference not found" });
    }
    if (req.user.role !== "patient") {
      return res
        .status(401)
        .json({ status: false, message: "Only patient can get this" });
    }
    const getData = await Patient.findOne({ userId }).populate({
      path:"appointment",
      populate:{
        path:"doctorId",
        populate:{
          path:"userId"
        }
      }
    })
    if (!getData) {
      return res
        .status(400)
        .json({ status: false, message: "No Record found" });
    }
    return res.status(200).json({ getData });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server Error",
      error: error?.message,
    });
  }
};


// get all patient and appointments with doctor 

export const getAllAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ status: false, message: "Reference not found" });
    }    
    const getData = await Appointment.find()
  .populate({
    path:"patientId",
    select:"age",
    populate:{
      path:"userId",
      select:"name"
    }
  })
  .populate({
    path:"doctorId",
    select:"specialization",
    populate:{
      path:"userId",
      select:"name"
    }
  })
    if (!getData) {
      return res
        .status(400)
        .json({ status: false, message: "No Record found" });
    }
    return res.status(200).json({ getData });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server Error",
      error: error?.message,
    });
  }
};