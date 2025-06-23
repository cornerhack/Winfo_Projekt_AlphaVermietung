import express from 'express';
import { connection } from '../../db.js';

const router = express.Router();
// Beispiel: Express Route für Mietstationen
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
       LIMIT 10`,
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


export default router;
