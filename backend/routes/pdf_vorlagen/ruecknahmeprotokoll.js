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
      resID, tank, kmNew, gesamtbetrag, sauberkeit, schadenTarifID
  } = req.body;
  const mitarbeiterID = req.session.user.id;

  try {
    const protokollDatum = dayjs().format("YYYY-MM-DD");

    const [mietvertrag] = await connection.promise().query(`
        SELECT * FROM mietvertraege WHERE reservierungID = ?`, [resID]);
    const d = await mietvertrag[0];
    const mietvertragID = d.mietvertragID;

    // Daten in die Datenbank für die Rückgabe einfügen
    const [insertResult] = await connection.promise().query(
      `INSERT INTO ruecknahmeprotokolle 
       ( ersteller, tank, sauberkeit, schadenTarifID, kilometerstand, mietvertragID)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [mitarbeiterID, tank, sauberkeit, schadenTarifID, kmNew, mietvertragID]
    );
    const ruecknahmeID = insertResult.insertId;
    // Reservierung auf "abgeschlossen" setzen und neuen Preis angeben
    await connection.promise().query(
      `UPDATE reservierungen
         SET status = 'abgeschlossen', gesamtbetrag = ?
         WHERE reservierungID = ?`,
        [resID, gesamtbetrag]);

    const limit = dayjs().add(14, 'day').format("YYYY-MM-DD");
    // Rechnung speichern
      const [rechnung] = await connection.promise().query(`
            INSERT INTO rechnungen (ruecknahmeprotokollID, rechnungDatum, mahnstatus, zahlungslimit) VALUES (?, ?, ?, ?)     
      `, [ruecknahmeID, protokollDatum, "keine", limit]);
      const rID = rechnung.insertId;

    // PDF direkt erzeugen
      const mitarbeiter = `${req.session.user.name} ${req.session.user.nachname}`;
    const [rows] = await connection.promise().query(
      `SELECT rp.*, 
              t.tarifBez, t.tarifPreis,
              k.marke, k.modell, k.getriebe, k.kfzID, k.kilometerStand kmAlt,
              r.kundeID, r.mietbeginn, r.mietende, r.zusaetze, r.abgabestationID, r.gesamtbetrag
       FROM ruecknahmeprotokolle rp
       JOIN tarife t ON rp.schadenTarifID = t.tarifID
       JOIN mietvertraege mv ON rp.mietvertragID = mv.mietvertragID
       JOIN reservierungen r ON mv.reservierungID = r.reservierungID
       JOIN kfz k ON r.kfzID = k.kfzID
       WHERE rp.ruecknahmeprotokollID = ?`,
      [ruecknahmeID]
    );

    const data = rows[0];
    // Kilometerstand und Abgabestation aktualisieren
    await connection.promise().query(
      `UPDATE kfz 
       SET kilometerStand = ?, standortMietstationID = ? 
       WHERE kfzID = ?`,
      [kmNew, data.abgabestationID, data.kfzID]
    );

    const pdfDir = path.join(__dirname, "../../pdfs/protokolle");
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });
    const filePath = path.join(pdfDir, `rueckgabe-${ruecknahmeID}.pdf`);

    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc
      .fontSize(20)
      .text("Fahrzeug-Rücknahmeprotokoll", { align: "center" })
      .moveDown(1);

    doc
      .fontSize(12)
      .text(`Datum: ${protokollDatum}`, 50, doc.y)
      .text(`Erstellt von: ${mitarbeiter}`, 50)
      .moveDown(1);

    doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor("#cccccc").stroke().moveDown(1);

    // Fahrzeugdaten
    doc.fontSize(14).text("Fahrzeugdaten", { underline: true }).moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Marke/Modell: ${data.marke} ${data.modell}`);
    doc.text(`Getriebe: ${data.getriebe}`);
    const gefahreneKilometer = kmNew - data.kmAlt;
    doc.text(`Gefahrene Kilometer: ${gefahreneKilometer} km`).moveDown(1);

    // Fahrzeugzustand
    const zusatz = data.zusaetze || "";
    let tankGebuehr = Math.round(((1 - tank) * 150),2);
    if(zusatz.includes("tankservice")) {
      tankGebuehr = 0; // Keine Kosten für nicht vollen Tank
    }
    let schadenkosten = data.tarifPreis;
    if(zusatz.includes("vollkaskoversicherung")) {
      schadenkosten = 0; // Keine Kosten für Schaden wegen Versicherung
    }
    doc.fontSize(14).text("Fahrzeugzustand", { underline: true }).moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Tankstand: ${Math.round(tank * 100)}%`);
    doc.text(`Kosten für Tankfüllung: ` + tankGebuehr.toFixed(2) + ` €`);
    doc.text(`Sauberkeit: ${sauberkeit}`);
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

      await new Promise((resolve) => {
          writeStream.on("finish", resolve);
          doc.end();
      });

    res.status(201).json({
      message: "Protokoll gespeichert & PDF erstellt",
      protokollID: ruecknahmeID,
        rechnungsID: rID,
      pdfPath: `/pdfs/protokolle/rueckgabe-${ruecknahmeID}.pdf`
    });
  } catch (err) {
    console.error("❌ Fehler beim Speichern oder PDF-Erstellen:", err);
    res.status(500).json({ error: "Fehler beim Speichern oder PDF-Erstellen" });
  }
});

export default router;
