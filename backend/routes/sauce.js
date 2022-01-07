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
router.get("/:id", auth, multer, sauceCtrl.getOneSauce);

// route get sauce
router.get("/", auth, multer, sauceCtrl.getAllSauce);

module.exports = router;
