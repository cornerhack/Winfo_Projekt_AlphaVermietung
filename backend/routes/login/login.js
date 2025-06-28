import connection from '../../db.js';
import bcrypt from 'bcrypt';
import express from 'express';
const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const [users] = await connection.promise().query('SELECT * FROM kunden WHERE emailAdresse = ?', [email]);
    let user;
    let id;
    let person;
    if (users.length === 0){
        const [employer] = await connection.promise().query('SELECT * FROM mitarbeiter WHERE emailAdresse = ?', [email]);
        if(employer.length === 0)
            return res.status(401).json({ error: 'Email ist nicht registriert!' });
        user = employer[0];
        id = user.mitarbeiterID;
        person = "mitarbeiter";
    }else{
        user = users[0];
        id = user.kundeID;
        person = "kunde";
    }
    try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch){
            req.session.user = {
                id: id,
                name: user.vorname,
                email: user.email,
                person: person
            };
            return res.status(200).json({ message: 'Login successful', person: person });
        }
        return res.status(401).json({ error: 'Das Passwort ist falsch!' });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/register', async (req, res) => {
    const { vorname, nachname, email, password } = req.body;
    let companyName = req.body;
    if (companyName === '')
        companyName = null;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        connection.promise().query('INSERT INTO kunden (firmaName, vorname, nachname, emailAdresse, password) VALUES (?, ?, ?, ?, ?)',
            [companyName, vorname, nachname, email, hashedPassword], (error, results) => {
            if (error) 
                return res.status(500).json({ error: 'Internal server error' });

            const id = results.insertId;
            req.session.user = {
                                    id: id,
                                    name: vorname,
                                    email: email,
                                    person: "kunde"};
            return res.status(201).json({ message: 'Registration successful', userId: id });
        });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ success: false, error: 'Logout fehlgeschlagen' });
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

router.get('/istGesperrt', async (req, res)=> {
    const email = req.query.email;
    const [users] = await connection.promise().query('SELECT * FROM kunden WHERE emailAdresse = ?', [email]);
    if (users.length === 0){
        const [employer] = await connection.promise().query('SELECT * FROM mitarbeiter WHERE emailAdresse = ?', [email]);
        if(employer.length === 0)
            return res.status(401).json({ error: 'Email ist nicht registriert!' });
        return res.json(employer[0].gesperrt);
    }
    return res.json(users[0].gesperrt);
})

router.post('/sperren', async (req, res) => {
    const {email} = req.body;
    const [info] =  await connection.promise().query('update kunden set gesperrt = true where emailAdresse = ?', [email]);

    if(info.affectedRows === 0){
        await connection.promise().query('update mitarbeiter set gesperrt = true where emailAdresse = ?', [email]);
    }
});

router.post('/reset', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ error: 'E-Mail und Passwort erforderlich' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await connection
            .promise()
            .query('UPDATE kunden SET password = ? WHERE emailAdresse = ?', [hashedPassword, email]);

        // email ist nicht von einem Kunden
        if (result.affectedRows === 0) {
            const [results] = await connection
                .promise()
                .query('UPDATE mitarbeiter SET password = ?, gesperrt = false WHERE emailAdresse = ?', [hashedPassword, email]);
            if(results.affectedRows === 0){
                return res.status(404).json({ error: 'E-Mail nicht gefunden' });
            }
        }
        return res.status(200).json({ message: 'Passwort erfolgreich zurückgesetzt' });
    } catch (err) {
        console.error('Fehler beim Passwort-Reset:', err);
        return res.status(500).json({ error: 'Interner Serverfehler' });
    }
});
export default router;
