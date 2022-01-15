const express = require("express");

// -------------- securite ----------------
// import helmet
const helmet = require("helmet");

//import express-mongo-sanitize
const mongoSanitize = require("express-mongo-sanitize");

// import HPP
const hpp = require("hpp");

// import morgan(loggerhttp)
const morgan = require("morgan");
// -----------------------------------------------

const app = express();
app.use(express.json());

// import dotenv pour utiliser les variables d'environnement
const dotenv = require("dotenv");
const result = dotenv.config();

const mongoose = require("mongoose");
// debug mongoose
console.log("-----------------debug mongoose-----------");
mongoose.set("debug", true);

const sauceRoutes = require("./routes/sauce");

const userRoutes = require("./routes/user");

const path = require("path");

//  Connexion à la base de donnée avec des variables d'environnement
mongoose
	.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

// Ajout des entetes pour les erreurs CORS
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

// sécurise en définissant divers en-têtes HTTP
app.use(helmet());
//assainit les entrées contre les attaques par injection de sélecteur de requête
app.use(mongoSanitize());
// protege contre les attaques par pollution des paramètres HTTP
app.use(hpp());
// log req et res
app.use(morgan("dev"));

app.use("/api/sauces", sauceRoutes);

// routage pour les images
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);

module.exports = app;
