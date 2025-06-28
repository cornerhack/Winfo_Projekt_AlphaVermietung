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

// Route: Ruecknahmeprotokoll speichern + PDF erzeugen
router.post("/rueckgabeprotokoll", async (req, res) => {
  const {
    mitarbeiterID,
    mietvertragID,
    tank,
    sauberkeit,
    schadenTarifID,
    kilometerstand,
  } = req.body;

  if (
    !mitarbeiterID ||
    !mietvertragID ||
    typeof tank !== "number" ||
    !sauberkeit ||
    !schadenTarifID ||
    !kilometerstand
  ) {
    return res.status(400).json({ error: "Ungültige Eingabedaten" });
  }

  try {
    const protokollDatum = dayjs().format("YYYY-MM-DD");

    // Daten in die Datenbank für die Rückgabe einfügen
    const [insertResult] = await connection.promise().execute(
      `INSERT INTO ruecknahmeprotokolle 
       (ruecknahmeprotokollID, ersteller, protokollDatum, tank, sauberkeit, schadenTarifID, kilometerstand, mietvertragID)
       VALUES (21, ?, ?, ?, ?, ?, ?, ?)`,
      [mitarbeiterID, protokollDatum, tank, sauberkeit, schadenTarifID, kilometerstand, mietvertragID]
    );

    // Reservierung auf "abgeschlossen" setzen
    await connection.promise().execute(
      `UPDATE reservierungen
         SET status = 'abgeschlossen'
         WHERE reservierungID = ?`,
        [mietvertragID]);

    // PDF direkt erzeugen
    const [rows] = await connection.promise().execute(
      `SELECT rp.*, 
              DATE_FORMAT(rp.protokollDatum, '%d.%m.%Y') AS datum,
              m.vorname AS mitarbeiterVorname,
              m.nachname AS mitarbeiterNachname,
              t.tarifBez, t.tarifPreis,
              k.marke, k.modell, k.getriebe, k.kfzID,
              r.kundeID, r.mietbeginn, r.mietende, r.zusaetze, r.abgabestationID
       FROM ruecknahmeprotokolle rp
       JOIN mitarbeiter m ON rp.ersteller = m.mitarbeiterID
       JOIN tarife t ON rp.schadenTarifID = t.tarifID
       JOIN mietvertraege mv ON rp.mietvertragID = mv.mietvertragID
       JOIN kfz k ON mv.kfzID = k.kfzID
       JOIN reservierungen r ON mv.reservierungID = r.reservierungID
       WHERE rp.ruecknahmeprotokollID = ?`,
      [insertResult.insertId]
    );

    const data = rows[0];
    // Kilometerstand und Abgabestation aktualisieren
    await connection.promise().execute(
      `UPDATE kfz 
       SET kilometerStand = ?, standortMietstationID = ? 
       WHERE kfzID = ?`,
      [kilometerstand, data.abgabestationID, data.kfzID]
    );

    const pdfDir = path.join(__dirname, "../../pdfs/protokolle");
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });
    const filePath = path.join(pdfDir, `rueckgabe-${mietvertragID}.pdf`);

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(fs.createWriteStream(filePath));

    doc
      .fontSize(20)
      .text("Fahrzeug-Rücknahmeprotokoll", { align: "center" })
      .moveDown(1);

    doc
      .fontSize(12)
      .text(`Datum: ${data.datum}`, 50, doc.y)
      .text(`Erstellt von: ${data.mitarbeiterVorname} ${data.mitarbeiterNachname}`, 50)
      .moveDown(1);

    doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor("#cccccc").stroke().moveDown(1);

    // Fahrzeugdaten
    doc.fontSize(14).text("Fahrzeugdaten", { underline: true }).moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Marke/Modell: ${data.marke} ${data.modell}`);
    doc.text(`Getriebe: ${data.getriebe}`);
    doc.text(`Kilometerstand bei Rückgabe: ${data.kilometerstand} km`).moveDown(1);

    // Fahrzeugzustand
    const zusatz = data.zusaetze || "";
    let tankGebuehr = Math.round(((1 - data.tank) * 150),2);
    if(zusatz.includes("tankservice")) {
      tankGebuehr = 0; // Keine Kosten für nicht vollen Tank
    }
    let schadenkosten = data.tarifPreis;
    if(zusatz.includes("versicherung")) {
      schadenkosten = 0; // Keine Kosten für Schaden wegen Versicherung
    }
    doc.fontSize(14).text("Fahrzeugzustand", { underline: true }).moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Tankstand: ${Math.round(data.tank * 100)}%`);
    doc.text(`Kosten für Tankfüllung: ` + tankGebuehr.toFixed(2) + ` €`);
    doc.text(`Sauberkeit: ${data.sauberkeit}`);
    doc.text(`Schaden: ${data.tarifBez}`);
    doc.text(`Kosten für Schäden laut Tarif: ` + schadenkosten.toFixed(2) + ` €`).moveDown(1);

    // Vertragsdaten
    doc.fontSize(14).text("Mietvertragsdaten", { underline: true }).moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Mietbeginn: ${dayjs(data.mietbeginn).format("DD.MM.YYYY")}`);
    doc.text(`Mietende: ${dayjs(data.mietende).format("DD.MM.YYYY")}`);
    doc.text(`Zusatzleistungen: ${data.zusaetze || "Keine"}`).moveDown(2);

    // Unterschriftsbereich
    doc.text("Unterschrift Mitarbeiter: ____________________     Datum: __________", 50, doc.y).moveDown(2);
    doc.text("Unterschrift Kunde: ____________________     Datum: __________", 50, doc.y);

    doc.end();

    res.status(201).json({
      message: "Protokoll gespeichert & PDF erstellt",
      protokollID: insertResult.insertId,
      pdfPath: `/pdfs/protokolle/rueckgabe-${mietvertragID}.pdf`
    });
  } catch (err) {
    console.error("❌ Fehler beim Speichern oder PDF-Erstellen:", err);
    res.status(500).json({ error: "Fehler beim Speichern oder PDF-Erstellen" });
  }
});

export default router;
