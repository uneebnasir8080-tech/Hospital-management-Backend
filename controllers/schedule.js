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
    return res
      .status(500)
      .json({
        status: false,
        message: "Internal server error",
        error: error?.message,
      });
  }
};



