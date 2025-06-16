import nodemailer from 'nodemailer';
import express from 'express';
const router = express.Router();
import path from 'path';

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
    from: '"Deine Firma" <autovermietungalpha@gmail.com>',
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

export default router;