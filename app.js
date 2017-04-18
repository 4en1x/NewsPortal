const express = require('express');
const bodyParser = require('body-parser');
const db = require('diskdb');
const fs=require('fs');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.connect(`${__dirname}/public/JSON`, ['articles', 'tags', 'users', 'images','order']);
const users = db.users.find();
let user = null;

app.get('/articles', (req, res) => {
  res.send(db.articles.find()[0]);
});
app.post('/articles', (req, res) => {
  db.articles.remove();
  db.loadCollections(['articles']);
  db.articles.save(req.body);
  res.end();
});

app.get('/tags', (req, res) => { res.send(db.tags.find()[0]); });
app.post('/tags', (req, res) => {
  db.tags.remove();
  db.loadCollections(['tags']);
  db.tags.save(req.body);
  res.end();
});

app.get('/order', (req, res) => {
  res.send(db.order.find());
});
app.post('/order', (req, res) => {
    db.order.remove();
    db.loadCollections(['order']);
    db.order.save(req.body);
    res.end();
});



app.get('/images', (req, res) => { res.send(db.images.find()[0]); });
app.post('/images', (req, res) => {
  db.images.remove();
  db.loadCollections(['images']);
  db.images.save(req.body);
  res.end();
});

app.post('/login', (req, res) => {
  const customUser = users.find(param => param.firstName === req.body.name && param.lastName === req.body.password);
  if (customUser) { user = customUser.firstName; }
  res.status(200).end();
});

app.post('/logout', (req, res) => { user = null; res.status(200).end(); });

app.get('/user', (req, res) => {
  if (user === null) { res.status(400).send('Current password does not match'); } else {
    res.send(user);
  }
});

app.get('/', (req, res) => {
  res.sendfile('public/index.html');
});







app.listen(process.env.PORT || 5000);
