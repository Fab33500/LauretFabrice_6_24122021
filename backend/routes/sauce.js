const express = require("express");

const router = express.Router();

const sauceCtrl = require("../controllers/sauce");
const auth = require("../middleware/auth");
const isOwner = require("../middleware/isOwner");
const multer = require("../middleware/multer");

// route post sauce
router.post("/", auth, multer, sauceCtrl.createSauce);

// route get sauce
router.get("/", auth, sauceCtrl.getAllSauce);

// route get sauce id unique
router.get("/:id", auth, sauceCtrl.getOneSauce);

// route pour modifier une sauce
router.put("/:id", auth, isOwner, multer, sauceCtrl.modifySauce);

// route pour supprimer une sauce
router.delete("/:id", auth, isOwner, sauceCtrl.deleteSauce);

// route like/dislike
router.post("/:id/like", auth, sauceCtrl.likeDislike);

module.exports = router;
