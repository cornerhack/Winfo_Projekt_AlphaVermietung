# Projekt: Autovermietung – IT-Projektmanagement

Einleitung

Dieses Repository befasst sich mit der Entwicklung eines Teil der Webseite Autovermietung. Das Team Alpha liefert folgede features des Mietvorgangs Durchführung:

Anmeld- und Regestrierung System
Auto reservieren
Rückgabe Auto
Rechnung erstellen
Mahnwesen




## Dokumentation

### Auftrag & Planung




### Protokolle & Management

-  [Logbuch](https://docs.google.com/document/d/15GF09IdG36DPjd5Ey-WlCfoReXItvEM57o2ZZX0Mteg/edit?tab=t.0)
-  [Trello-Board](https://trello.com/b/CYIHeRmJ/projekt-winfo)
-  [Notion](https://www.notion.so/1e34e604205c801d94f7c184fe4f0516?v=1e34e604205c80c5aea2000c2aa540ee&pvs=4)
-  [Risikoanalyse](https://studmailwhsde-my.sharepoint.com/:x:/g/personal/christian_bovenkerk_studmail_w-hs_de/Ef4IGk3yBQ1AsfAwFbJBFIoBGsacE02Pet3x9OrwZ42Vlw?e=nMhZBb)
-  [Risikobericht](https://docs.google.com/document/d/1aQ7xzmw-nVU49Y2d1ZLfgAWBjlHhHwL-N-RTNltqIIw/edit?usp=sharing)
-  [Kostenreporting](https://docs.google.com/spreadsheets/d/15wFkdG4pU2KYF6CzObLUC2lXlmhkhckMKj3ChtuShh4/edit?usp=sharing)
-  [Testfälle](https://link-zu-google-docs) !
- [Dokumentation zur Nutzung von KI-Tools](https://docs.google.com/document/d/1BlBkyYJo1Rm-une-ZAagnk6kbSxjRWtJBkPg1wGcEQk/edit?usp=sharing)
- [PowerPoint](https://studmailwhsde-my.sharepoint.com/:p:/g/personal/christian_bovenkerk_studmail_w-hs_de/ESmR_gwzN6ZGj34TgTvTuNQBOStJU7Qnq3pe6cw3alRs1w?e=eL8NsG)

  

---

## Design & Planung

-  [Gantt-Diagramm](https://docs.google.com/spreadsheets/d/1A8mtONvlZpncYvhavonJjvMApBQZnYpaMX9P6lQrQKU/edit?usp=sharing) 
-  [Anwendungsfalldiagramme/Sequenzdiagramme](https://docs.google.com/spreadsheets/d/1ZSPXvMbbACY-XNdplNhNhYPcBcWHUS9d6ika1TpZjXg/edit?usp=sharing)

---

## Webanwendung

- Zugangsdaten zur Anwendung:
  - Mitarbeiter **email:** `lena.schneider@firma.de` / **Passwort:** `passwort123`
  - Kunde **User:** `anna.schmidt@email.de` / **Passwort:** `pw1234`

 Als erstes implementiert man die autovermietung_mit_testdaten.sql in einer Datenbank nach Wahl. Bei diesem Projekt wurde MySQL mit Hilfe von MySQL Workbench benutzt.
 Um den Server zu starten muss man in das Terminal mit dem Befehl "cd" im richtigen Pfad gehen: das Ende sollte der Pfad so aussehen: .../Winfo_Projekt_AlphaVermietung/backend/
 Da die Nutzer in der Datenbank nicht gehashed sind und das Passwort nicht übereinstimmt, muss man in der test.js Datei die Daten angeben und die nutzer hashen. Dabei muss man beachten, ob es ein Kunde oder Mitarbeiter ist.
 Die test.js öffnet man über node /routes/login/test.js wenn man im oben genannten Ordner ist.
 Den server startet man über node server.js und dann kann man im Browser über localhost:3000 auf den Server zugreifen.

---

## Teamkontakte

- **Roy Ahmad**
  - [roy.ahmad@studmail.w-hs.de](mailto:roy.ahmad@studmail.w-hs.de)

- **Christian Bovenkerk**
  - [christian.bovenkerk@studmail.w-hs.de](mailto:christian.bovenkerk@studmail.w-hs.de)

- **Mohammed Belamallem**
  - [mohammed.belamallem@studmail.w-hs.de](mailto:mohammed.belamallem@studmail.w-hs.de)
    
- **Luca Remie**
  - [luca.remie@studmail.w-hs.de](mailto:luca.remie@studmail.w-hs.de)
---


