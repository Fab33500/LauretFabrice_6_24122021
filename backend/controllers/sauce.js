// Recuperation du modele
const Sauce = require("../models/Sauce");
// gére les téléchargements et modifications d'images
const fs = require("fs");
const isOwner = require("../middleware/isOwner");

// Création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;

	// creation de la sauce uniquement si userId de la sauce est idendique à user Id du token

	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
		likes: 0,
		dislikes: 0,
	});

	// verifie que les conditions sont reunies pour l'enregistrement de la sauce
	if (sauceObject.userId === req.auth.userId && sauceObject.heat >= 0 && sauceObject.heat <= 10) {
		sauce
			.save()
			.then(() => res.status(201).json({ message: "Sauce enregistré !" }))
			.catch((error) => res.status(400).json({ error }));
	} else {
		const filename = sauce.imageUrl.split("/images")[1];

		// suppression de l'image dans le dossier images
		fs.unlink(`images/${filename}`, (error) => {
			if (error) throw error;
		});
		return res.status(400).json({
			msg: "Vous ne pouvez pas creer cette sauce ",
		});
	}
};

// lire toutes les sauces de la Bd
exports.getAllSauce = (req, res, next) => {
	Sauce.find()
		.then((sauces) => {
			console.log(sauces);
			return res.status(200).json(sauces);
		})
		.catch((error) => res.status(400).json({ error }));
};

// lire une sauce de la Bd
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => res.status(200).json(sauce))
		.catch((error) => res.status(404).json({ error }));
};

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			// comparaison de l'objet
			const sauceObject = req.file
				? {
						...JSON.parse(req.body.sauce),
						imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
						// heat: req.body.heat,
				  }
				: { ...req.body };

			if (isOwner) {
				if (req.file) {
					Sauce.findOne({ _id: req.params.id })
						.then(() => {
							// Récupération de la photo existante à supprimer dans la Bd
							const filename = sauce.imageUrl.split("/images")[1];

							// suppression de l'image dans le dossier images
							fs.unlink(`images/${filename}`, (error) => {
								if (error) throw error;
							});
						})
						.catch((error) => res.status(404).json({ error }));
				}

				// Mise à jour dans BDD

				// modification envoyées dans BDD
				Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
					.then(() => res.status(200).json({ msg: "sauce modifiée" }))
					.catch((error) => res.status(404).json({ error }));
			}
		})
		.catch((error) => res.status(403).json({ error }));
};

// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
	// supression des images
	Sauce.findOne({ _id: req.params.id })

		.then((sauce) => {
			const filename = sauce.imageUrl.split("/images/")[1];

			// controle l'utilisateur qui fait la requete à user ID de la sauce
			if (isOwner) {
				// fs.unlink(`images/${filename}`,
				fs.unlink(`images/${filename}`, (error) => {
					if (error) throw error;
				});

				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ msg: "Sauce supprimée" }))
					.catch((error) => res.status(400).json({ error }));
			}
		})
		.catch((error) => res.status(500).json({ msg: "Cette sauce n'existe pas !" }));
};

// like & dislike
exports.likeDislike = (req, res, next) => {
	// recupere l'objet dans la BDD
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			switch (req.body.like) {
				case 1:
					// like = +1
					// si user n'est pas dans usersLiked & si like === 1
					// methode includes pour verifier le tableau
					if (!sauce.usersLiked.includes(req.body.userId)) {
						// mise à jour BDD
						sauce
							.updateOne({
								// operateur $inc(mongodb)
								$inc: { likes: 1 },
								// operateur $push(ajoute)
								$push: { usersLiked: req.body.userId },
							})
							.then(() => res.status(201).json({ msg: "J'aime la sauce" }))
							.catch((error) => res.status(400).json({ error }));
					} else {
						return res.status(400).json({ error: "Vous avez deja aimé la sauce" });
					}
					break;

				case -1:
					// dislike: -1
					// si user n'est pas dans usersDisLiked & si dislike === -1

					if (!sauce.usersDisliked.includes(req.body.userId)) {
						// mise à jour BDD
						sauce
							.updateOne({
								// operateur $inc(mongodb)
								$inc: { dislikes: 1 },
								// operateur $push(ajoute)
								$push: { usersDisliked: req.body.userId },
							})
							.then(() => res.status(201).json({ msg: "Je n'aime pas la sauce" }))
							.catch((error) => res.status(400).json({ error }));
					} else {
						return res.status(400).json({ error: "Vous avez deja détesté la sauce" });
					}
					break;

				case 0:
					// like = 0
					// si user est pas dans usersLiked & si likes === 0 alors on decremente de 1
					if (sauce.usersLiked.includes(req.body.userId)) {
						// mise à jour BDD
						sauce
							.updateOne({
								// operateur $inc(mongodb)
								$inc: { likes: -1 },
								// operateur $pull(supprime)
								$pull: { usersLiked: req.body.userId },
							})
							.then(() => res.status(201).json({ msg: "Like sauce supprimé" }))
							.catch((error) => res.status(400).json({ error }));
					}

					// dislike = 0
					// si user est pas dans usersDisLiked & si dislikes === 0 alors on decremente de 1
					else if (sauce.usersDisliked.includes(req.body.userId)) {
						// mise à jour BDD
						sauce
							.updateOne({
								// operateur $inc(mongodb)
								$inc: { dislikes: -1 },
								// operateur $pull(supprime)
								$pull: { usersDisliked: req.body.userId },
							})
							.then(() => res.status(201).json({ msg: "Dislike sauce supprimée" }))
							.catch((error) => res.status(400).json({ error }));
					} else {
						return res.status(400).json({ error });
					}
					break;
				default:
					return res.status(400).json({ msg: "non autorisé" });
			}
		})
		.catch((error) => res.status(404).json({ error }));
};
