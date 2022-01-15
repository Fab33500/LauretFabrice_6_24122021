// Recuperation du modele
const Sauce = require("../models/Sauce");
// gére les téléchargements et modifications d'images
const fs = require("fs");

// Création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;

	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
	});

	sauce
		.save()
		.then(() => res.status(201).json({ message: "Sauce enregistré !" }))
		.catch((error) => res.status(400).json({ error }));
};

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
	// si image modifiée

	const sauceObject = req.file
		? {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
		  }
		: { ...req.body };
	console.log("----------------req");
	console.log(sauceObject);

	if (req.file) {
		// supression de l'ancienne image si image modifiée
		Sauce.findOne({ _id: req.params.id })
			.then((sauce) => {
				// Récupération de la photo existante à supprimer dans la Bd
				const filename = sauce.imageUrl.split("/images/")[1];

				// suppression de l'image dans le dossier images
				fs.unlink(`images/${filename}`, () => {
					// compare l'utilisateur qui fait la requete à user ID de la sauce

					if (!sauce) {
						return res.status(404).json({
							error: new error("Sauce non trouvée"),
						});
					}
					// verifie que la suppression est faite par le propriétaire
					if (sauce.userId !== req.auth.userId) {
						return res.status(401).json({
							error: new error("Requette non authorisée"),
						});
					}
				});
			})
			.catch((error) => res.status(500).json({ error }));
	}

	Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
		.then(() => res.status(200).json({ message: "sauce modifié !" }))
		.catch((error) => res.status(400).json({ error }));
};

// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
	// supression des images
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {
				// compare l'utilisateur qui fait la requete à user ID de la sauce
				Sauce.findOne({ _id: req.params.id }).then(() => {
					if (!sauce.userId) {
						return res.status(404).json({
							msg: "Sauce non trouvée",
						});
					}
					// verifie que la suppression est faite par le propriétaire
					else if (sauce.userId !== req.auth.userId) {
						return res.status(401).json({
							msg: "Requette non authorisée, vous n'etes pas le proprietaire de cette sauce",
						});
					}

					Sauce.deleteOne({ _id: req.params.id })
						.then(() => res.status(200).json({ msg: "Sauce supprimée" }))
						.catch((error) => res.status(400).json({ error }));
				});
			});
		})
		.catch((error) => res.status(500).json({ msg: "Cette sauce n'existe pas !" }));
};

// Récupération d'une sauce de la Bd
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => res.status(200).json(sauce))
		.catch((error) => res.status(404).json({ error }));
};

// Récupération de toutes les sauces de la Bd
exports.getAllSauce = (req, res, next) => {
	Sauce.find()
		.then((sauces) => {
			console.log(sauces);
			return res.status(200).json(sauces);
		})
		.catch((error) => res.status(400).json({ error }));
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
