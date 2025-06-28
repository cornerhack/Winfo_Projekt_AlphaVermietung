import connection from "../db.js";

export async function gesamtBetrag(){

}

export async function zusaetzeBetrag(zusatz, tage){
        const zusaetzeArray = zusatz.split(",").map(z => z.trim());
        let summe = 0;
        for(const zusatz of zusaetzeArray){
            switch (zusatz.toLowerCase()) {
                case "zusatzfahrer":
                    summe += 5 * tage;
                break;
                case "kindersitz":
                    summe += 3 * tage;
                break;
                case "navigationssystem":
                    summe += 7 * tage;
                break;
                case "vollkaskoversicherung":
                    summe += 15 * tage;
                break;
                case "tankservice":
                    summe += 50;
                default:
                break;
            } 
        }
        return summe;
}

export async function getMiettage(reservierungID) {
    try {
        const [rows] = await connection.promise().execute(
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