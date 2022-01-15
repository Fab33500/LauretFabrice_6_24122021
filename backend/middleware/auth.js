// import dotenv pour utiliser les variables d'environnement
const dotenv = require("dotenv");
const result = dotenv.config();

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, process.env.JWT_PASSWORD);
		const userId = decodedToken.userId;
		req.auth = { userId };

		if (req.body.userId && req.body.userId !== userId) {
			throw "User Id non valable";
		} else {
			next();
		}
	} catch (error) {
		res.status(401).json({ error: error | "Requete non authentifiée" });
	}
};
