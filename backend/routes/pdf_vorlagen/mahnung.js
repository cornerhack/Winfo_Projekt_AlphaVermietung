import express from "express";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import dayjs from "dayjs";
import { fileURLToPath } from "url";
import connection from "../../db.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post("/mahnung", async (req, res) => {
  const { rechnungNr } = req.body;

  if (!rechnungNr) {
    return res.status(400).json({ error: "Rechnungsnummer fehlt" });
  }

  try {
    const [rows] = await connection.promise().execute(
      `
      SELECT r.*, k.vorname, k.nachname, k.unternehmen, k.emailAdresse
      FROM rechnungen r
      JOIN kunden k ON r.kundeID = k.kundeID
      WHERE r.rechnungNr = ?
      `,
      [rechnungNr]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Rechnung nicht gefunden" });
    }

    const data = rows[0];
    const today = dayjs();
    const mahnstufe = data.mahnstatus;
    const rechnungsbetrag = parseFloat(data.rechnungBetrag);
    const zahlungslimit = dayjs(data.zahlungslimit);
    const tageVerzug = Math.max(0, today.diff(zahlungslimit, "day"));

    // Mahnparameter
    let neueMahnstufe, neueMahnstufeNr, mahngebuehr = 0, zinssatz = 0;

    switch (mahnstufe) {
      case "erste Mahnung": // bereits erste Mahnung erhalten
        neueMahnstufe = "zweite Mahnung";
        neueMahnstufeNr = 2;
        mahngebuehr = 5.0;
        zinssatz = 0.05;
        break;
      case "zweite Mahnung": // bereits zweite Mahnung erhalten
        neueMahnstufe = "dritte Mahnung";
        neueMahnstufeNr = 3;
        mahngebuehr = 15.0;
        zinssatz = 0.08;
        break;
      default: // noch keine Mahnung erhalten 
        neueMahnstufe = "erste Mahnung";
        neueMahnstufeNr = 1;
    }

    const zinsen = parseFloat(((rechnungsbetrag * zinssatz) / 365) * tageVerzug).toFixed(2);
    const gesamtbetrag = (rechnungsbetrag + mahngebuehr + parseFloat(zinsen)).toFixed(2);
    const neuesZahlungslimit = today.add(7, "day").format("YYYY-MM-DD");

    // Datenbank aktualisieren
    await connection.promise().execute(
      `UPDATE rechnungen SET rechnungBetrag = ?, mahnstatus = ?, zahlungslimit = ? WHERE rechnungNr = ?`,
      [gesamtbetrag, neueMahnstufe, neuesZahlungslimit, rechnungNr]
    );

    // PDF-Verzeichnis
    const pdfDir = path.join(__dirname, "../../pdfs/mahnungen");
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    const pdfPath = path.join(pdfDir, `mahnung-${rechnungNr}-`+neueMahnstufeNr+`.pdf`);
    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // PDF-Inhalt
    doc
      .fontSize(16)
      .text(`${neueMahnstufe} zur Rechnung Nr. ${rechnungNr}`, { align: "center" })
      .moveDown(2);

    doc
      .fontSize(12)
      .text(`Sehr geehrte*r ${data.unternehmen || data.vorname + " " + data.nachname},`)
      .moveDown()
      .text(`trotz unserer bisherigen Erinnerung haben wir bis heute keinen Zahlungseingang erhalten.`)
      .text(`Wir fordern Sie daher auf, den offenen Betrag bis spätestens ${dayjs(neuesZahlungslimit).format("DD.MM.YYYY")} zu begleichen.`)
      .moveDown();

    doc
      .text("Forderungsaufstellung:", { underline: true })
      .moveDown(0.5)
      .text(`Offener Rechnungsbetrag: ${rechnungsbetrag.toFixed(2)} €`)
      .text(`Mahngebühr: ${mahngebuehr.toFixed(2)} €`)
      .text(`Verzugszinsen: ${zinsen} €`)
      .moveDown()
      .font("Helvetica-Bold")
      .text(`Gesamtbetrag: ${gesamtbetrag} €`)
      .font("Helvetica")
      .moveDown(2);

    if (neueMahnstufe === "dritte Mahnung") {
      doc
        .fillColor("red")
        .text("Sollten Sie den Betrag nicht fristgerecht begleichen, sehen wir uns gezwungen, ein gerichtliches Mahnverfahren einzuleiten.", {
          align: "left",
        })
        .fillColor("black")
        .moveDown();
    }

    doc
      .text("Mit freundlichen Grüßen")
      .text("Autovermietung Alpha GmbH");

    doc.end();

    writeStream.on("finish", () => {
      return res.status(200).json({
        message: `Mahnung erstellt und gespeichert.`,
        neueMahnstufe,
        gesamtbetrag,
        pdfPath,
      });
    });
  } catch (err) {
    console.error("❌ Fehler beim Mahnungsschreiben:", err);
    res.status(500).json({ error: "Fehler beim Erstellen der Mahnung" });
  }
});

export default router;
