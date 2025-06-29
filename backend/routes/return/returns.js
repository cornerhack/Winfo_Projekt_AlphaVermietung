import express from 'express';
import connection from '../../db.js';

const router = express.Router();

router.get('/station', async (req, res) => {
  const stationID = req.query.stationID;
  const ort = await getStation(stationID);
  res.json({name: ort});
});

export async function getStation(id){
  try {
    const [rows] = await connection.promise().execute(
        `SELECT mietstationID, ort, plz, strasse, hausNr, land
       FROM mietstationen
       WHERE mietstationID = ?`,
        [id]
    );

    if (rows.length === 0) {
      return null;
    }

    const station = rows[0];
    const adresse = `${station.strasse} ${station.hausNr}, ${station.plz} ${station.ort}, ${station.land}`;
    return adresse;
  } catch (error) {
    console.error('Fehler beim Abrufen der Station:', error);
    return null;
  }
}

router.get('/stationen', async (req, res) => {
  const query = req.query.query;

  try {
    const [rows] = await connection.promise().execute(
      `SELECT mietstationID, ort, plz, strasse, hausNr, land
       FROM mietstationen
       WHERE ort LIKE ?
          OR plz like ?
       ORDER BY ort
       LIMIT 3`,
      [`${query}%`, `${query}%`]
    );

    // Optional: Name für Frontend zusammenbauen
    const results = rows.map(row => ({
      id: row.mietstationID,
      name: `${row.strasse} ${row.hausNr}, ${row.plz} ${row.ort}, ${row.land}`
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
    const [autos] = await connection.promise().execute(
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

  try {
    const fahrzeug = await getFahrzeug(kfzID);

    if (!fahrzeug) {
      return res.status(404).json({ error: 'Fahrzeug nicht gefunden' });
    }

    res.json(fahrzeug);
  } catch (error) {
    console.error('Fehler beim Abrufen des Fahrzeugs:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

router.get('/bessereFahrzeuge', async (req, res) => {
  const { kfzID } = req.query;
  const fahrzeug = await getFahrzeug(kfzID);
  let [autos] = await connection.promise().query(`
      SELECT k.*, t.typBezeichnung FROM kfz k
               JOIN kfztypen t on k.kfzTypID = t.kfzTypID
               WHERE k.getriebe = ? AND k.anzahlSitze >= ? AND k.anzahlTueren >= ? AND k.kfzTypID = ? 
                                    AND k.kfzPreisKategorieID >= ? AND k.standortMietstationID = ?
                                    AND k.kfzID != ?
  `, [fahrzeug.getriebe, fahrzeug.anzahlSitze, fahrzeug.anzahlTueren, fahrzeug.kfzTypID,
    fahrzeug.kfzPreisKategorieID, fahrzeug.standortMietstationID, fahrzeug.kfzID]);

  if(autos.length === 0)
    [autos] = await connection.promise().query(`
            SELECT k.*, t.typBezeichnung FROM kfz k JOIN kfztypen t on K.kfzTypID = t.kfzTypID
                WHERE k.kfzTypID = ? AND k.kfzPreisKategorieID >= ? AND k.standortMietstationID = ?
                  AND k.kfzID != ? `, [fahrzeug.kfzTypID, fahrzeug.kfzPreisKategorieID, fahrzeug.standortMietstationID, fahrzeug.kfzID]);
  if(autos.length === 0)
    [autos] = await connection.promise().query(`
            SELECT k.*, t.typBezeichnung FROM kfz k JOIN kfztypen t on K.kfzTypID = t.kfzTypID
                WHERE k.kfzTypID = ? AND k.standortMietstationID = ?
                  AND k.kfzID != ? `, [fahrzeug.kfzTypID, fahrzeug.standortMietstationID, fahrzeug.kfzID]);
  if(autos.length === 0)
    [autos] = await connection.promise().query(`
            SELECT k.*, t.typBezeichnung FROM kfz k JOIN kfztypen t on K.kfzTypID = t.kfzTypID
                WHERE k.standortMietstationID = ? AND k.kfzID != ? `,
            [fahrzeug.standortMietstationID, fahrzeug.kfzID]);
  res.json(autos);
});

async function getFahrzeug(kfzID) {
  try {
    const [rows] = await connection.promise().execute(
        `SELECT * FROM kfz 
      JOIN kfztypen t ON kfz.kfzTypID = t.kfzTypID
      JOIN kfzPreisKategorie p ON kfz.kfzPreisKategorieID = p.kfzPreisKategorieID
      JOIN tarife ta ON t.tarifID = ta.tarifID
      WHERE kfzID = ?`,
        [kfzID]
    );

    if (rows.length === 0) {
      return null; // Fahrzeug nicht gefunden
    }

    return rows[0]; // Erfolg
  } catch (err) {
    throw err; // Fehler weiterreichen
  }
}

router.get('/alleReservierungen', async (req, res) => {
  const [results] = await connection.promise().query(`
    SELECT r.*, 
           k.marke, 
           k.modell,
           k.getriebe,
           k.kilometerStand,
           ku.vorname,
           ku.nachname,
           t.typBezeichnung
    FROM reservierungen r
    JOIN kfz k ON r.kfzID = k.kfzID
    JOIN kunden ku ON r.kundeID = ku.kundeID
    JOIN kfztypen t ON k.kfzTypID = t.kfzTypID
    ORDER BY r.mietbeginn`);
  res.json(results);
});

router.get('/meineReservierungen', async (req, res) => {
  const kundeID = req.session.user?.id;

  if (!kundeID) return res.status(401).json({ error: 'Nicht eingeloggt' });

  const [results] = await connection.promise().query(`
    SELECT r.*, 
           k.marke, 
           k.modell,
           CONCAT_WS(' ', abhol.strasse, abhol.hausNr, abhol.plz, abhol.ort) AS abholort,
           CONCAT_WS(' ', abgabe.strasse, abgabe.hausNr, abgabe.plz, abgabe.ort) AS abgabeort
    FROM reservierungen r
    JOIN kfz k ON r.kfzID = k.kfzID
    JOIN mietstationen abhol ON r.abholstationID = abhol.mietstationID
    JOIN mietstationen abgabe ON r.abgabestationID = abgabe.mietstationID
    WHERE r.kundeID = ?
    ORDER BY r.mietbeginn ASC
  `, [kundeID]);

  res.json(results);
});

router.post('/stornieren/:id', async (req, res) => {
  const { id } = req.params;
  const kundeID = req.session.user?.id;

  // Sicherheitscheck
  const [rows] = await connection.promise().query(
      'SELECT * FROM reservierungen WHERE reservierungID = ? AND kundeID = ?',
      [id, kundeID]
  );

  if (rows.length === 0) return res.status(403).json({ error: 'Keine Berechtigung' });

  await connection.promise().query(
      'UPDATE reservierungen SET status = ? WHERE reservierungID = ?',
      [ "storniert", id]
  );
  res.status(200).json({ message: 'Reservierung storniert' });
});

router.get('/reservierung/:id', async (req, res) => {
  const [rows] = await connection.promise().query('SELECT * FROM reservierungen WHERE reservierungID = ?', [req.params.id]);
  res.json(rows[0]);
});

router.put('/reservierungen/:id', async (req, res) => {
  const { zusaetze, gesamtbetrag } = req.body;
  await connection.promise().query('UPDATE reservierungen SET zusaetze = ?, gesamtbetrag = ? WHERE reservierungID = ?', [zusaetze, gesamtbetrag, req.params.id]);
  res.sendStatus(200);
});

router.put('/reservierungen/autoWechseln/:id', async (req, res) =>{
  const { kfzID } = req.body;
  await connection.promise().query('UPDATE reservierungen SET kfzID = ? WHERE reservierungID = ?', [kfzID, req.params.id]);
  res.sendStatus(200);
});

router.get('/kunde/:id', async (req, res) => {
  const [rows] = await connection.promise().query('SELECT * FROM kunden WHERE kundeID = ?', [req.params.id]);
  res.json(rows[0]);
});

router.put('/updateKundeReservierung/:id', async (req, res) => {
  const { vorname, nachname, mail, str, nr, plz, ort, land, tel } = req.body;

  await connection.promise().query(
      `UPDATE kunden
       SET vorname = ?, nachname = ?, emailAdresse = ?,
           strasse = ?, hausNr = ?, plz = ?, ort = ?, land = ?, telefonNr = ?
       WHERE kundeID = ?`,
      [vorname, nachname, mail, str, nr, plz, ort, land, tel, req.params.id]
  );

  res.json({ success: true, message: 'Kundendaten aktualisiert' });
});

export default router;
