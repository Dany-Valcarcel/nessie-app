/* EXPRESS APP */
const PORT_NUMBER = 4000;
const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const API_KEY = "74274ef21ad66e34ff8b5c3f90397a52";
const API_URL = "http://api.nessieisreal.com";
const NESSIE_ID = "660083c39683f20dd5189920";
const CARD_ACCOUNT = "66008a739683f20dd5189924";
const SAVINGS_ACCOUNT = "6601cc1d9683f20dd5189938";
const APPLE = "57cf75cea73e494d8675ec49";

var lat = null;
var lng = null;
var rad = null;

app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname + '/style'));
app.use(express.static(__dirname + '/assets'));
app.use(express.json());

// Home Page
app.get("/", (request, response) => { 
    response.render("index");
});

app.get("/searchATMs", (request, response) => { 
    response.render("searchATMs");
});

app.get("/addAccount", (request, response) => { 
    response.render("addAccount");
});

app.post("/accountCreated", async (request, response) => { 
    const {
        type,
        nickname,
        rewards,
        balance
    } = request.body;

    const newAccount = {
        type: type,
        nickname: nickname,
        rewards: parseInt(rewards),
        balance: parseInt(balance)
    };

    let res = await fetch(`${API_URL}/customers/${NESSIE_ID}/accounts?key=${API_KEY}`, {
        method: "POST",
        body: JSON.stringify(newAccount),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
      });

    let account = await res.json();
    
    response.render("accountCreated", account["objectCreated"]);
});

app.get("/addBill", (request, response) => { 
    response.render("addBill");
});

app.post("/billCreated", async (request, response) => { 
    const {
        nickname,
        payee,
        payment_date,
        recurring_date,
        payment_amount
    } = request.body;

    const newBill = {
        status: "pending",
        nickname: nickname,
        payee: payee,
        payment_date: payment_date,
        recurring_date: parseInt(recurring_date),
        payment_amount: parseInt(payment_amount)
    };

    let res = await fetch(`${API_URL}/accounts/${CARD_ACCOUNT}/bills?key=${API_KEY}`, {
        method: "POST",
        body: JSON.stringify(newBill),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
      });

    let bill = await res.json();
    
    response.render("billCreated", bill["objectCreated"]);
});

app.get("/addPurchase", (request, response) => { 
    response.render("addPurchase");
});

app.post("/purchaseCreated", async (request, response) => { 
    const {
        purchase_date,
        amount,
        description
    } = request.body;

    const newPurchase = {
        merchant_id: APPLE,
        status: "pending",
        medium: "balance",
        purchase_date: purchase_date,
        amount: parseInt(amount),
        description: description
    };

    let res = await fetch(`${API_URL}/accounts/${CARD_ACCOUNT}/purchases?key=${API_KEY}`, {
        method: "POST",
        body: JSON.stringify(newPurchase),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
      });

    let purchase = await res.json();
    
    response.render("purchaseCreated", purchase["objectCreated"]);
});

app.get("/viewPurchases", async (request, response) => { 
    const res = await fetch(`${API_URL}/accounts/${CARD_ACCOUNT}/purchases?key=${API_KEY}`);
        
    const purchases = await res.json();
    let listHTML = "";
    for (let p of purchases) {
        listHTML += `<p>Purchase ID: ${p._id} | Amount: ${p.amount} | Purchase Date: ${p.purchase_date} | Status: ${p.status}</p>`;
    }

    if (listHTML.length == 0) {
        listHTML += `<p>No Purchases Made!</p>`;
    }

    const variables = {purchases: listHTML};
    response.render("viewPurchases", variables);
});

app.get("/addTransfer", (request, response) => { 
    response.render("addTransfer");
});

app.post("/transferCreated", async (request, response) => { 
    const {
        transaction_date,
        amount,
        description
    } = request.body;

    const newTransfer = {
        payee_id: SAVINGS_ACCOUNT,
        status: "pending",
        medium: "balance",
        transaction_date: transaction_date,
        amount: parseInt(amount),
        description: description
    };

    let res = await fetch(`${API_URL}/accounts/${CARD_ACCOUNT}/transfers?key=${API_KEY}`, {
        method: "POST",
        body: JSON.stringify(newTransfer),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
      });

    let transfer = await res.json();
    
    response.render("transferCreated", transfer["objectCreated"]);
});

app.get("/getATMs", async (request, response) => { 
    if (request.query.lat != null) {
        lat = request.query.lat;
    }
    if (request.query.lng != null) {
        lng = request.query.lng;
    }
    if (request.query.rad != null) {
        rad = request.query.rad;
    }
    let pages = 0;
    let res = await fetch(`${API_URL}/atms?lat=${lat}&lng=${lng}&rad=${rad}&key=${API_KEY}`);
    let data = await res.json();
    let atms = [];

    while (data.data.length > 0) {
        pages = pages + 1;
        for (let item of data.data) {
            atms.push({"name": item.name, "amount_left": item.amount_left})
        }
        res = await fetch(API_URL + `${data.paging.next}`);
        data = await res.json();
    }
    console.log(atms);

    let atmListHTML = "";
    if (pages == 0) {
        atmListHTML = `<p>No ATMs Found!</p>`;
    } else {
        for (let a of atms) {
            atmListHTML += `<p>Name: ${a.name}, Amount Left: ${a.amount_left}</p>`;
        }
    }

    const newPage = {
        lat: lat,
        lng: lng,
        rad: rad,
        pages: pages,
        atmListHTML: atmListHTML
    };

    response.render("getATMs", newPage);
});

app.get("/customerProfile", async (request, response) => { 
    let customerRes = await fetch(`${API_URL}/customers/${NESSIE_ID}?key=${API_KEY}`);
    let customer = await customerRes.json();

    const variables = {
        customer: customer
    };

    response.render("customerProfile", variables);
});

app.get("/viewCard", async (request, response) => { 
    let cardRes = await fetch(`${API_URL}/enterprise/accounts/${CARD_ACCOUNT}?key=${API_KEY}`);
    let card = await cardRes.json();

    const variables = {
        card: card
    };

    response.render("viewCard", variables);
});

app.post("/deleteConfirm", async (request, response) => {
    await fetch(`${API_URL}/data?type=Purchases&key=${API_KEY}`, { 
        method: 'DELETE', 
        headers: {
            'Content-type': 'application/json'
        } 
    });

    response.render("deleteConfirm");
});

/* START APP */
app.listen(PORT_NUMBER);
console.log(`Web server started and running at http://localhost:${PORT_NUMBER}`);

async function main() {}

main().catch(console.error);