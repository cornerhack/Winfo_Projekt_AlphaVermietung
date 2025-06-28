import nodemailer from 'nodemailer';
import express from 'express';
const router = express.Router();
import path from 'path';
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Verbindungsaufbau zum Mailserver
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "autovermietungalpha@gmail.com",
    pass: "dsef pzpc bggv aafl"
  }
});

// Mail senden
router.post("/sendmail", async (req, res) => {
  const { name, email } = req.body;

  // Mail Inhalt
  const mailOptions = {
    from: '"AutoMieten24" <autovermietungalpha@gmail.com>',
    to: email,
    subject: "Ihre PDF-Datei",
    text: `Hallo ${name}, im Anhang finden Sie Ihre PDF.`,
    /*attachments: [
      {
        filename: "dokument.pdf", // Beispielname für die PDF-Datei
        path: path.join(__dirname, "pdfs", "dokument.pdf"), // Beispielpfad
      },
    ],*/
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("E-Mail gesendet:", info.messageId);
    res.status(200).json({ message: "E-Mail erfolgreich gesendet" });
  } catch (error) {
    console.error("Fehler beim Senden:", error);
    res.status(500).json({ message: "Fehler beim Senden", error });
  }
});

router.post("/reservierung", async (req, res) => {
  const {name, email, id} = req.body;
  reservierungSchicken(name, email, id);
});

export async function reservierungSchicken(name, email, id){
  const pdfPath = path.join(__dirname, "../../pdfs/reservierungen", `reservierung-${id}.pdf`);
  const mailOptions = {
    from: '"AutoMieten24" <autovermietungalpha@gmail.com>',
    to: email,
    subject: `Reservierungsbestätigung`,
    text: `Hallo ${name}, \n\nim Anhang finden Sie Ihre Reservierung.\n\nVielen Dank für Ihre Reservierung!\nIhr Team von Autovermietung Alpha`,
    attachments: [
      {
        filename: `reservierung-${id}.pdf`,
        path: pdfPath,
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("E-Mail gesendet:", info.messageId);
    return true;
  } catch (error) {
    console.error("Fehler beim Senden:", error);
    return false;
  }
}

router.post('/newPassword', async (req, res) => {
  const { email } = req.body;

    const resetUrl = `http://localhost:3000/html/zuruecksetzen.html?email=${encodeURIComponent(email)}`;

    const mailOptions = {
      from: '"AutoMieten24" <autovermietungalpha@gmail.com>',
      to: "royahmad1096@gmail.com",
      subject: "Passwort zurücksetzen",
      text: `${resetUrl}`,
      html: `
        <p>Klicken Sie <a href="${resetUrl}" target="_blank">hier</a>, um Ihr Passwort zurückzusetzen.</p>
        <p>Falls Sie das nicht waren, ignorieren Sie diese Nachricht.</p>
      `
    };
  try {
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Zurücksetzungslink wurde gesendet." });
  } catch (err) {
    console.error("Fehler beim Versenden der Mail:", err);
    return res.status(500).json({ error: "Fehler beim Versenden der E-Mail." });
  }
})

export default router;