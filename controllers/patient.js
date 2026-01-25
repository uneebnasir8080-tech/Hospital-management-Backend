import { Appointment } from "../models/appointment.js"




// patient make appointment "/patient/appointment" 



export const makeAppointment = async(req ,res)=>{
    const {doctorId, patientId, date, time, status}= req.body
    if(!doctorId || !patientId || !date || !date || !time){
        return res.status(400).json({status:false, message:"Fill the required feild"})
    }
    const savedData= new Appointment({
        doctorId,
        patientId,
        time,
        date,
        status
    })
    const saved= await savedData.save()
    if(!saved){
        return res.status(404).json({status:false, message:"Appointment not booked"})
    }
        return res.status(200).json({status:true, message:"Appointment booked"})

}