import connection from "../../db.js";
import bcrypt from 'bcrypt';

async function test() {
    try {
        
        // Test password encryption
        const email = 'anna.schmidt@email.de';
        const password = 'pw1234';
        const hashedPassword = await bcrypt.hash(password, 10);

        await connection.promise().query('update kunden set password = ? where emailAdresse = ?', [hashedPassword, email], (error, results) => {
            if (error) {
                console.error('Database update error:', error);
                return;
            }
            console.log('Password updated successfully:', results);
        });
        /*connection.promise().query('select * from mitarbeiter where emailAdresse = ?', [email], async (error, results) => {
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
            const isMatch = await bcrypt.compare(password, user.password);
            console.log('Password match:', isMatch ? 'Success' : 'Failure');
        });*/
        return true;
    } catch (error) {
        console.error('Error during test execution:', error);
    }
}
test();