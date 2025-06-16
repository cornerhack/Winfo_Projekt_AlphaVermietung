import { connection } from '../../db.js';
import { encryptPassword, comparePasswords } from './passwordCypher.js';
import express from 'express';
const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    connection.query('SELECT * FROM kunden WHERE emailAdresse = ?', [email], async (error, results) => {
        if (error) 
            return res.status(500).json({ error: 'Internal server error' });
        
        let user;
        if (results.length === 0)
            user = await searchEmployer(email);
            if(user === null)
                return res.status(401).json({ error: 'Invalid email or password' });
        else
            user = results[0];

        try {
            const isMatch = await comparePasswords(password, user.password);
            if (isMatch)
                return res.status(200).json({ message: 'Login successful', userId: user.id });
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
        const hashedPassword = await encryptPassword(password);
        connection.query('INSERT INTO kunden (firmaName, vorname, nachname, emailAdresse, password) VALUES (?, ?, ?, ?, ?)', 
            [companyName, vorname, nachname, email, hashedPassword], (error, results) => {
            if (error) 
                return res.status(500).json({ error: 'Internal server error' });
            
            return res.status(201).json({ message: 'Registration successful', userId: results.insertId });
        });
        return;
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
