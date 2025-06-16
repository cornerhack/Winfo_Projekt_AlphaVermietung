import bcrypt from 'bcrypt'; // richtig geschrieben

// Asynchrone Funktion zum Hashen
export async function encryptPassword(password) {
  try {
    const hash = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hash);
    return hash;
  } catch (err) {
    console.error('Error hashing password:', err);
    throw err;
  }
}

// Asynchrone Funktion zum Vergleichen
export async function comparePasswords(password, hashedPassword) {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    console.log('Password match:', match);
    return match;
  } catch (err) {
    console.error('Error comparing passwords:', err);
    throw err;
  }
}