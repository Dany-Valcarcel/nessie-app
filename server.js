/* EXPRESS APP */
const PORT_NUMBER = 4000;
const http = require("http");
const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

/* MONGO DB */
require("dotenv").config({ path: path.resolve(__dirname, '.env') })
const db = process.env.MONGO_DB_NAME;
const collection = process.env.MONGO_COLLECTION;
const username = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${username}:${password}@cluster0.qzqj9nb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname + '/style'));
app.use(express.static(__dirname + '/assets'));

// Home Page
app.get("/", (request, response) => { 
    response.render("index");
});

app.get("/build", (request, response) => { 
    response.render("build");
});

async function newPokemon(pokemon, nickname, isShiny) {
    let pk = pokemon.toLowerCase();
    const apiURL = `https://pokeapi.co/api/v2/pokemon/${pk}`;
    let sprite;
    const res = await fetch(apiURL);
    const data = await res.json();

    if (isShiny){
        sprite = data.sprites["front_shiny"];
    } else {
        sprite = data.sprites["front_default"];
    }
    const type = data.types.map(type => type.type.name).join(", ");
    pokemon = pk.charAt(0).toUpperCase() + pk.slice(1)

    return {
        pokemon: pokemon, 
        nickname: (nickname ? nickname : pokemon), 
        shiny: isShiny,
        sprite: sprite,
        type: type
    };
}

app.post("/buildConfirm", async (request, response) => { 
    const {
        teamName,
        pk1, nn1, sh1,
        pk2, nn2, sh2,
        pk3, nn3, sh3,
        pk4, nn4, sh4,
        pk5, nn5, sh5,
        pk6, nn6, sh6
    } = request.body;

    const pokemon1 = await newPokemon(pk1, nn1, (sh1 ? true : false));
    const pokemon2 = await newPokemon(pk2, nn2, (sh2 ? true : false));
    const pokemon3 = await newPokemon(pk3, nn3, (sh3 ? true : false));
    const pokemon4 = await newPokemon(pk4, nn4, (sh4 ? true : false));
    const pokemon5 = await newPokemon(pk5, nn5, (sh5 ? true : false));
    const pokemon6 = await newPokemon(pk6, nn6, (sh6 ? true : false));

    const newTeam = {
        name: teamName,
        pokemon1: pokemon1,
        pokemon2: pokemon2,
        pokemon3: pokemon3,
        pokemon4: pokemon4,
        pokemon5: pokemon5,
        pokemon6: pokemon6
    };

    await client.db(db).collection(collection).insertOne(newTeam);
    response.render("buildConfirm", newTeam);
});

app.get("/viewAllTeams", async (request, response) => { 
    let filter = {};
    const cursor = client.db(db)
        .collection(collection)
        .find(filter);
        
    const teams = await cursor.toArray();
    let teamListHTML = "";
    for (let t of teams) {
        teamListHTML += `<a class="teamLink" href="/viewTeam/${t.name}"><div class="teamPreview"><h3>${t.name}</h3>`;
        teamListHTML += `<span><img src="${t.pokemon1.sprite}" alt="${t.pokemon1.pokemon}"></span>`;
        teamListHTML += `<span><img src="${t.pokemon2.sprite}" alt="${t.pokemon2.pokemon}"></span>`;
        teamListHTML += `<span><img src="${t.pokemon3.sprite}" alt="${t.pokemon3.pokemon}"></span>`;
        teamListHTML += `<span><img src="${t.pokemon4.sprite}" alt="${t.pokemon4.pokemon}"></span>`;
        teamListHTML += `<span><img src="${t.pokemon5.sprite}" alt="${t.pokemon5.pokemon}"></span>`;
        teamListHTML += `<span><img src="${t.pokemon6.sprite}" alt="${t.pokemon6.pokemon}"></span>`;
        teamListHTML += `</a></div>`
    }
    const variables = {teams: teamListHTML};
    response.render("viewAllTeams", variables);
});

app.get("/viewTeam/:name", async (request, response) => {
    const name = request.params.name;
    // process.stdout.write(String(name));
    let filter = {name: name};
    const cursor = client.db(db)
        .collection(collection)
        .find(filter);
    
    const t = await cursor.toArray();
    const pokemon1 = t[0].pokemon1;
    const pokemon2 = t[0].pokemon2;
    const pokemon3 = t[0].pokemon3;
    const pokemon4 = t[0].pokemon4;
    const pokemon5 = t[0].pokemon5;
    const pokemon6 = t[0].pokemon6;
    
    const variables = {
        name: t[0].name,
        pokemon1: pokemon1,
        pokemon2: pokemon2,
        pokemon3: pokemon3,
        pokemon4: pokemon4,
        pokemon5: pokemon5,
        pokemon6: pokemon6
    };

    response.render("viewTeam", variables);
});

app.post("/deleteConfirmed", async (request, response) => {
    let filter = {name: request.body.name};
    const result = await client.db(db)
                   .collection(collection)
                   .deleteOne(filter);
    
    response.render("deleteOneTeam");
});

app.post("/deleteAllTeamsConfirmed", async (request, response) => {
    const result = await client.db(db)
        .collection(collection)
        .deleteMany({});

    const variables = {numTeams: result.deletedCount};
    response.render("deleteAllTeams", variables);
});

/* START APP */
app.listen(PORT_NUMBER);
console.log(`Web server started and running at http://localhost:${PORT_NUMBER}`);

async function main() {
    try {
        await client.connect();
    } catch (e) {
        console.error(e);
    }
}

main().catch(console.error);