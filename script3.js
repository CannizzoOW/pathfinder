/* ---------------------------------------------------
   HERO CHART
----------------------------------------------------- */

const heroData = {
    
    Duelist: [
        { name: "black-panther", description: "", diagram: "images/diagrams/black-panther.png" },
        { name: "black-widow", description: "", diagram: "images/diagrams/Black Widow.png" },
        { name: "blade", description: "", diagram: "images/diagrams/Blade.png" },
        { name: "daredevil", description: "", diagram: "images/diagrams/Daredevil.png" },
        { name: "human-torch", description: "", diagram: "images/diagrams/Human Torch.png" },
        { name: "iron-fist", description: "", diagram: "images/diagrams/Iron Fist.png" },
        { name: "iron-man", description: `
        -    Iron Man has always packed an arsenal, from concentrated blasts from his hands that can hit multiple people, to the signature chest beam that'll pierce through anyone.
            
        FROM: supergonks
            `, diagram: "images/diagrams/Iron Man.png" },
        { name: "magik", description: "", diagram: "images/diagrams/Magik.png" },
        { name: "mister-fantastic", description: "", diagram: "images/diagrams/Mister Fantastic.png" },
        { name: "moon-knight", description: `
          -  Moonknights poking capabilities revolve around his crescent darts & the ankhs that compliment them, bouncing between opponents like pinballs in a pinball machine.
            
            FROM: supergonks
            `, diagram: "images/diagrams/Moon Knight.png" },
        { name: "namor", description: "", diagram: "images/diagrams/Namor.png" },
        { name: "phoenix", description: "", diagram: "images/diagrams/Phoenix.png" },
        { name: "psylocke", description: "", diagram: "images/diagrams/Psylocke.png" },
        { name: "scarlet-witch", description: "", diagram: "images/diagrams/Scarlet Witch.png" },
        { name: "squirrel-girl", description: "", diagram: "images/diagrams/Squirrel Girl.png" },
        { name: "spider-man", description: `
         -   Spider-Man best functions as a dive character due to his overwhelming speed with web-swinging, as well as his kit being dependent on close-range attacks & high-burst damage.
            
            FROM: supergonks
            `, diagram: "images/diagrams/Spider-Man.png" },
        { name: "star-lord", description: "", diagram: "images/diagrams/Star-Lord.png" },
        { name: "storm", description: "", diagram: "images/diagrams/Storm.png" },
        { name: "the-punisher", description: "", diagram: "images/diagrams/The Punisher.png" },
        { name: "winter-soldier", description: "", diagram: "images/diagrams/Winter Soldier.png" },
        { name: "wolverine", description: "", diagram: "images/diagrams/Wolverine.png" },
        { name: "deadpool", description: "", diagram: "images/diagrams/Deadpool.png" },
        { name: "elsa-bloodstone", description: "", diagram: "images/diagrams/Elsa Bloodstone.png" }
    ],

    Vanguard: [
        { name: "angela", description: "", diagram: "images/diagrams/Angela.png" },
        { name: "captain-america", description: "", diagram: "images/diagrams/Captain America.png" },
        { name: "doctor-strange", description: "", diagram: "images/diagrams/Doctor Strange.png" },
        { name: "emma-frost", description: "", diagram: "images/diagrams/Emma Frost.png" },
        { name: "groot", description: "", diagram: "images/diagrams/Groot.png" },
        { name: "hulk", description: "", diagram: "images/diagrams/Hulk.png" },
        { name: "magneto", description: "", diagram: "images/diagrams/Magneto.png" },
        { name: "peni-parker", description: "", diagram: "images/diagrams/Peni Parker.png" },
        { name: "the-thing", description: "", diagram: "images/diagrams/The Thing.png" },
        { name: "thor", description: "", diagram: "images/diagrams/Thor.png" },
        { name: "venom", description: "", diagram: "images/diagrams/Venom.png" },
        { name: "rogue", description: "", diagram: "images/diagrams/Rogue.png" }
    ],

    Strategist: [
        { name: "adam-warlock", description: `
        - Adam Warlock works well in brawl compositions because his Soulbond ability requires your team to play close together. Also, Avatar Life Stream chains between allies which will be easier in brawl compositions.
            
        - Adam Warlock also works well in Poke compositions because his Quantum Magic is a long-range hitscan attack. Avatar Life Stream has a huge burst of healing making it easier for recontesting as most poke characters have low health this will heal them quicker.

        FROM: Larkypoo
            `, 
        diagram: "images/diagrams/Adam Warlock.png" },


        { name: "cloak-&-dagger", description: "", diagram: "images/diagrams/Cloak & Dagger.png" },
        { name: "invisible-woman", description: "", diagram: "images/diagrams/Invisible Woman.png" },
        { name: "jeff", description: `
        -   Jeff works wonders in a brawl comp, from his water stream that pierces allies & enemies, to his bubbles with their speed boost, healing boost, and overtime healing.

        -   Jeff is as mischevious as he is helpful, exemplified by his top-notch mobility & survivability, from his bubbles to his swim, he's one tough little guy to take down.

        FROM: supergonks
            `, diagram: "images/diagrams/Jeff.png" },
        { name: "loki", description: "", diagram: "images/diagrams/Loki.png" },
        { name: "luna-snow", description: "", diagram: "images/diagrams/Luna Snow.png" },
        { name: "mantis", description: "", diagram: "images/diagrams/Mantis.png" },
        { name: "rocket-raccoon", description: "", diagram: "images/diagrams/Rocket Raccoon.png" },
        { name: "ultron", description: "", diagram: "images/diagrams/Ultron.png" },
        { name: "white fox", description: "", diagram: "images/diagrams/white_fox.png" }
    ]
};

for (const role in heroData) {
    heroData[role].sort((a, b) => {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
}