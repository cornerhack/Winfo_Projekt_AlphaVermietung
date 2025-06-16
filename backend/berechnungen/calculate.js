import { connection } from "../db.js";

export async function gesamtBetrag(){

}

export async function zusaetzeBetrag(reservierungID){
    try {
        const [rows] = await connection.execute(
            `SELECT zusaetze FROM reservierungen WHERE reservierungID = ?`,
            [reservierungID]
        );
        const anzahlMietTage = await getMiettage(reservierungID);
        const data = rows[0];
        const zusaetzeString = data.zusaetze || "";
        const zusaetzeArray = zusaetzeString.split(",").map(z => z.trim());
        let summe = 0;
        for(const zusatz of zusaetzeArray){
            switch (zusatz.toLowerCase()) {
                case "zusatzfahrer":
                    summe += 5 * anzahlMietTage;
                break;
                case "kindersitz":
                    summe += 3 * anzahlMietTage;
                break;
                case "navigationssystem":
                    summe += 7 * anzahlMietTage;
                break;
                case "versicherung":
                    summe += 15 * anzahlMietTage;
                break;
                case "tankservice":
                    summe += 20;
                default:
                break;
            } 
        }
        
        return summe;
    } catch (error) {
        console.error("Fehler beim Abrufen der Zusatzleistungen:", error);
        throw error;
    }

}

export async function getMiettage(reservierungID) {
    try {
        const [rows] = await connection.execute(
            `SELECT DATE_FORMAT(mietbeginn, '%Y-%m-%d') AS mietbeginn, DATE_FORMAT(mietende, '%Y-%m-%d') AS mietende FROM reservierungen WHERE reservierungID = ?`,
            [reservierungID]
        );
        const data = rows[0];
        const ONE_DAY = 1000 * 60 * 60 * 24;
        if (!data) {
            throw new Error("Reservierung nicht gefunden");
        }
        const mietbeginn = new Date(data.mietbeginn);
        const mietende = new Date(data.mietende);
        return Math.round(Math.abs(mietbeginn - mietende) / ONE_DAY);
    } catch (error) {
        console.error("Fehler beim Abrufen der Miettage:", error);
        throw error;
    }
}