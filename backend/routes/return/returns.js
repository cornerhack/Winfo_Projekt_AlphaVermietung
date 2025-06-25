import express from 'express';
import { connection } from '../../db.js';
import { zusaetzeBetrag } from '../../berechnungen/calculate.js';

const router = express.Router();

router.get('/station', async (req, res) => {
  const stationID = req.query.stationID;
  if (!stationID) {
    return res.status(400).json({ error: 'stationID ist erforderlich' });
  }
  try {
    const [rows] = await connection.execute(
      `SELECT mietstationID, ort, plz, strasse, hausNr, land
       FROM mietstationen
       WHERE mietstationID = ?`,
      [stationID]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Mietstation nicht gefunden' });
    }

    const station = rows[0];
    res.json({
      id: station.mietstationID,
      name: `${station.ort}, ${station.strasse} ${station.hausNr}, ${station.plz} ${station.land}`
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Station:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

router.get('/stationen', async (req, res) => {
  const query = req.query.query;

  if (!query || query.length < 2) {
    return res.status(400).json({ error: 'Query muss mindestens 2 Zeichen enthalten.' });
  }

  try {
    const [rows] = await connection.execute(
      `SELECT mietstationID, ort, plz, strasse, hausNr, land
       FROM mietstationen
       WHERE ort LIKE ? 
       ORDER BY ort ASC
       LIMIT 3`,
      [`%${query}%`]
    );

    // Optional: Name für Frontend zusammenbauen
    const results = rows.map(row => ({
      id: row.mietstationID,
      name: `${row.ort}, ${row.strasse} ${row.hausNr}, ${row.plz} ${row.land}`
    }));

    res.json(results);
  } catch (error) {
    console.error('Fehler beim Abrufen der Stationen:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }   
});

router.get('/verfuegbare-autos', async (req, res) => {
  const { stationID, von, bis } = req.query;

  if (!stationID || !von || !bis) {
    return res.status(400).json({ error: 'stationID, von und bis sind erforderlich' });
  }

  try {
    const [autos] = await connection.execute(
      `SELECT * FROM kfz k
      JOIN kfztypen t ON k.kfzTypID = t.kfzTypID
      JOIN kfzPreisKategorie p ON k.kfzPreisKategorieID = p.kfzPreisKategorieID
      JOIN tarife ta ON t.tarifID = ta.tarifID
       WHERE standortMietstationID = ?
       AND kfzID NOT IN (
         SELECT kfzID
         FROM reservierungen
         WHERE
           (status = 'bestätigt' OR status = 'aktiv')
           AND (
             (? BETWEEN mietbeginn AND mietende)
             OR (? BETWEEN mietbeginn AND mietende)
             OR (mietbeginn BETWEEN ? AND ?)
             OR (mietende BETWEEN ? AND ?)
           )
       )`,
      [stationID, von, bis, von, bis, von, bis]
    );

    res.json(autos);
  } catch (error) {
    console.error('Fehler beim Abrufen verfügbarer Autos:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

router.get('/fahrzeug', async (req, res) => {
  const kfzID = req.query.kfzID;

  if (!kfzID) {
    return res.status(400).json({ error: 'kfzID ist erforderlich' });
  }

  try {
    const [rows] = await connection.execute(
      `SELECT * FROM kfz 
      JOIN kfztypen t ON kfz.kfzTypID = t.kfzTypID
      JOIN kfzPreisKategorie p ON kfz.kfzPreisKategorieID = p.kfzPreisKategorieID
      JOIN tarife ta ON t.tarifID = ta.tarifID
      WHERE kfzID = ?`,
      [kfzID]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Fahrzeug nicht gefunden' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Fehler beim Abrufen des Fahrzeugs:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

export default router;
