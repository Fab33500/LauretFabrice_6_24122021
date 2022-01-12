const express = require("express");

const app = express();
app.use(express.json());

const mongoose = require("mongoose");

// debug mongoose
console.log("-----------------debug mongoose-----------");
mongoose.set("debug", true);

const sauceRoutes = require("./routes/sauce");

const userRoutes = require("./routes/user");

const path = require("path");

//  Connexion à la base de donnée
mongoose
	.connect("mongodb+srv://fab33:lauret33@cluster0.tsqyq.mongodb.net/picanteBd?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

// Ajout des entetes pour les erreurs CORS
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

app.use("/api/sauces", sauceRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);

module.exports = app;
