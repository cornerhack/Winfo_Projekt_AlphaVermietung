import express from "express";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import dayjs from "dayjs";
import { fileURLToPath } from "url";
import connection from "../../db.js";
import { PassThrough } from "stream";
import { zusaetzeBetrag } from "../../berechnungen/calculate.js";
import {rechnungSchicken} from "../mailer/mailverteiler.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post("/rechnung", async (req, res) => {

  const { rechnungNr } = req.body;

  if(!rechnungNr)
    return res.status(400).json({ error: "Rechnungsnummer fehlt" });
  
  try {
    const [rows] = await connection.promise().execute(
      `
      SELECT r.rechnungNr, k.kundeID, r.ruecknahmeprotokollID, DATE_FORMAT(r.rechnungDatum, '%Y-%m-%d') AS rechnungDatum,
            res.gesamtbetrag, DATE_FORMAT(r.zahlungslimit, '%Y-%m-%d') AS zahlungslimit,
             k.vorname, k.nachname, k.unternehmen, k.strasse, k.hausNr, k.plz, k.ort, k.land, k.emailAdresse,
             m.reservierungID, DATE_FORMAT(res.mietbeginn, '%Y-%m-%d') AS mietbeginn,
             DATE_FORMAT(res.mietende, '%Y-%m-%d') AS mietende,
             round(p.tank,1) as tank, s.tarifBez, s.tarifPreis, res.zusaetze
      FROM rechnungen r
        JOIN ruecknahmeprotokolle p ON r.ruecknahmeprotokollID = p.ruecknahmeprotokollID
        JOIN mietvertraege m ON p.mietvertragID = m.mietvertragID
        JOIN reservierungen res ON m.reservierungID = res.reservierungID
          JOIN kunden k ON res.kundeID = k.kundeID
      LEFT JOIN tarife s ON p.schadenTarifID = s.tarifID
      join kfz on res.kfzID = kfz.kfzID
      WHERE r.rechnungNr = ?
      `,
      [rechnungNr]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Rechnung nicht gefunden" });
    }

    const data = rows[0];
    const tage = Math.max(1, Math.ceil((new Date(data.mietende) - new Date(data.mietende)) / (1000 * 60 * 60 * 24)));
    const zusatzBetrag = await zusaetzeBetrag(data.reservierungID);
    const zusatz = data.zusaetze || "Keine";
    let tankGebuehr = Math.round(((1 - data.tank) * 150),2);
    if(zusatz.includes("tankservice")) {
      tankGebuehr = 0; // Keine Kosten für nicht vollen Tank
    }
    let schadenkosten = data.tarifPreis;
    if(zusatz.includes("vollkaskoversicherung")) {
      schadenkosten = 0; // Keine Kosten für Schaden wegen Versicherung
    }
    
    // PDF-Stream starten
    const doc = new PDFDocument({ margin: 50 });
    const pdfPath = path.join(__dirname, `../../pdfs/rechnungen/rechnung-${data.rechnungNr}.pdf`);
    const writeStream = fs.createWriteStream(pdfPath);

    // Stream an Client + Datei gleichzeitig senden
    const passthrough = new PassThrough();
    doc.pipe(passthrough);
    passthrough.pipe(res);       // an den Browser
    doc.pipe(writeStream);       // in Datei schreiben

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
    "Content-Disposition",
    `inline; filename="rechnung-${data.rechnungNr}.pdf"`
    );


    // Logo
    try {
        const logoPath = path.join(__dirname, "../../../frontend/logo.jpg");

        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 50, 45, { width: 120 });
        } else {
            console.warn("⚠️ Logo nicht gefunden:", logoPath);
        }
    } catch (logoErr) {
        console.error("Fehler beim Laden des Logos:", logoErr);
    }

    // Firmeninfos rechts
    doc
    .fontSize(14)
    .text("Autovermietung Alpha GmbH", 400, 50, { align: "right" })
    .fontSize(10)
    .text("Musterstraße 1", { align: "right" })
    .text("12345 Berlin", { align: "right" })
    .text("autovermietungalpha@gmail.com", { align: "right" });

    doc.moveDown(2);

    // Linie
    doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#cccccc').stroke();

    // Kundendaten
    doc
    .moveDown()
    .fontSize(11)
    .text("Rechnung an:", { underline: true })
    .moveDown(0.2)
    .text(data.unternehmen || `${data.vorname} ${data.nachname}`)
    .text(`${data.strasse} ${data.hausNr}`)
    .text(`${data.plz} ${data.ort}`)
    .text(data.land);

    doc.moveDown(1.5);

    // Rechnungsdetails
    doc
    .fontSize(11)
    .text(`Kundennummer: ${data.kundeID}`, 50, doc.y)
    .text(`Rechnungsnummer: ${rechnungNr}`, 50, doc.y)
    .text(`Rechnungsdatum: ${dayjs(data.rechnungDatum).format("DD.MM.YYYY")}`, 50)
    .text(`Zahlbar bis: ${dayjs(data.zahlungslimit).format("DD.MM.YYYY")}`, 50);

    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#cccccc').stroke();

    doc.moveDown().fontSize(13).text("Leistungsübersicht", { underline: true }).moveDown(0.5);

    const labelX = 60;
    const valueX = 300;
    let y = doc.y; 
    const mietgebuehr = data.gesamtbetrag - tankGebuehr - data.tarifPreis - zusatzBetrag;
    const table = [
      ["Mietbeginn:", dayjs(data.mietbeginn).format("DD.MM.YYYY")],
      ["Mietdauer:", `${tage} Tage`],
      ["Mietgebühr:", `${mietgebuehr.toFixed(2)} €`],
      ["Zusatzleistungen:", zusatz],
      ["Zusatzkosten:", `${zusatzBetrag.toFixed(2)} €`],
      ["Tankauffüllung:", `${tankGebuehr.toFixed(2)} €`],
      ["Schaden:", data.tarifBez || "kein Schaden"],
      ["Schadenkosten:", `${data.tarifPreis?.toFixed(2) || "0.00"} €`],
    ];

    doc.fontSize(12);
    for (const [label, value] of table) {
      doc.text(label, labelX, y);
      doc.text(value, valueX, y);
      y += 20; // Abstand zwischen den Zeilen
    }

    doc.moveDown();
    doc
      .font("Helvetica-Bold")
      .text("Gesamtbetrag:", labelX)
      .text(`${data.gesamtbetrag.toFixed(2)} €`, labelX)
      .font("Helvetica");

    doc.moveDown().moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#cccccc').stroke();

    doc
    .moveDown(1.5)
    .fontSize(11)
    .text(
        "Bitte überweisen Sie den Rechnungsbetrag fristgerecht auf unser Konto:",
        { align: "left" }
    )
    .moveDown()
    .text("IBAN: DE12 3456 7890 1234 5678 00")
    .text("BIC: GENODEF1XXX")
    .text(`Verwendungszweck: Rechnungsnummer ${data.rechnungNr}`)
    .moveDown(2)
    .fontSize(10)
    .text("Vielen Dank für Ihre Buchung!", { align: "center" });

    await new Promise((resolve) => {
      writeStream.on("finish", resolve);
      doc.end();
    });
    await rechnungSchicken(k.vorname, k.emailAdresse, k.kundeID);
    res.json({rechnungNr});
  } catch (err) {
    console.error("Fehler beim Erstellen der PDF:", err);
    res.status(500).json({ error: "PDF-Erstellung fehlgeschlagen" });
  }
});

export default router;
