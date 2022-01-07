const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	// delete sauceObject._id;
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
	});
	sauce
		.save()
		.then(() => res.status(201).json({ message: "Sauce enregistré !" }))
		.catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
	// remplacement de l'image
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {
				// si image changée
				const sauceObject = req.file
					? {
							...JSON.parse(req.body.sauce),
							imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
					  }
					: { ...req.body };

				Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
					.then(() => res.status(200).json({ msg: "Sauce modifiée" }))
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(500).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
	// supression des images
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {
				// compare l'utilisateur qui fait la requete à user ID de la sauce
				Sauce.findOne({ _id: req.params.id }).then(() => {
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
					Sauce.deleteOne({ _id: req.params.id })
						.then(() => res.status(200).json({ msg: "Sauce supprimée" }))
						.catch((error) => res.status(400).json({ error }));
				});
			});
		})
		.catch((error) => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => res.status(200).json(sauce))
		.catch((error) => res.status(404).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
	Sauce.find()
		.then((sauces) => {
			console.log(sauces);
			return res.status(200).json(sauces);
		})
		.catch((error) => res.status(400).json({ error }));
};
