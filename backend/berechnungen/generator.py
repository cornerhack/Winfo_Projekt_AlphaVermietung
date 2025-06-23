import random

# Definierte Fahrzeugmodelle je Typ mit konstanten Daten
fahrzeug_modelle = {
    1: [  # Kleinwagen (20 Modelle)
        ("VW", "Up", "manuell", 3, 4),
        ("Opel", "Corsa", "automatik", 5, 5),
        ("Renault", "Twingo", "manuell", 3, 4),
        ("Hyundai", "i10", "automatik", 5, 5),
        ("Peugeot", "208", "manuell", 5, 5),
        ("Fiat", "Panda", "manuell", 5, 4),
        ("Toyota", "Aygo", "automatik", 5, 4),
        ("Kia", "Picanto", "manuell", 5, 5),
        ("Seat", "Mii", "manuell", 3, 4),
        ("Citroën", "C1", "automatik", 3, 4),
        ("Ford", "Ka+", "manuell", 5, 5),
        ("Chevrolet", "Spark", "manuell", 5, 4),
        ("Skoda", "Citigo", "manuell", 3, 4),
        ("Mitsubishi", "Space Star", "automatik", 5, 5),
        ("Suzuki", "Celerio", "manuell", 5, 5),
        ("Dacia", "Sandero", "manuell", 5, 5),
        ("Nissan", "Micra", "automatik", 5, 5),
        ("Mazda", "2", "manuell", 5, 5),
        ("Honda", "Jazz", "automatik", 5, 5),
        ("Smart", "Forfour", "manuell", 4, 4)
    ],
    2: [  # Kombi (20 Modelle)
        ("VW", "Passat Variant", "automatik", 5, 5),
        ("Ford", "Focus Turnier", "manuell", 5, 5),
        ("Opel", "Astra Sports Tourer", "automatik", 5, 5),
        ("Skoda", "Octavia Combi", "automatik", 5, 5),
        ("BMW", "3er Touring", "automatik", 5, 5),
        ("Mercedes-Benz", "C-Klasse T-Modell", "automatik", 5, 5),
        ("Audi", "A4 Avant", "automatik", 5, 5),
        ("Peugeot", "308 SW", "manuell", 5, 5),
        ("Hyundai", "i30 Kombi", "manuell", 5, 5),
        ("Kia", "Ceed SW", "automatik", 5, 5),
        ("Renault", "Mégane Grandtour", "manuell", 5, 5),
        ("Mazda", "6 Kombi", "automatik", 5, 5),
        ("Volvo", "V60", "automatik", 5, 5),
        ("Toyota", "Corolla Touring Sports", "automatik", 5, 5),
        ("Honda", "Civic Tourer", "manuell", 5, 5),
        ("Dacia", "Logan MCV", "manuell", 5, 5),
        ("Fiat", "Tipo Kombi", "automatik", 5, 5),
        ("Subaru", "Levorg", "automatik", 5, 5),
        ("Seat", "Leon ST", "automatik", 5, 5),
        ("Chevrolet", "Cruze Station Wagon", "manuell", 5, 5)
    ],
    3: [  # Van (5 Modelle)
        ("VW", "Touran", "automatik", 5, 7),
        ("Ford", "S-Max", "automatik", 5, 7),
        ("Opel", "Zafira", "manuell", 5, 7),
        ("Renault", "Espace", "automatik", 5, 7),
        ("Citroën", "Grand C4 SpaceTourer", "automatik", 5, 7)
    ],
    4: [  # Bus (5 Modelle)
        ("Mercedes-Benz", "Sprinter", "manuell", 4, 9),
        ("Ford", "Transit", "manuell", 4, 9),
        ("VW", "Crafter", "automatik", 4, 9),
        ("Peugeot", "Boxer", "manuell", 4, 9),
        ("Renault", "Master", "automatik", 4, 9)
    ],
    5: [  # SUV (20 Modelle)
        ("VW", "Tiguan", "automatik", 5, 5),
        ("BMW", "X1", "automatik", 5, 5),
        ("Audi", "Q3", "automatik", 5, 5),
        ("Mercedes-Benz", "GLA", "automatik", 5, 5),
        ("Hyundai", "Tucson", "automatik", 5, 5),
        ("Kia", "Sportage", "automatik", 5, 5),
        ("Ford", "Kuga", "automatik", 5, 5),
        ("Opel", "Grandland", "automatik", 5, 5),
        ("Renault", "Kadjar", "automatik", 5, 5),
        ("Peugeot", "3008", "automatik", 5, 5),
        ("Dacia", "Duster", "manuell", 5, 5),
        ("Mazda", "CX-5", "automatik", 5, 5),
        ("Toyota", "RAV4", "automatik", 5, 5),
        ("Honda", "CR-V", "automatik", 5, 5),
        ("Skoda", "Karoq", "automatik", 5, 5),
        ("Seat", "Ateca", "automatik", 5, 5),
        ("Nissan", "Qashqai", "automatik", 5, 5),
        ("Subaru", "Forester", "automatik", 5, 5),
        ("Volvo", "XC40", "automatik", 5, 5),
        ("Chevrolet", "Captiva", "manuell", 5, 5)
    ],
    6: [  # Pickup (10 Modelle)
        ("Ford", "Ranger", "manuell", 4, 5),
        ("Toyota", "Hilux", "automatik", 4, 5),
        ("Nissan", "Navara", "manuell", 4, 5),
        ("Mitsubishi", "L200", "manuell", 4, 5),
        ("Isuzu", "D-Max", "manuell", 4, 5),
        ("Volkswagen", "Amarok", "automatik", 4, 5),
        ("Chevrolet", "Colorado", "automatik", 4, 5),
        ("Mazda", "BT-50", "manuell", 4, 5),
        ("Jeep", "Gladiator", "automatik", 4, 5),
        ("Ram", "1500", "automatik", 4, 5)
    ],
    7: [  # Cabrio (20 Modelle)
        ("BMW", "2er Cabrio", "automatik", 2, 4),
        ("Audi", "A3 Cabriolet", "automatik", 2, 4),
        ("Mercedes-Benz", "C-Klasse Cabrio", "automatik", 2, 4),
        ("VW", "T-Roc Cabrio", "automatik", 2, 4),
        ("Mini", "Cabrio", "manuell", 2, 4),
        ("Mazda", "MX-5", "manuell", 2, 2),
        ("Fiat", "124 Spider", "manuell", 2, 2),
        ("Ford", "Mustang Cabrio", "automatik", 2, 4),
        ("Opel", "Cascada", "automatik", 2, 4),
        ("Peugeot", "308 CC", "manuell", 2, 4),
        ("Renault", "Mégane CC", "manuell", 2, 4),
        ("Volkswagen", "Eos", "automatik", 2, 4),
        ("Saab", "9-3 Cabrio", "automatik", 2, 4),
        ("Chevrolet", "Camaro Cabrio", "automatik", 2, 4),
        ("Chrysler", "Sebring Cabrio", "automatik", 2, 4),
        ("Citroën", "C3 Pluriel", "manuell", 2, 4),
        ("Smart", "Fortwo Cabrio", "automatik", 2, 2),
        ("BMW", "Z4 Cabrio", "automatik", 2, 2),
        ("Audi", "TT Roadster", "automatik", 2, 2),
        ("Mercedes-Benz", "SLK", "automatik", 2, 2)
    ],
    8: [  # Roadster (20 Modelle)
        ("Mazda", "MX-5 RF", "manuell", 2, 2),
        ("BMW", "Z4", "automatik", 2, 2),
        ("Porsche", "Boxster", "automatik", 2, 2),
        ("Audi", "TT Roadster", "automatik", 2, 2),
        ("Mercedes-Benz", "SLK", "automatik", 2, 2),
        ("Fiat", "124 Spider", "manuell", 2, 2),
        ("Honda", "S2000", "manuell", 2, 2),
        ("MG", "TF", "manuell", 2, 2),
        ("Toyota", "MR2", "manuell", 2, 2),
        ("Alfa Romeo", "Spider", "manuell", 2, 2),
        ("Lotus", "Elise", "manuell", 2, 2),
        ("Chevrolet", "Corvette C5", "automatik", 2, 2),
        ("Daihatsu", "Copen", "manuell", 2, 2),
        ("Opel", "GT", "manuell", 2, 2),
        ("Renault", "Wind", "manuell", 2, 2),
        ("Tesla", "Roadster", "automatik", 2, 2),
        ("Peugeot", "207 CC", "manuell", 2, 2),
        ("Volkswagen", "Karmann Ghia", "manuell", 2, 2),
        ("Chrysler", "Crossfire", "automatik", 2, 2),
        ("Mini", "Roadster", "manuell", 2, 2)
    ],
    9: [  # Limousine (20 Modelle)
        ("BMW", "5er", "automatik", 4, 5),
        ("Mercedes-Benz", "E-Klasse", "automatik", 4, 5),
        ("Audi", "A6", "automatik", 4, 5),
        ("Skoda", "Superb", "automatik", 4, 5),
        ("Volkswagen", "Arteon", "automatik", 4, 5),
        ("Ford", "Mondeo", "manuell", 4, 5),
        ("Hyundai", "i40", "automatik", 4, 5),
        ("Kia", "Optima", "automatik", 4, 5),
        ("Toyota", "Camry", "automatik", 4, 5),
        ("Mazda", "6", "automatik", 4, 5),
        ("Renault", "Talisman", "automatik", 4, 5),
        ("Peugeot", "508", "automatik", 4, 5),
        ("Volvo", "S90", "automatik", 4, 5),
        ("Opel", "Insignia", "automatik", 4, 5),
        ("Honda", "Accord", "automatik", 4, 5),
        ("Subaru", "Legacy", "manuell", 4, 5),
        ("Chevrolet", "Malibu", "automatik", 4, 5),
        ("Citroën", "C5", "automatik", 4, 5),
        ("Dacia", "Logan", "manuell", 4, 5),
        ("Alfa Romeo", "Giulia", "automatik", 4, 5)
    ],
    10: [  # Wohnmobil (5 Modelle)
        ("Hymer", "B-Klasse ModernComfort", "automatik", 3, 4),
        ("Knaus", "Sky TI", "manuell", 3, 4),
        ("Dethleffs", "Trend T", "manuell", 3, 4),
        ("Carado", "T448", "manuell", 3, 4),
        ("Weinsberg", "CaraSuite", "manuell", 3, 4)
    ],
    11: [  # Sportwagen (10 Modelle)
        ("Porsche", "911", "automatik", 2, 4),
        ("Ferrari", "488 GTB", "automatik", 2, 2),
        ("Lamborghini", "Huracán", "automatik", 2, 2),
        ("McLaren", "570S", "automatik", 2, 2),
        ("Chevrolet", "Corvette", "automatik", 2, 2),
        ("Audi", "R8", "automatik", 2, 2),
        ("Nissan", "GT-R", "automatik", 2, 4),
        ("BMW", "M4", "automatik", 2, 4),
        ("Mercedes-Benz", "AMG GT", "automatik", 2, 2),
        ("Jaguar", "F-Type", "automatik", 2, 2)
    ]
}

ausgewaehlte_fahrzeuge = []
kfz_id = 1  # Start mit Kleinwagen
# Es gibt insgesamt 155 verschiedene Modelle, die jeweils 20 Mal eingetragen werden sollen.
for i in range(20):
    for typ_id, modelle in fahrzeug_modelle.items():
        for marke, modell, getriebe, tueren, sitze in modelle: 
            eintrag = (
                kfz_id,
                marke,
                modell,
                getriebe,
                typ_id,
                random.randint(1, 3),
                random.randint(10000, 180000),
                tueren,
                sitze,
                random.randint(1, 166)  # Mietstationen-ID zufällig zwischen 1 und 166
            )
            ausgewaehlte_fahrzeuge.append(eintrag)
            kfz_id += 1

sql_insert = ""
values = []

for f in ausgewaehlte_fahrzeuge:
    values.append(f"('{f[0]}', '{f[1]}', '{f[2]}', '{f[3]}', {f[4]}, {f[5]}, {f[6]}, {f[7]}, {f[8]}, {f[9]})")

sql_insert += ",\n".join(values) + ";"
# SQL-Insert-Statements in eine Datei schreiben
with open("kfz_eintraege.sql", "w", encoding="utf-8") as file:
    file.write(sql_insert)