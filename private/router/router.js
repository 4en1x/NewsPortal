const express = require('express');
const passport = require('../passport/passport.js');
const mustAuthenticatedMw = require('../middlewares/must-authenticated');
const userController = require('../controllers/user');
const articleController = require('../controllers/article');

const router = express.Router();

router.post('/login', passport.authenticate('local'), userController.login);
router.delete('/logout', userController.logout);
router.get('/user', userController.user);

router.get('/getTags', articleController.getTags);
router.post('/articles', articleController.findArticles);
router.get('/maxSize', articleController.maxSize);
router.post('/article', articleController.findById);
router.delete('/article', mustAuthenticatedMw, articleController.removeArticle);
router.post('/createArticle', mustAuthenticatedMw, articleController.createArticle);
router.put('/article', mustAuthenticatedMw, articleController.updateArticle);
router.get('/', (req, res) => {
  res.sendfile('public/index.html');
});

module.exports = router;
