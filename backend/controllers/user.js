// import

//  variables d'environnement
const dotenv = require("dotenv").config();

// hash du mot de passe
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//chiffre email
const cryptoJs = require("crypto-js");

const User = require("../models/User");

exports.signup = (req, res, next) => {
	const emailCryptoJs = cryptoJs.HmacSHA256(req.body.email, process.env.CRYPTOJS_EMAIL).toString();

	bcrypt
		.hash(req.body.password, 10)
		.then((hash) => {
			const user = new User({
				email: emailCryptoJs,
				password: hash,
			});
			user.save()
				.then(() => res.status(201).json({ message: "Utilisateur créé !" }))
				.catch((error) => res.status(400).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
	// chiffrer l'email de la requette pour le comparer à l'email chiffré dans la BDD
	const emailCryptoJs = cryptoJs.HmacSHA256(req.body.email, process.env.CRYPTOJS_EMAIL).toString();

	User.findOne({ email: emailCryptoJs })
		.then((user) => {
			if (!user) {
				return res.status(401).json({ error: "Utilisateur non trouvé !" });
			}
			bcrypt
				.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) {
						return res.status(401).json({ error: "Mot de passe incorrect !" });
					}
					res.status(200).json({
						userId: user._id,
						token: jwt.sign({ userId: user._id }, process.env.JWT_PASSWORD, { expiresIn: "24h" }),
					});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
