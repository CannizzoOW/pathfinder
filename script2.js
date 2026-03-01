/* ---------------------------------------------------
   MAIN TIER-LIST
----------------------------------------------------- */

let tierlist = { /* DAREDEVIL(A), INVISIBLE WOMAN (S/A), MISTER FANTASTIC (B/C), WINTER SOLDIER (S/A), WOLVERINE (A/B) */

    "S": ["Gambit", "Groot", "Phoenix", "Loki", "Magneto", "Invisible Woman", "Winter Soldier", "Elsa Bloodstone"],

    "A": ["Angela", "Captain America", "Cloak & Dagger", "Tankpool", "Healpool", "Doctor Strange", "Emma Frost", "Mantis", "Moon Knight", "Namor", "Rocket Raccoon", "Rogue", "Star Lord", "Thor", "Wolverine", "Daredevil", "Hela", "Hawkeye"],

    "B": ["Hulk", "Iron Fist", "Jeff", "Luna Snow", "Magik", "Peni Parker", "Psylocke", "Spider-man", "The Punisher", "The Thing", "Venom"],

    "C": ["Adam Warlock", "Deadpool", "Human Torch", "Squirrel Girl", "Storm", "Ultron", "Mister Fantastic"],

    "D": ["Black Panther", "Blade", "Iron Man"],

    "E": ["Scarlet Witch"],

    "F": ["Black Widow", ] 
};

const defaultTierlist = JSON.parse(JSON.stringify(tierlist));
const tierlistsByCharacter = {

/* ---------------------------------------------------
   VS TIER-LIST
----------------------------------------------------- */

"gambit": { /* DataVizard, */
    
    "S": [],
    
    "A": ["Invisible Woman", "Groot"],

    "B": ["Doctor Strange", "Hawkeye", "Phoenix", "Hela", "Mantis", "Psylocke", "Magik", "Human Torch", "The Punisher", "Star Lord", "Winter Soldier"],

    "C": ["Deadpool", "Tankpool", "Healpool", "Loki", "Captain America", "Iron Fist", "Emma Frost", "Rogue", "Thor", "Black Panther", "Wolverine", "Iron Man", "Spider-man", "Peni Parker", "Mister Fantastic", "Hulk"],

    "D": ["Blade", "Namor", "Storm", "Daredevil", "Moon Knight", "Venom", "Magneto", "Angela", "The Thing"],

    "E": ["Squirrel Girl", "Luna Snow"],

    "F": ["Ultron", "Scarlet Witch", "Black Widow", "Adam Warlock", "Rocket Raccoon", "Cloak & Dagger", "Jeff"]
},
"groot": { /* Nvicta */

    "S": ["The Punisher", "Hawkeye", "Moon Knight", "Wolverine", "Phoenix", "Iron Man", "Human Torch", "Storm", "Gambit"],

    "A": ["Jeff", "Deadpool", "Tankpool", "Healpool", "Hela", "Iron Fist", "Ultron", "Star Lord", "Squirrel Girl", "Angela", "Winter Soldier"],

    "B": ["Elsa Bloodstone", "Adam Warlock", "Loki", "Spider-man", "Psylocke", "Thor", "Namor"],

    "C": ["Mantis", "Blade", "Scarlet Witch", "Venom", "Daredevil", "Rogue", "Captain America", "Hulk", "Black Panther", "Magik"],

    "D": ["Doctor Strange", "Magneto", "Cloak & Dagger", "Black Widow", "Emma Frost"],

    "E": ["Rocket Raccoon", "Luna Snow", "Invisible Woman"],

    "F": ["The Thing", "Peni Parker", "Mister Fantastic"]
},
"phoenix": { /* Gust4v */

    "S": [],

    "A": ["Doctor Strange", "Gambit", "Invisible Woman"],

    "B": ["Cloak & Dagger", "Emma Frost", "Iron Fist", "Magneto", "Venom"],

    "C": ["Elsa Bloodstone", "Daredevil", "Luna Snow", "Spider-man", "Magik", "Winter Soldier", "Tankpool"],

    "D": ["Black Widow", "Deadpool", "Healpool", "Black Panther", "Angela", "Captain America", "Hawkeye", "Namor", "Rogue", "Hela", "Star Lord"],

    "E": ["Blade", "Adam Warlock", "Groot", "Hulk", "Human Torch", "Loki", "Mister Fantastic", "The Punisher", "Thor", "Peni Parker", "Psylocke", "Storm", "The Thing", "Ultron"],

    "F": ["Iron Man", "Jeff", "Mantis", "Moon Knight", "Rocket Raccon", "Squirrel Girl", "Scarlet Witch", "Wolverine"]
},
"loki": { /* Buttanuggets */

    "S": ["Moon Knight", "Winter Soldier", "Black Panther"],

    "A": ["Hawkeye", "Venom", "Phoenix", "Daredevil", "Human Torch", "Mantis"],

    "B": ["Iron Fist", "Magneto", "Magik", "Spider-man", "Captain America", "Groot", "Adam Warlock", "Namor", "Rogue", "Hela", "Thor", "Deadpool", "Tankpool", "Healpool"],

    "C": ["Blade", "Gambit", "Invisible Woman", "Hulk", "Mister Fantastic", "Black Widow", "Luna Snow", "Emma Frost", "The Punisher", "Cloak & Dagger", "Rocket Raccoon", "Ultron", "Wolverine", "Storm", "Elsa Bloodstone", "The Thing"],

    "D": ["Angela", "Peni Parker", "Jeff", "Squirrel Girl", "Doctor Strange", "Star Lord", "Iron Man"],

    "E": ["Scarlet Witch"],

    "F": ["Psylocke"]
},
"magneto": { /* jaycion, oreo,  */

    "S": ["Wolverine"],

    "A": ["Iron Fist", "Angela", "Phoenix"],

    "B": ["Storm", "Spider-man", "The Thing", "Thor", "Emma Frost", "Blade", "Black Panther", "Groot", "Magik", "Mister Fantastic", "Captain America"],

    "C": ["Squirrel Girl", "Doctor Strange", "Hulk", "Daredevil", "Scarlet Witch", "Deadpool", "Tankpool", "Healpool", "Rogue", "Invisible Woman", "Moon Knight", "Venom", "Gambit", "Human Torch", "Psylocke", "Loki", "Peni Parker"],

    "D": ["Black Widow", "Mantis", "Adam Warlock", "Rocket Raccoon", "Star Lord", "Namor", "Ultron", "Luna Snow"],

    "E": ["The Punisher", "Jeff"], 

    "F": ["Hela", "Hawkeye", "Cloak & Dagger", "Winter Soldier", "Iron Man"]
},
"invisible woman": { /* Tymiran, */

    "S": ["Daredevil", "Iron Fist", "Captain America", "Magik"],

    "A": ["Black Panther", "Hawkeye", "Mister Fantastic", "Black Widow", "Rogue", "Winter Soldier", "Thor"],

    "B": ["Hela", "Spider-man", "Iron Man", "Tankpool", "Healpool", "Phoenix", "Star Lord", "The Thing", "The Punisher", "Venom", "Hulk", "Human Torch"],

    "C": ["Blade", "Wolverine", "Moon Knight", "Deadpool", "Doctor Strange", "Gambit", "Namor", "Groot", "Emma Frost", "Mantis", "Storm", "Squirrel Girl", "Scarlet Witch", "Ultron"],

    "D": ["Cloak & Dagger", "Loki", "Luna Snow", "Magneto", "Psylocke", "Jeff"],

    "E": ["Angela", "Peni Parker"],

    "F": ["Rocket Raccoon", "Adam Warlock"]
},
"hela": { /* Gust4v */

    "S": ["Doctor Strange"],

    "A": ["Gambit", "Invisible Woman", "Iron Fist", "Captain America", "Magneto", "Phoenix", "Venom"],

    "B": ["Cloak & Dagger", "Emma Frost", "Elsa Bloodstone", "Magik", "Spider-man", "Black Panther", "Tankpool"],

    "C": ["Daredevil", "Winter Soldier", "Mister Fantastic", "Angela", "Deadpool", "Healpool", "Hawkeye"],

    "D": ["Rogue", "Namor", "Luna Snow", "Star Lord", "Groot", "Hulk", "Thor", "Peni Parker", "Psylocke"],

    "E": ["Blade", "Adam Warlock", "Black Widow", "Loki", "The Punisher", "Storm", "The Thing", "Mantis", "Human Torch", "Ultron", "Rocket Raccoon"],

    "F": ["Iron Man", "Jeff", "Moon Knight", "Squirrel Girl", "Scarlet Witch", "Wolverine"]
},
"captain america": {
    "S": [],
    "A": [],
    "B": [],
    "C": [],
    "D": [],
    "E": [],
    "F": []
},
"star lord": { /* nafi, */

    "S": ["Emma Frost"],

    "A": ["Magneto"],

    "B": ["Adam Warlock", "Black Widow", "Doctor Strange", "Loki", "Winter Soldier", "Scarlet Witch"],

    "C": ["Hela", "Cloak & Dagger", "Iron Fist", "Namor", "Storm", "The Thing", "Invisible Woman", "Angela"],

    "D": ["Hawkeye", "Iron Man", "Moon Knight", "Peni Parker", "Mantis", "Luna Snow", "Thor", "Psylocke", "Magik", "Gambit", "Phoenix", "Daredevil"],

    "E": ["Jeff", "Hulk", "Groot", "Black Panther", "Venom", "The Punisher", "Rocket Raccoon", "Wolverine", "Mister Fantastic", "Deadpool", "Tankpool", "Healpool"],

    "F": ["Captain America", "Spider-man", "Squirrel Girl", "Human Torch", "Blade", "Rogue"]
},
"angela": { /* Toon, */

    "S": ["Invisible Woman", "Thor", "Winter Soldier"],

    "A": ["Phoenix", "The Thing", "Iron Fist"],

    "B": ["Hulk", "Mister Fantastic", "Gambit", "Rogue", "Elsa Bloodstone"],

    "C": ["Deadpool", "Tankpool", "Healpool", "Wolverine", "The Punisher", "Star Lord", "Namor"],

    "D": ["Blade", "Daredevil", "Psylocke", "Loki", "Hawkeye", "Jeff", "Iron Man", "Human Torch", "Hela", "Spider-man", "Venom", "Magik", "Groot", "Rocket Raccoon"],

    "E": ["Black Widow", "Captain America", "Mantis", "Squirrel Girl", "Moon Knight", "Magneto", "Scarlet Witch", "Peni Parker", "Luna Snow", "Doctor Strange", "Black Panther", "Storm", "Cloak & Dagger", "Ultron"],

    "F": ["Adam Warlock"]
},
"hawkeye": { /* Jensjankiebar, pm_mps, */

    "S": ["Magneto"],

    "A": ["Daredevil", "Black Panther", "Groot", "Psylocke", "Invisible Woman", "Magik", "Mantis", "Doctor Strange"],

    "B": ["Namor", "Spider-man", "Captain America", "Hulk", "Mister Fantastic", "Venom", "Emma Frost", "Iron Fist", "Tankpool"],

    "C": ["Phoenix", "Star Lord", "Human Torch", "Hela", "Winter Soldier", "Peni Parker"],

    "D": ["Adam Warlock", "Scarlet Witch", "Blade", "Iron Man", "Storm", "The Punisher", "Thor", "Wolverine", "Ultron", "Loki", "Deadpool", "Healpool"],

    "E": ["Black Widow", "Luna Snow", "Squirrel Girl", "Moon Knight"],

    "F": ["The Thing", "Cloak & Dagger", "Rocket Raccoon", "Jeff"]
},
"cloak & dagger": { /* Phimmiezz, */

    "S": ["Magneto", "Hulk", "Hawkeye"],

    "A": ["Peni Parker", "Winter Soldier", "Wolverine", "Angela", "The Thing", "Thor", "Emma Frost", "Spider-man", "Daredevil"],

    "B": ["Iron Man", "Venom", "Groot", "Doctor Strange", "Captain America", "Psylocke", "Phoenix", "Black Panther", "Hela", "Black Widow", "Namor", "Tankpool", "Magik"],

    "C": ["Rogue", "Squirrel Girl", "Mister Fantastic", "Moon Knight", "Gambit", "Iron Fist", "Scarlet Witch", "The Punisher"],

    "D": ["Storm", "Blade", "Loki", "Mantis", "Human Torch", "Star Lord", "Deadpool", "Healpool"],

    "E": ["Invisible Woman", "Adam Warlock", "Luna Snow"],
    
    "F": ["Rocket Raccoon", "Ultron", "Jeff"]
},
"rocket raccoon": { /* ryanadamic, phimmiezz,  */

    "S": ["Hawkeye", "Hela", "Phoenix"],

    "A": ["Black Panther", "Daredevil", "Iron Fist", "Psylocke", "Namor", "Winter Soldier"],

    "B": ["The Punisher", "Doctor Strange", "Captain America", "Groot", "Venom", "Moon Knight", "Spider-man", "Gambit", "Star Lord", "Magik", "Emma Frost", "Magneto", "Angela"],

    "C": ["Squirrel Girl", "The Thing", "Mister Fantastic", "Peni Parker", "Rogue", "Thor", "Wolverine", "Invisible Woman", "Tankpool"],

    "D": ["Ultron", "Iron Man", "Loki", "Mantis", "Scarlet Witch", "Storm", "Human Torch", "Blade", "Hulk", "Healpool"],

    "E": ["Luna Snow", "Cloak & Dagger", "Deadpool"],

    "F": ["Adam Warlock", "Jeff", "Black Widow"]
},
"daredevil": { /* Kingu */

    "S": ["Peni Parker"],

    "A": ["Angela", "Ultron", "The Thing", "Elsa Bloodstone"],

    "B": ["Human Torch", "Iron Man", "Storm"],

    "C": ["Wolverine", "Emma Frost", "Winter Soldier", "Loki", "Iron Fist", "Gambit", "Venom", "Thor", "Hulk", "Captain America", "Hela", "Healpool", "Tankpool", "Star Lord", "Phoenix"],

    "D": ["Mister Fantastic", "Rogue", "Doctor Strange", "Magneto", "Groot", "Namor", "Luna Snow", "Invisible Woman", "Blade", "Black Panther", "Magik", "Hawkeye", "Deadpool"],

    "E": ["Jeff", "Spider-man", "Squirrel Girl", "The Punisher"],

    "F": ["Black Widow", "Scarlet Witch", "Adam Warlock", "Mantis", "Rocket Raccoon", "Cloak & Dagger", "Moon Knight", "Psylocke"]
},
"namor": { /* That Nerd Savior */

    "S": ["Hela", "Phoenix", "The Punisher", "Winter Soldier"],

    "A": ["Moon Knight", "Doctor Strange", "Groot", "Ultron", "Iron Man", "Loki", "Storm", "Elsa Bloodstone"],

    "B": ["Deadpool", "Tankpool", "Healpool", "Hawkeye", "Human Torch", "Luna Snow", "Mantis", "Gambit", "Squirrel Girl"],

    "C": ["Adam Warlock", "Emma Frost", "Gambit", "Cloak & Dagger", "Invisible Woman", "Mister Fantastic", "Peni Parker", "Star Lord", "Wolverine", "Rocket Raccoon" ],

    "D": ["Black Widow", "Venom", "Blade", "Captain America", "Rogue", "Hulk", "Iron Fist", "Psylocke", "Thor", "The Thing", "Scarlet Witch"],

    "E": ["Angela", "Jeff", "Black Panther", "Daredevil"],

    "F": ["Spider-man", "Magik"]
},
"moon knight": { /* Jensjankiebar, */

    "S": ["Angela", "Cloak & Dagger", "Daredevil", "Mister Fantastic"],

    "A": ["Invisible Woman", "Captain America", "Adam Warlock", "Doctor Strange", "Emma Frost", "Hela", "Magneto", "Magik", "Star Lord", "Gambit", "Iron Fist"],

    "B": ["Peni Parker", "Iron Man", "Venom", "Wolverine", "Human Torch", "Ultron", "Blade", "Spider-man", "Deadpool", "Hulk", "Psylocke", "Hawkeye"],

    "C": ["Luna Snow", "Black Panther", "Storm", "Thor", "Phoenix", "Winter Soldier", "Rogue", "Tankpool", "Healpool"],

    "D": ["The Thing", "Namor", "Rocket Raccoon", "Squirrel Girl", "Scarlet Witch"],

    "E": ["The Punisher", "Mantis", "Black Widow", "Groot"],

    "F": ["Jeff", "Loki"]
},
"psylocke": { /* Gust4v */

    "S": ["Winter Soldier"],

    "A": ["Luna Snow", "Phoenix","Spider-man"],

    "B": ["Black Widow", "Hela", "Invisible Woman", "Gambit", "Namor", "Mister Fantastic", "Elsa Bloodstone", "Venom"],

    "C": ["Angela","Cloak & Dagger", "Emma Frost", "Human Torch", "Loki", "Star Lord", "Thor", "The Thing", "Tankpool"],

    "D": ["Wolverine", "Adam Warlock", "Blade", "Daredevil", "Doctor Strange", "Groot", "Iron Fist", "Magik", "Magneto", "Mantis", "Peni Parker", "The Punisher", "Rocket Raccoon", "Scarlet Witch", "Rogue", "Ultron", "Deadpool", "Healpool"],

    "E": ["Black Panther", "Hulk", "Hawkeye", "Iron Man", "Jeff", "Storm"],

    "F": ["Squirrel Girl", "Moon Knight", "Captain America"]
},
"doctor strange": { /* Absalon */

    "S": ["Invisible Woman", "Emma Frost", "Wolverine"],

    "A": ["Daredevil", "Angela", "Iron Fist", "Winter Soldier", "Deadpool"],

    "B": ["Hulk", "Namor", "Mister Fantastic", "Phoenix", "Rogue", "Squirrel Girl", "Peni Parker", "Psylocke"],

    "C": ["Luna Snow", "Gambit", "Cloak & Dagger", "Rocket Raccoon", "Star Lord", "Black Panther", "Spider-man", "Groot", "Human Torch", "Loki", "Healpool"],

    "D": ["Magneto", "Hela", "Hawkeye", "Adam Warlock", "Ultron", "Moon Knight", "Venom", "Captain America", "Jeff", "Mantis", "Tankpool", "Elsa Bloodstone"],

    "E": ["Magik", "The Thing", "Blade", "Storm", "The Punisher", "Thor"],

    "F": ["Iron Man", "Black Widow" /*for the vibes*/, "Scarlet Witch"]
},
"winter soldier": { /* Gust4v */

    "S": ["Doctor Strange"],

    "A": ["Cloak & Dagger", "Gambit", "Groot", "Hela", "Invisible Woman", "Phoenix", "Magneto", "Tankpool"],

    "B": ["Angela", "Emma Frost", "Namor", "Peni Parker", "The Punisher", "The Thing"],

    "C": ["Elsa Bloodstone", "Hawkeye", "Luna Snow", "Moon Knight", "Rocket Raccoon", "Ultron", "Healpool"],

    "D": ["Black Widow", "Daredevil", "Deadpool", "Human Torch", "Iron Fist", "Iron Man", "Loki", "Mister Fantastic", "Rogue", "Spider-man", "Venom"],

    "E": ["Adam Warlock", "Captain America", "Hulk", "Blade", "Jeff", "Mantis", "Squirrel Girl", "Star Lord", "Storm", "Thor", "Wolverine", "Black Panther"],

    "F": ["Magik", "Psylocke", "Scarlet Witch"]
},
"the punisher": { /* Gust4v */

    "S": ["Hela", "Phoenix"],

    "A": ["Black Panther", "Doctor Strange", "Luna Snow", "Magneto", "Tankpool"],

    "B": ["Gambit", "Hawkeye", "Magik", "Namor", "Psylocke", "Spider-man", "Star Lord", "Winter Soldier", "Venom", "Deadpool", "Healpool"],

    "C": ["Cloak & Dagger", "Elsa Bloodstone", "Emma Frost", "Invisible Woman", "Daredevil", "Iron Fist", "Moon Knight", "Wolverine"],

    "D": ["Black Widow", "Captain America", "Blade", "Groot", "Loki", "Mantis", "Peni Parker", "Rocket Raccoon", "Mister Fantastic", "Rogue"],
    
    "E": ["Adam Warlock", "Angela", "Hulk", "Human Torch", "Jeff", "Squirrel Girl", "Storm", "The Thing", "Thor", "Ultron"],

    "F": ["Iron Man", "Scarlet Witch"]
},
"emma frost": { /* Absalon, */

    "S": ["Winter Soldier"],

    "A": ["Phoenix", "Human Torch", "The Punisher", "Hela"],

    "B": ["Peni Parker", "Wolverine", "Moon Knight", "Invisible Woman", "Namor", "Hawkeye", "Squirrel Girl", "Psylocke", "Star Lord", "Elsa Bloodstone"],

    "C": ["Ultron", "Iron Man", "Cloak & Dagger", "Mantis", "Luna Snow", "Rocket Raccoon", "Storm", "Gambit", "Healpool"],

    "D": ["Mister Fantastic", "Adam Warlock", "Black Widow", "Loki", "Jeff", "Iron Fist", "Captain America", "Spider-man", "Tankpool", "Deadpool"],

    "E": ["Groot", "Captain America", "Angela", "Daredevil", "Black Panther", "Blade", "Scarlet Witch", "Rogue"],

    "F": ["The Thing", "Doctor Strange", "Venom", "Magik", "Thor", "Hulk"]
},
"deadpool": {
    "S": [],
    "A": [],
    "B": [],
    "C": [],
    "D": [],
    "E": [],
    "F": []
},
"tankpool": {
    "S": [],
    "A": [],
    "B": [],
    "C": [],
    "D": [],
    "E": [],
    "F": []
},
"healpool": { /* Nenmi */

    "S": ["Daredevil", "Angela", "Magik", "Thor", "Venom", "Groot"],

    "A": ["Hulk", "Black Panther", "Captain America", "Elsa Bloodstone", "Gambit", "Phoenix", "Psylocke", "Rogue", "Spider-man", "Winter Soldier"],

    "B": ["Adam Warlock", "Doctor Strange", "Emma Frost", "Hawkeye", "Iron Fist", "Luna Snow", "Magneto", "Moon Knight", "Namor", "Peni Parker", "Star Lord", "Ultron"],

    "C": ["Cloak & Dagger", "Deadpool", "Tankpool", "Healpool", "Hela", "Human Torch", "Invisible Woman", "Loki", "Mantis", "Rocket Raccoon", "Storm", "The Punisher", "Wolverine"],

    "D": ["Black Widow", "Iron Man", "Mister Fantastic", "The Thing", "Jeff", "Squirrel Girl"],

    "E": [],

    "F": ["Blade", "Scarlet Witch"]
},
"thor": { /* Absalon, */

    "S": ["Emma Frost", "Wolverine", "Winter Soldier"],

    "A": ["The Punisher", "Phoenix", "Star Lord", "Hawkeye", "Hela", "Peni Parker"],

    "B": ["Squirrel Girl", "Doctor Strange", "Namor", "Moon Knight", "Cloak & Dagger", "Iron Fist", "Daredevil", "Elsa Bloodstone"],

    "C": ["Iron Man", "Psylocke", "Gambit", "Rocket Raccoon", "Invisible Woman", "Mantis", "Luna Snow", "Spider-man", "Rogue", "Loki", "Hulk", "Healpool"],

    "D": ["Adam Warlock", "Human Torch", "Ultron", "Storm", "Mister Fantastic", "Groot", "Magneto", "Angela", "Black Widow", "Black Panther", "Deadpool"],

    "E": ["The Thing", "Venom", "Scarlet Witch", "Captain America", "Jeff", "Tankpool"],

    "F": ["Blade", "Magik"]
},
"rogue": { /* Toon, */

    "S": ["The Thing", "Wolverine", "Winter Soldier"],

    "A": ["Invisible Woman", "Peni Parker", "Phoenix", "Iron Fist"],

    "B": ["Emma Frost", "Hela", "Moon Knight", "The Punisher", "Thor", "Elsa Bloodstone"],

    "C": ["Angela", "Namor", "Psylocke", "Jeff", "Star Lord", "Loki", "Captain America", "Daredevil", "Deadpool", "Tankpool", "Healpool", "Hawkeye", "Hulk", "Ultron"],

    "D": ["Cloak & Dagger", "Doctor Strange", "Rocket Raccoon", "Venom", "Spider-man", "Groot", "Storm", "Magik", "Magneto", "Human Torch", "Mister Fantastic", "Iron Man"],

    "E": ["Black Panther", "Black Widow", "Blade", "Squirrel Girl", "Scarlet Witch", "Mantis", "Luna Snow", "Gambit"],
    
    "F": ["Adam Warlock"]
},
"jeff": { /* UwUzi, PocketRocket, NEEDS CHANGING */

    "S": ["Hawkeye", "Black Panther", "Magneto", "Daredevil"],

    "A": ["Hela", "Groot", "Iron Fist", "Moon Knight", "Namor", "Iron Man", "Spider-man", "Psylocke", "Phoenix", "Emma Frost", "Magik", "Gambit", "The Punisher", "Thor", "Cloak & Dagger"],

    "B": ["Doctor Strange"],

    "C": ["Squirrel Girl", "Winter Soldier", "Mister Fantastic", "Star Lord", "Storm", "Scarlet Witch", "Human Torch"],

    "D": ["Angela", "Peni Parker", "Loki", "Ultron"],

    "E": ["Invisible Woman", "Wolverine", "Black Widow", "Rogue", "Venom", "Deadpool", "Healpool", "Tankpool", "Blade"],

    "F": ["Luna Snow", "Mantis", "Rocket Raccoon", "Adam Warlock", "The Thing", "Hulk", "Captain America"]
},
"venom": { /* Drag */

    "S": ["The Punisher", "Squirrel Girl", "Wolverine", "Emma Frost"],

    "A": ["Iron Fist", "Hela", "Winter Soldier", "Phoenix", "Peni Parker"],

    "B": ["Iron Man", "Namor", "Scarlet Witch", "Human Torch", "Gambit", "Invisible Woman", "Thor", "Rocket Raccoon", "Star Lord", "Healpool"],

    "C": ["Mantis", "Hulk", "Mister Fantastic", "Magneto", "Groot", "Loki", "Magik", "Doctor Strange", "Psylocke", "Luna Snow", "Angela", "Rogue", "The Thing", "Storm", "Moon Knight", "Blade"],

    "D": ["Captain America", "Hawkeye", "Jeff", "Ultron", "Daredevil"],

    "E": ["Black Widow", "Cloak & Dagger", "Adam Warlock", "Deadpool", "Tankpool"],

    "F": ["Spider-man", "Black Panther"]
},
"spider-man": { /* Kingu, */

    "S": ["Winter Soldier", "The Thing", "Angela", "Namor"],

    "A": ["Daredevil", "Loki", "Iron Fist", "Magneto", "Captain America", "Hela", "Star Lord", "Magik", "Gambit", "Phoenix", "Doctor Strange", "Thor"],

    "B": ["Wolverine", "Hulk", "Venom", "Groot", "Mantis", "Black Panther", "Black Widow", "Emma Frost", "Mister Fantastic", "Deadpool", "Tankpool", "Healpool"],

    "C": ["Peni Parker", "Ultron", "Iron Man", "Adam Warlock", "Rogue", "The Punisher", "Invisible Woman", "Psylocke", "Moon Knight", "Blade"],

    "D": ["Luna Snow", "Storm", "Cloak & Dagger", "Scarlet Witch"],

    "E": ["Hawkeye", "Jeff", "Human Torch"],

    "F": ["Rocket Raccoon", "Squirrel Girl"]
},
"hulk": { /* Gorge, Lucid,  */
    
    "S": ["The Thing", "Emma Frost", "Peni Parker", "Winter Soldier", "Hela", "Phoenix", "The Punisher", "Jeff", "Invisible Woman"],

    "A": ["Rogue", "Thor", "Wolverine", "Hawkeye", "Squirrel Girl", "Blade", "Mister Fantastic"], 

    "B": ["Psylocke", "Gambit", "Luna Snow", "Mantis"], 

    "C": ["Groot", "Tankpool", "Spider-man", "Star Lord", "Iron Fist", "Daredevil", "Namor", "Magik", "Moon Knight", "Deadpool", "Cloak & Dagger", "Healpool", "Loki"],

    "D": ["Magneto", "Venom", "Angela", "Human Torch", "Black Widow", "Adam Warlock", "Ultron", "Rocket Raccoon"],

    "E": ["Captain America", "Doctor Strange", "Iron Man", "Storm", "Black Panther", "Scarlet Witch"],

    "F": []
},
"magik": { /* Nvicta, */

    "S": ["Thor", "Winter Soldier", "Emma Frost", "Gambit", "Peni Parker"],

    "A": ["Rogue", "Mister Fantastic","Hulk", "The Thing", "Angela"],

    "B": ["Black Panther", "Cloak & Dagger", "Storm", "Human Torch", "Invisible Woman", "Star Lord", "Ultron", "Namor", "Squirrel Girl", "Iron Man", "Elsa Bloodstone"],

    "C": ["Captain America", "Hela", "Luna Snow", "Scarlet Witch", "Wolverine", "Daredevil", "Phoenix", "Iron Fist", "Healpool", "Tankpool", "Psylocke", "Spider-man"],

    "D": ["Venom", "Deadpool", "Hawkeye", "Loki", "Moon Knight", "Groot", "Rocket Raccoon", "Black Widow", "The Punisher"],

    "E": ["Jeff", "Adam Warlock", "Doctor Strange", "Magneto"],

    "F": ["Mantis", "Blade"]
},
"iron fist": { /* Toon, */

    "S": ["Phoenix", "Hela", "Gambit"],

    "A": ["Peni Parker", "Invisible Woman", "Winter Soldier", "Daredevil", "Elsa Bloodstone"],

    "B": ["Loki", "Psylocke", "Star Lord", "Ultron"],

    "C": ["Emma Frost", "Black Widow", "Luna Snow", "Magik", "The Punisher", "Mister Fantastic", "Spider-man", "Wolverine", "Thor", "Storm", "Human Torch"],

    "D": ["Iron Man", "Black Panther", "Hulk", "Magneto", "Hawkeye", "Jeff", "Rogue", "Moon Knight", "Namor", "Rocket Raccoon", "Squirrel Girl", "Blade", "Mantis", "Angela", "Deadpool", "Healpool", "Tankpool"],

    "E": ["The Thing", "Cloak & Dagger", "Scarlet Witch", "Adam Warlock"],

    "F": ["Captain America", "Venom", "Groot", "Doctor Strange"]
},
"luna snow": { /* Tymiran */

    "S": ["Iron Fist", "Spider-man", "Star Lord", "Magik", "Black Panther", "Rogue"],

    "A": ["Hawkeye", "Winter Soldier", "The Punisher", "Black Widow", "Daredevil", "The Thing", "Hela", "Gambit"],

    "B": ["Squirrel Girl", "Venom", "Emma Frost", "Storm", "Wolverine", "Namor", "Doctor Strange", "Iron Man", "Thor", "Magneto", "Blade", "Invisible Woman", "Angela", "Mister Fantastic", "Moon Knight", "Healpool"],

    "C": ["Rocket Raccoon", "Groot", "Scarlet Witch", "Hulk", "Loki", "Deadpool", "Tankpool", "Captain America", "Phoenix", "Human Torch"],

    "D": ["Psylocke", "Peni Parker", "Mantis"],

    "E": ["Jeff", "Ultron", "Cloak & Dagger"],

    "F": ["Adam Warlock"]
},
"wolverine": {
    "S": [],
    "A": [],
    "B": [],
    "C": [],
    "D": [],
    "E": [],
    "F": []
},
"the thing": { /* That Nerd Savior */

    "S": ["The Punisher", "Groot", "Hela", "Phoenix", "Peni Parker"],

    "A": ["Emma Frost", "Moon Knight", "Hawkeye", "Ultron", "Human Torch", "Squirrel Girl", "Iron Man", "Storm", "Elsa Bloodstone"],

    "B": ["Doctor Strange", "Tankpool", "Black Widow", "Winter Soldier", "Luna Snow", "Mantis", "Magneto", "Wolverine", "Namor", "Loki"],

    "C": ["Deadpool", "Healpool", "Adam Warlock", "Gambit", "Cloak & Dagger", "Thor", "Invisible Woman", "Mister Fantastic", "Star Lord", "Rocket Raccoon"],

    "D": ["Angela", "Blade", "Rogue", "Scarlet Witch", "Iron Fist"],

    "E": ["Jeff", "Spider-man", "Venom", "Captain America", "Hulk"],

    "F": ["Magik", "Black Panther", "Daredevil"]
},
"mantis": { /* That Nerd Savior */

    "S": ["Black Panther", "Magik", "Hawkeye", "Moon Knight", "Daredevil", "Phoenix", "Elsa Bloodstone"],

    "A": ["Angela", "Psylocke", "Tankpool", "Deadpool", "Captain America", "Emma Frost", "Hela", "The Punisher", "Winter Soldier", "Spider-man"],

    "B": ["Healpool", "Venom", "Ultron", "Human Torch", "Iron Fist", "Loki", "Iron Man", "Doctor Strange", "Star Lord", "Storm", "Squirrel Girl", "Luna Snow", "Groot", "Hulk", "Rogue", "Thor"],

    "C": ["Peni Parker", "Black Widow", "Jeff", "Invisible Woman", "Rocket Raccoon", "Adam Warlock", "Gambit", "Mister Fantastic", "Magneto"],

    "D": ["Namor", "The Thing", "Blade", "Wolverine"],

    "E": ["Scarlet Witch", "Cloak & Dagger"],
    
    "F": []
},
"human torch": { /* Nenmi */

    "S": ["Angela", "Hela", "Invisible Woman", "Jeff", "Phoenix", "The Punisher", "Spider-man"],

    "A": ["Adam Warlock", "Black Widow", "Hulk", "Iron Man", "Namor", "Psylocke", "Star Lord", "Ultron", "Winter Soldier"],

    "B": ["Emma Frost", "Gambit", "Iron Fist", "Luna Snow", "Magneto", "Mister Fantastic", "Scarlet Witch", "Storm", "Deadpool", "Tankpool"],

    "C": ["Healpool", "Thor", "Elsa Bloodstone"],

    "D": ["Cloak & Dagger", "Daredevil", "Doctor Strange", "Rogue", "Venom", "Wolverine", "Loki", "Magik", "Black Panther", "Moon Knight", "Rocket Raccon", "Captain America"],

    "E": ["Mantis"],

    "F": ["The Thing", "Groot", "Peni Parker", "Blade", "Squirrel Girl"]
},
"peni parker": { /* Absalon */

    "S": ["Invisible Woman", "Angela", "Phoenix", "Winter Soldier"],

    "A": ["Squirrel Girl", "Human Torch", "Hawkeye", "Doctor Strange", "The Punisher"],

    "B": ["Storm", "Iron Man", "Wolverine", "Moon Knight", "Hela", "Ultron", "Star Lord", "Elsa Bloodstone"],

    "C": ["Tankpool", "Deadpool", "Healpool", "Adam Warlock", "Loki", "Luna Snow", "Magneto", "Rocket Raccoon", "Mantis", "Mister Fantastic", "Gambit", "Namor"],

    "D": ["Emma Frost", "Black Widow", "Cloak & Dagger", "Psylocke", "Groot", "Spider-man"],

    "E": ["Captain America", "Jeff", "Thor", "Iron Fist", "Scarlet Witch", "Blade", "Rogue"],

    "F": ["Black Panther", "Venom", "The Thing", "Hulk", "Magik", "Daredevil"]
},
"ultron": { /* jaycion, Drag  */

    "S": ["Angela", "Hela", "Phoenix"],

    "A": ["Star Lord", "Rogue", "Spider-man", "Namor", "Iron Fist", "The Punisher"],

    "B": ["Luna Snow", "Invisible Woman", "Magneto", "Black Widow", "Adam Warlock"],

    "C": ["Hulk", "Iron Man", "Daredevil", "Jeff", "Loki", "Magik", "Psylocke", "Scarlet Witch", "Winter Soldier", "Ultron", "Deadpool", "Tankpool", "Healpool", "Gambit", "Doctor Strange", "Cloak & Dagger", "Mister Fantastic", "Elsa Bloodstone"],

    "D": ["Hawkeye", "Peni Parker", "Moon Knight", "Storm", "Thor", "Venom", "Groot", "Emma Frost", "Blade"],

    "E": ["Mantis", "Squirrel Girl", "Human Torch", "Wolverine", "Captain America", "Rocket Raccoon"],

    "F": ["The Thing", "Black Panther"]
},
"blade": {
    "S": [],
    "A": [],
    "B": [],
    "C": [],
    "D": [],
    "E": [],
    "F": []
},
"mister fantastic": { /* Absalon */

    "S": ["Hawkeye", "Phoenix", "Moon Knight"],

    "A": ["Winter Soldier", "Squirrel Girl", "Hela", "Wolverine", "The Punisher", "Namor", "Elsa Bloodstone"],

    "B": ["Thor", "Emma Frost", "Groot", "The Thing", "Black Widow", "Tankpool"],

    "C": ["Peni Parker", "Magneto", "Loki", "Cloak & Dagger", "Invisibile Woman", "Gambit", "Rogue", "Jeff", "Deadpool", "Healpool"],

    "D": ["Doctor Strange", "Angela", "Daredevil", "Star Lord", "Adam Warlock", "Psylocke", "Hulk", "Luna Snow", "Blade"],

    "E": ["Human Torch", "Storm", "Iron Man", "Ultron", "Spider-man", "Venom", "Captain America", "Mantis", "Rocket Raccoon"],

    "F": ["Magik", "Black Panther", "Iron Fist", "Scarlet Witch"]
},
"squirrel girl": {
    "S": [],
    "A": [],
    "B": [],
    "C": [],
    "D": [],
    "E": [],
    "F": []
},
"iron man": { /* Drag */

    "S": ["Angela", "Hela", "Phoenix"],

    "A": ["Mister Fantastic", "Spider-man", "Namor", "Rogue", "Magneto", "The Punisher"],

    "B": ["Adam Warlock", "Black Widow", "Iron Fist", "Star Lord", "Winter Soldier", "Doctor Strange", "Peni Parker", "Hulk", "Elsa Bloodstone"],

    "C": ["Groot", "Jeff", "Psylocke", "Luna Snow", "Magik", "Scarlet Witch", "Daredevil", "Gambit", "Deadpool", "Tankpool", "Healpool", "Thor", "Venom"],

    "D": ["Hawkeye", "Rocket Raccoon", "Ultron", "Invisible Woman", "Blade", "Emma Frost", "Storm", "The Thing", "Loki"],

    "E": ["Captain America", "Mantis", "Squirrel Girl", "Wolverine", "Human Torch", "Cloak & Dagger"],

    "F": ["Black Panther"]
},
"storm": {
    "S": [],
    "A": [],
    "B": [],
    "C": [],
    "D": [],
    "E": [],
    "F": []
},
"black panther": {
    "S": [],
    "A": [],
    "B": [],
    "C": [],
    "D": [],
    "E": [],
    "F": []
},
"adam warlock": { /* Myo */

    "S": ["Iron Man", "Namor", "Scarlet Witch", "Moon Knight", "Psylocke", "Spider-man", "Storm", "Groot"],

    "A": ["The Punisher", "Star Lord", "Doctor Strange", "Hawkeye", "Hela"],

    "B": ["Phoenix", "Iron Fist", "Magik", "Black Panther", "Magneto", "Black Widow", "Squirrel Girl", "Cloak & Dagger", "Ultron", "Human Torch", "Mister Fantastic"],

    "C": ["Captain America", "Peni Parker", "Mantis", "Gambit", "Blade", "Deadpool", "Tankpool", "Healpool", "Invisible Woman", "Rocket Raccoon"],

    "D": ["The Thing", "Thor", "Angela", "Wolverine", "Emma Frost", "Daredevil", "Luna Snow", "Winter Soldier"],

    "E": ["Rogue", "Venom", "Hulk", "Loki"],

    "F": ["Jeff"]
},
"scarlet witch": { /* Lucid, */

    "S": ["Hawkeye", "Phoenix", "Winter Soldier", "Loki", "Elsa Bloodstone"],

    "A": ["Hulk", "Angela", "Gambit", "Namor"],

    "B": ["Black Widow", "Peni Parker", "The Punisher", "Psylocke", "Mister Fantastic", "Ultron", "Hela", "Invisible Woman"], 

    "C": ["Doctor Strange", "Deadpool", "Healpool", "Tankpool", "Thor", "Jeff", "Rogue", "Wolverine", "Magneto" , "Captain America", "Emma Frost", "Magik"],

    "D": ["Moon Knight", "Iron Man", "Human Torch", "Iron Fist", "Daredevil", "Cloak & Dagger", "Star Lord", "Venom", "Groot", "Blade"],

    "E": ["Mantis", "Spider-man", "Rocket Raccoon", "Storm", "Black Panther"], 

    "F": ["The Thing", "Adam Warlock", "Squirrel Girl", "Luna Snow"] 
},
"black widow": { /* Snipah */
    "S": [],
    "A": [],
    "B": [],
    "C": [],
    "D": [],
    "E": [],
    "F": []
},
"Elsa Bloodstone": { /* Gust4v */

    "S": ["Gambit"],

    "A": ["Invisible Woman"],

    "B": ["Spider-man", "Loki", "Jeff", "Magneto", "Phoenix", "Black Panther", "Luna Snow", "Hela", "Groot", "Tankpool", "Healpool"],

    "C": ["Emma Frost", "Wolverine", "Mister Fantastic", "Ultron", "Winter Soldier", "The Punisher", "Angela", "Psylocke"],

    "D": ["Venom", "Star Lord", "Hulk", "Cloak & Dagger", "Captain America", "Iron Fist", "Storm", "Human Torch", "Daredevil", "Doctor Strange", "Rocket Raccoon", "Thor", "The Thing", "Namor", "Black Widow", "Adam Warlock", "Hawkeye", "Deadpool"],

    "E": ["Blade", "Mantis", "Iron Man", "Moon Knight", "Peni Parker", "Magik", "Rogue"],

    "F": ["Squirrel Girl", "Scarlet Witch"]
}

};