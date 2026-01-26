import { Doctor } from "../models/doctor.js";
import { Schedule } from "../models/schedule.js";

export const setSchedule = async (req, res) => {
  try {
    const { doctorId, days, slotDuration, startTime, endTime } = req.body;
    const role = req.user.role;
    if (role === "patient") {
      return res.status(400).json({ status: false, message: "Access deined" });
    }
    if (!doctorId || !days || !slotDuration || !startTime || !endTime) {
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
      slotDuration,
      startTime,
      endTime,
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
    const userId = req.userId;
    // const doctorId = req.body;
    if (!userId) {
      return res
        .status(400)
        .json({ status: false, message: "Doctor Id required" });
    }
    const getDoctor = await Doctor.findOne({ userId }).populate("schedule");
    if (!getDoctor) {
      return res
        .status(404)
        .json({ status: false, message: "Doctor not found" });
    }
    return res.status(200).json({ getDoctor });
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
    return res
      .status(500)
      .json({
        status: false,
        message: "Internal server error",
        error: error?.message,
      });
  }
};
