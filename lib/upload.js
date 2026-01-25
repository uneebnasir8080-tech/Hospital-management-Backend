import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: "dolpbmb1f",
  api_key: "193371155693659",
  api_secret: "F6eB7TESLiJPpJeGFdADMkrgPpA",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "upload",
    public_id: (req, file) => file.fieldname + "-" + Date.now(),
  },
});

export const upload = multer({ storage:storage });

// app.post("/profile",  function (req, res) {

//   return res.send("upload successfull");
// });