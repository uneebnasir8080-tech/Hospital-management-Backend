import nodemailer from "nodemailer";

export const sendMail = async (subject, receiver, body) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "uneebmughal794@gmail.com",
      pass: "cmrw nfia owxf iuma",
    },
  });
  const option = {
    from: `"Hospital Manager"<uneeb>`,
    to: receiver,
    subject: subject,
    html: body,
  };
  try {
    await transporter.sendMail(option);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
