import { connection } from "../../db.js";
import { encryptPassword, comparePasswords } from "./passwordCypher.js";

async function test() {
    try {
        
        // Test password encryption
        const email = 'lena.schneider@firma.de';
        const password = 'passwort123';
        const hashedPassword = await encryptPassword(password);

        /*connection.query('update mitarbeiter set password = ? where emailAdresse = ?', [hashedPassword, email], (error, results) => {
            if (error) {
                console.error('Database update error:', error);
                return;
            }
            console.log('Password updated successfully:', results);
        });*/
        connection.query('select * from mitarbeiter where emailAdresse = ?', [email], async (error, results) => {
            if (error) {
                console.error('Database query error:', error);
                return;
            }
            if (results.length === 0) {
                console.log('No user found with the given email.');
                return;
            }
            const user = results[0];
            console.log('User found:', user);

            // Test password comparison
            const isMatch = await comparePasswords(password, user.password);
            console.log('Password match:', isMatch ? 'Success' : 'Failure');
        });
        
    } catch (error) {
        console.error('Error during test execution:', error);
    }
}