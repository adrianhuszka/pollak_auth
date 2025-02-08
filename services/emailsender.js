import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use false for STARTTLS; true for SSL on port 465
  auth: {
    user: "nzsombips3@gmail.com",
    pass: "ifrb qvvz pjuh zqom",
  },
});

// async..await is not allowed in global scope, must use a wrapper
export async function Kuldes(useremail) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    to: useremail,
    subject: "Jelszó-visszaállítás",
    text: "[Jelszo link]",
    html:
      "<div style='font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; width: 100%; max-width: 600px;margin: 0 auto;background-color: #ffffff;padding: 20px;border-radius: 10px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);'>" +
      "<div style=' text-align: center; margin-bottom: 20px;'>" +
      "<img src='https://i.ibb.co/wBX1pPt/majom.png' alt='Logo' style=' max-width: 150px;'>" +
      "</div>" +
      "<div style='text-align: center; margin-bottom: 20px; color: #333;'>" +
      "<h2 style=' color: #000000;'>Elfelejtett jelszó</h2> <br>" +
      "<p>A jelszavad visszaállítását kérted, ha te voltál, az alábbi gombra kattintva elvégezheted azt!</p>" +
      "<p><a href='[Jelszó visszaállító link]' style=' background-color: #45a049;  display: inline-block; padding: 15px 30px;background-color: #4CAF50; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;'>Állítsd vissza a jelszót</a></p>" +
      "<p>Ha nem te voltál akkor ezt az emailt hagyd figyelmen kívül.</p>" +
      "<p>A link 1 óráig érvényes, ezután lejár.</p>" +
      "</div>" +
      "<div style='text-align: center; font-size: 12px; color: #777; margin-top: 20px;'>" +
      "<p>Üdvözlettel,</p>" +
      "<p>Zsombot :3</p>" +
      "</div>" +
      "</div>",
  });

  console.log("Message sent: %s", info.messageId);
}
