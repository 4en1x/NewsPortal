const express = require('express');
const bodyParser = require('body-parser');
const db = require('diskdb');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const expressSession = require('express-session');
const SessionStore = require('connect-diskdb')(expressSession);
var options = {
    path: `${__dirname}/public/JSON`, // path where the diskDB based file should be stored
    name: 'sessions', // name of the database
};
var diskDBSessionStore = new SessionStore(options);


const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({
  name: 'login',
  secret: 'UFOSecret',
  resave: false,
  saveUninitialized: false,
    store: diskDBSessionStore
}));
app.use(passport.initialize());
app.use(passport.session({}));


db.connect(`${__dirname}/public/JSON`, ['articles', 'tags', 'users', 'images', 'order', 'sessions']);
let currentMaxSize = 0;
const articles = {};
const orderIndex = db.order.find();
const tagsIndex = db.tags.find()[0];
const images = db.images.find()[0];
const articlesFromDatabase = db.articles.find();
for (const key in articlesFromDatabase) {
  const article = articlesFromDatabase[key];
  article.id = article._id;
  articles[article._id] = article;
}

app.post('/login', (req, res, next) => {
  passport.authenticate('login',
      (err, user, info) => {
        if (user) {
          return req.logIn(user, () => {
            res.send(user.firstName);
          });
        }
        return res.end();
      }
  )(req, res, next);
}
);
app.post('/logout', (req, res) => {
  req.logout();
  res.clearCookie('login');
  res.end();
});

app.get('/', (req, res) => {
  res.sendfile('public/index.html');
});
app.post('/createArticle', (req, res) => {
  if (req.isAuthenticated()) {
    const article = db.articles.save(req.body.article);
    orderIndex.unshift(article._id);
    article.id = article._id;
    articles[article._id] = article;
    images[article._id] = req.body.url;
    addToTagIndex(article, article.id);
    toDB();
  } else {
    res.status(401);
  }
  res.end();
});
app.post('/removeArticle', (req, res) => {
  if (req.isAuthenticated()) {
    articles[req.body._id] = null;
    delete articles[req.body._id];
    removeArticleId(req.body._id, orderIndex);
    deleteFromTagIndex(req.body._id);
    delete images[req.body._id];
    db.articles.remove(req.body);
    toDB();
  } else {
    res.status(401);
  }
  res.end();
});
app.post('/updateArticle', (req, res) => {
  if (req.isAuthenticated()) {
    const article = req.body.article;
    const id = article.id;
    removeArticleId(id, orderIndex);
    orderIndex.unshift(id);
    articles[id] = article;
    deleteFromTagIndex(id);
    addToTagIndex(article, id);
    images[article.id] = req.body.url;
    db.articles.update(req.body.id, article);
    toDB();
  } else {
    res.status(401);
  }
  res.end();
});
app.post('/image', (req, res) => {
  res.send(images[req.body.id]);
});
app.get('/maxSize', (req, res) => {
  res.send(JSON.stringify(currentMaxSize));
});
app.get('/getTags', (req, res) => {
  res.send(JSON.stringify(tagsIndex));
});
app.post('/articles', (req, res) => {
  const author = req.body.author;
  const beginDate = new Date(req.body.beginDate);
  const endDate = new Date(req.body.endDate);
  let ids = filterTags(req.body.tags) || orderIndex;
  ids = ids.filter(id => articles[id].author.indexOf(author) > -1);
  ids = ids.filter(id => new Date(articles[id].createdAt) >= beginDate && new Date(articles[id].createdAt) <= endDate);
  currentMaxSize = ids.length;
  res.send(ids.map(id => articles[id])
        .slice(req.body.skip, req.body.skip + req.body.top));
});
app.post('/article', (req, res) => {
  const id = req.body.id;
  res.send(articles[id]);
});
function filterTags(tags) {
  if (!tags) return;
  let intersection = new Set(orderIndex);
  tags.forEach((tag) => {
    const commonArticles = new Set(tagsIndex[tag]);
    intersection = [...intersection].filter(x => commonArticles.has(x));
  });
  return [...intersection];
}
function addToTagIndex(article, id) {
  article.tags.forEach((tag) => {
    if (!tagsIndex[tag]) {
      tagsIndex[tag] = [id];
    } else if (tagsIndex[tag].indexOf(id) === -1) {
      tagsIndex[tag].unshift(id);
    }
  });
}
function removeArticleId(id, articleIds) {
  const index = articleIds.indexOf(id);
  if (index !== -1) articleIds.splice(index, 1);
}
function deleteFromTagIndex(id) {
  for (const key in tagsIndex) {
    removeArticleId(id, tagsIndex[key]);
    if (tagsIndex[key].length === 0) { delete tagsIndex[key]; }
  }
}
function toDB() {
  db.order.remove();
  db.loadCollections(['order']);
  db.order.save(orderIndex.reverse());
  orderIndex.reverse();

  db.images.remove();
  db.loadCollections(['images']);
  db.images.save(images);

  db.tags.remove();
  db.loadCollections(['tags']);
  db.tags.save(tagsIndex);
}

passport.serializeUser((user, done) => {
  const session = db.sessions.find()[0] || {};
  db.sessions.remove();
  db.loadCollections(['sessions']);
  session[user.sessionID] = user;
  db.sessions.save(session);
  done(null, user.sessionID);
});
passport.deserializeUser((sessionID, done) => {
  const user = db.sessions.find()[0][sessionID];
  const err = user ? null : new Error('deserializing error');
  done(err, user.sessionID);
});
passport.use('login', new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
      const user = db.users.findOne({ firstName: username });
      if (!user) {
        return done(null, false, { message: 'wrong user' });
      }
      if (password !== user.lastName) {
        return done(null, false, { message: 'wrong password.' });
      }
      user.sessionID = req.sessionID;
      return done(null, user);
    })
);

app.listen(process.env.PORT || 5000);
