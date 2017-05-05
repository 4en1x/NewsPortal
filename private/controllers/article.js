(function () {
  const Article = require('../models/articleModel').Article;
  let currentMaxSize = 0;

  module.exports.getTags = function (req, res) {
    Article.allTags().then(
            (response) => {
              res.send(response);
            },
            error => console.log(`Some error in MongoDB: ${error}`)
        );
  };
  module.exports.findArticles = function (req, res) {
    Article.findArticles(req.body).then(
            (response) => {
              Article.countArticles(req.body).then(
                    (response) => {
                      currentMaxSize = response;
                    },
                    error => console.log(`Some error in MongoDB: ${error}`)
                );
              res.send(response);
            },
            error => console.log(`Some error in MongoDB: ${error}`)
        );
  };
  module.exports.maxSize = function (req, res) {
    res.send(JSON.stringify(currentMaxSize));
  };
  module.exports.findById = function (req, res) {
    Article.findById(req.body.id).then(
            (response) => {
              res.send(response);
            },
            error => console.log(`Some error in MongoDB: ${error}`)
        );
  };
  module.exports.removeArticle = function (req, res) {
    Article.deleteById(req.body.id).then(
            (response) => {
              res.end();
            },
            error => console.log(`Some error in MongoDB: ${error}`)
        );
  };
  module.exports.createArticle = function (req, res) {
    const article = new Article(req.body.article);
    article.save()
            .then(
                (response) => {
                  res.end();
                },
                error => console.log(`Some error in MongoDB: ${error}`)
            );
  };
  module.exports.updateArticle = function (req, res) {
    Article.updateById(req.body.article).then(
            (response) => {
              res.end();
            },
            error => console.log(`Some error in MongoDB: ${error}`)
        );
  };
}());
