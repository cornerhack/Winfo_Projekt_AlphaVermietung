import express from "express";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { PassThrough } from "stream";
import connection from "../../db.js";
import dayjs from "dayjs";
import {fileURLToPath} from "url";
import {getStation} from "../return/returns.js";
import {reservierungSchicken} from "../mailer/mailverteiler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

router.post("/bestaetigung", async (req, res) => {
    const { kfzID, von, bis, abholStationID, abgabeStationID, tage, zusatz, gesamtbetrag, kundeID } = req.body;

    const abholStation = await getStation(abholStationID);
    const abgabeStation = await getStation(abgabeStationID);

    try {
        const [reservierung] = await connection.promise().execute(`
        INSERT INTO reservierungen (kundeID, kfzID, abholstationID, abgabestationID,
                                    mietbeginn, mietende, zusaetze, gesamtbetrag)VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [kundeID, kfzID, abholStationID, abgabeStationID, von, bis, zusatz, gesamtbetrag]);

        const [kunden] = await connection.promise().execute(`
            SELECT * from kunden WHERE kundeID = ?
        `, [kundeID]);

        const [rows] = await connection.promise().execute(`
            SELECT kfz.*, t.typBezeichnung, p.kategorieBezeichnung, p.zuschlag
            FROM kfz
            JOIN kfztypen t ON kfz.kfzTypID = t.kfzTypID
            JOIN kfzPreiskategorie p ON kfz.kfzPreiskategorieID = p.kfzPreiskategorieID
            WHERE kfz.kfzID = ?
        `, [kfzID]);

        if (rows.length === 0) {
            return res.status(404).send("Fahrzeug nicht gefunden");
        }

        const fahrzeug = rows[0];
        const kunde = kunden[0];
        const reservierungsID = reservierung.insertId;

        const doc = new PDFDocument({ margin: 50 });
        const pdfPath = path.join(__dirname, `../../pdfs/reservierungen/reservierung-${reservierungsID}.pdf`);
        const writeStream = fs.createWriteStream(pdfPath);

        const passthrough = new PassThrough();
        doc.pipe(passthrough);
        doc.pipe(writeStream);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="bestaetigung-${kfzID}.pdf"`);

        // Logo

        const logoPath = path.join(__dirname, "../../../frontend/logo.jpg");
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 50, 45, { width: 120 });
        }

        // Firmeninfos
        doc
            .fontSize(14)
            .text("Autovermietung Alpha GmbH", 300, 50, { align: "right" })
            .fontSize(10)
            .text("Musterstraße 1", { align: "right" })
            .text("12345 Berlin", { align: "right" })
            .text("autovermietungalpha@gmail.com", { align: "right" });

        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#cccccc').stroke();
        doc.moveDown(2);

        // Titel
        doc.fontSize(16).text("Reservierungsbestätigung", 50, doc.y, { align: "center", underline: true }).moveDown();

        // Kundendaten
        doc.fontSize(11).text("Kunde:", { underline: true }).moveDown(0.2)
                .text(`${kunde.vorname} ${kunde.nachname}`)
                .text(`${kunde.strasse} ${kunde.hausNr}`)
                .text(`${kunde.plz} ${kunde.ort}`)
                .text(kunde.land)
                .moveDown(1.5);

        doc.fontSize(11)
            .text(`Kundennummer: ${kundeID}`, 50, doc.y)
            .text(`Reservierungsnummer: ${reservierungsID}`, 50, doc.y)
            .text(`Reservierungsdatum: ${dayjs(new Date()).format("DD.MM.YYYY")}`, 50)
            .moveDown()
            .moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#cccccc').stroke()
            .moveDown()
            .text(`Reserviert vom ${dayjs(von).format("DD.MM.YYYY")} bis zum ${dayjs(bis).format("DD.MM.YYYY")}`)
            .text(`Abholstation: ${abholStation}`)
            .text(`Abgabestation: ${abgabeStation}`)
            .moveDown()
            .moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#cccccc').stroke()
            .moveDown(2);

        // Reservierungsdetails
        const labelX = 60;
        const valueX = 280;
        let y = doc.y;

        const table = [
            ["Fahrzeug:", `${fahrzeug.marke} ${fahrzeug.modell}`],
            ["Typ:", `${fahrzeug.typBezeichnung}, ${fahrzeug.getriebe}`],
            ["Kilometerstand:", `${fahrzeug.kilometerStand} km`],
            ["Türen / Sitze:", `${fahrzeug.anzahlTueren} Türen, ${fahrzeug.anzahlSitze} Sitze`],
            ["Preiskategorie:", fahrzeug.kategorieBezeichnung],
            ["Mietdauer:", `${tage} Tage`],
            ["Zusatzoptionen:", zusatz || "Keine"],
            ["Gesamtbetrag:", `${parseFloat(gesamtbetrag).toFixed(2)} €`]
        ];

        doc.fontSize(12);
        for (const [label, value] of table) {
            const isZusatz = label.startsWith("Zusatz");

            doc.text(label, labelX, y);
            if (isZusatz) {
                doc.text(value, valueX, y, {
                    width: 250,  // schmaler, damit Umbruch möglich
                    lineBreak: true
                });
                // Erhöhe y um den tatsächlichen Zeilenverbrauch
                const lines = doc.heightOfString(value, { width: 250 }) / doc.currentLineHeight();
                y += lines * doc.currentLineHeight()+5;
            } else {
                doc.text(value, valueX, y);
                y += 20;
            }
        }

        doc.moveDown(2).fontSize(10).text("Vielen Dank für Ihre Reservierung!", 50, doc.y, { align: "center" });
        await new Promise((resolve) => {
            writeStream.on("finish", resolve);
            doc.end();
        });
        await reservierungSchicken(kunde.vorname, kunde.email, reservierungsID);
        res.json({reservierungsID});
    } catch (err) {
        console.error("PDF-Erzeugung fehlgeschlagen:", err);
        res.status(500).send("Interner Serverfehler");
    }
});
export default router;