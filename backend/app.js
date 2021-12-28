const express = require("express");
const mongoose = require("mongoose");

const app = express();
// connexion a la base de données
mongoose
	.connect("mongodb+srv://PiicanteP6:PicanteoC2021@cluster0.shyka.mongodb.net/picante?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

// gere les erreurs CORS
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

app.use((req, res) => {
	res.json({ message: "Votre requête a bien été reçue !" });
});

module.exports = app;