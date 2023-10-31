const express = require("express");
const router = express.Router();
const {
  getproject,
  postproject,
  updateproject,
  deleteproject,
  postProjectIcon,
  postMultipleImages,
  getMultipleImages,
  postAudioFile,
  postMultipleAudios,
  getMultipleAudios
    } = require("../controllers/project.controllers");

router.get("/projectregister", getproject);
router.post("/projectregister", postproject);

router.get("/projectlogout", (req, res) => {
  req.logout((err) => {
    if (err) {
      res.json({ error: err });
    } else res.redirect("/");
  });
});

router.patch("/projectupdate-profile",  updateproject);
router.delete("/projectdelete/:id", deleteproject);


// upload images
const {uploadProfileImage, uploadAudioFile} = require("../middlewares/image.middleware")
const {
  getMediaPage
  } = require("../controllers/project.controllers");
  
  // router.get('/media-pages', getMediaPage)
router.post('/upload/single_image/:id', uploadProfileImage.single('image'), postProjectIcon);
router.post('/upload/multiple_image/:id', uploadProfileImage.array('images', 5), postMultipleImages);
router.get('/multiple_image/:id', getMultipleImages)

router.post('/upload/audio/:id', uploadAudioFile.single('audio'), postAudioFile);
router.post('/upload/multiple_audio/:id', uploadAudioFile.array('audio',5), postMultipleAudios);
router.get('/multiple_audio/:id', getMultipleAudios)



module.exports = router;