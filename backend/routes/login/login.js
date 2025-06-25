import { connection } from '../../db.js';
import bcrypt from 'bcrypt';
import express from 'express';
const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    connection.query('SELECT * FROM kunden WHERE emailAdresse = ?', [email], async (error, results) => {
        if (error) 
            return res.status(500).json({ error: 'Internal server error' });
        let user;
        let id;
        if (results.length === 0) {
            user = await searchEmployer(email);
            id = user.mitarbeiterID;
        }if(user === null)
                return res.status(401).json({ error: 'Invalid email or password' });
        else{
            user = results[0];
            id = user.kundeID;
        }

        try {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch){
                req.session.user = {
                                    id: id,
                                    name: user.vorname,
                                    email: user.email
                                    };
                return res.status(200).json({ message: 'Login successful', userId: id });
            }
            else
                return res.status(401).json({ error: 'Invalid email or password' });
            
        } catch (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
});

async function searchEmployer(email) {
    connection.query('SELECT * FROM mitarbeiter WHERE emailAdresse = ?', [email], async (error, results) => {
        if (error || results.length === 0)
            return null;
        
        return results[0];
    });
}

router.post('/register', async (req, res) => {
    const {companyName, vorname, nachname, email, password } = req.body;
    if (companyName === '')
        companyName = null;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        connection.query('INSERT INTO kunden (firmaName, vorname, nachname, emailAdresse, password) VALUES (?, ?, ?, ?, ?)', 
            [companyName, vorname, nachname, email, hashedPassword], (error, results) => {
            if (error) 
                return res.status(500).json({ error: 'Internal server error' });

            const id = results.insertId;
            req.session.user = {
                                    id: id,
                                    name: vorname,
                                    email: email
                                    };
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

export default router;
