import express from "express";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { PassThrough } from "stream";
import connection from "../../db.js";
import dayjs from "dayjs";
import {fileURLToPath} from "url";
import {getStation} from "../return/returns.js";
import {mietvertragSchicken} from "../mailer/mailverteiler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

router.post("/mietvertrag/:resID", async (req, res) => {
    const { resID } = req.params;
    try {
        const [mietvertrag] = await connection.promise().execute(`
        INSERT INTO mietvertraege (reservierungID) VALUES (?)
        `, [resID]);
        const [infos] = await connection.promise().execute(`
            SELECT r.*, k.*, kfz.*, typ.typBezeichnung, p.kategorieBezeichnung from reservierungen r 
                JOIN kunden k on r.kundeID = k.kundeID
                join kfz on r.kfzID = kfz.kfzID
                join kfztypen typ on kfz.kfzTypID = typ.kfzTypID
                join kfzpreiskategorie p on kfz.kfzPreisKategorieID = p.kfzPreisKategorieID
                where reservierungID = ?
        `, [resID]);
        if (infos.length === 0) {
            return res.status(404).send("Infos nicht gefunden");
        }
        const info = infos[0];
        const mietvertragID = mietvertrag.insertId;
        const abgabeStation = await getStation(info.abgabestationID);

        const doc = new PDFDocument({ margin: 50 });
        const pdfPath = path.join(__dirname, `../../pdfs/mietvertraege/mietvertrag-${mietvertragID}.pdf`);
        const writeStream = fs.createWriteStream(pdfPath);
        const passthrough = new PassThrough();
        doc.pipe(passthrough);
        doc.pipe(writeStream);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="mietvertrag-${mietvertragID}.pdf"`);

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
        doc.fontSize(16).text("Mietvertrag", 50, doc.y, { align: "center", underline: true }).moveDown();

        // Kundendaten
        doc.fontSize(11).text("Kunde:", { underline: true }).moveDown(0.2)
            .text(`${info.vorname} ${info.nachname}`)
            .text(`${info.strasse} ${info.hausNr}`)
            .text(`${info.plz} ${info.ort}`)
            .text(info.land)
            .moveDown(1.5);
        doc.fontSize(11)
            .text(`Kundennummer: ${info.kundeID}`, 50, doc.y)
            .text(`Mietvertragsnummer: ${mietvertragID}`, 50, doc.y)
            .text(`Datum: ${dayjs(new Date()).format("DD.MM.YYYY")}`, 50)
            .text(`Abgeholt bei: ${req.session.user.name} ${req.session.user.nachname}`)
            .moveDown()
            .moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#cccccc').stroke()
            .moveDown()
            .text(`Abgabe am ${dayjs(info.mietbeginn).format("DD.MM.YYYY")} in ${abgabeStation}`)
            .moveDown()
            .moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#cccccc').stroke()
            .moveDown(2);
        // Reservierungsdetails
        const labelX = 60;
        const valueX = 280;
        let y = doc.y;
        let tankoption;
        let zusatz = info.zusaetze;
        if(zusatz.includes('Tankservice'))
            tankoption = "Tank kann leer sein";
        else
            tankoption = "Tank muss voll sein";

        const table = [
            ["Fahrzeug:", `${info.marke} ${info.modell}`],
            ["Typ:", `${info.typBezeichnung}, ${info.getriebe}`],
            ["Kilometerstand bei Abholung:", `${info.kilometerStand} km`],
            ["Tankfüllung: voll", `Bei Abgabe: ${tankoption}`],
            ["Zusatzoptionen:", info.zusaetze || "Keine"],
            ["Gesamtbetrag:", `${parseFloat(info.gesamtbetrag).toFixed(2)} €`]
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

        doc.moveDown(2).fontSize(10).text("Wir wünschen eine schöne Fahrt!", 50, doc.y, { align: "center" });
        await new Promise((resolve) => {
            writeStream.on("finish", resolve);
            doc.end();
        });
        await mietvertragSchicken(info.vorname, info.email, mietvertragID);
        res.json({mietvertragID});
    } catch (err) {
        console.error("PDF-Erzeugung fehlgeschlagen:", err);
        res.status(500).send("Interner Serverfehler");
    }
});
export default router;