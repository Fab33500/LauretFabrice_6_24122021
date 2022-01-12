const express = require("express");

const router = express.Router();

const sauceCtrl = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer");

// route post sauce
router.post("/", auth, multer, sauceCtrl.createSauce);

// route pour modifier une sauce
router.put("/:id", auth, multer, sauceCtrl.modifySauce);

// route pour supprimer une sauce
router.delete("/:id", auth, sauceCtrl.deleteSauce);

// route get sauce id unique
router.get("/:id", auth, sauceCtrl.getOneSauce);

// route get sauce
router.get("/", auth, sauceCtrl.getAllSauce);

// route like/dislike
router.post("/:id/like", auth, sauceCtrl.likeDislike);

module.exports = router;
