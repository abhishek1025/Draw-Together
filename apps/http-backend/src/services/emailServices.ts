import nodemailer from "nodemailer";

export async function sendEmail(emailParams: {
  to: string;
  subject: string;
  htmlBody: string;
}) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for port 465, false for other ports
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      ...emailParams,
      from: process.env.SENDER_EMAIL,
      html: emailParams.htmlBody,
    });
  } catch (error: unknown) {
    console.log(error);
  }
}
