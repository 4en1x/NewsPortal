var express = require('express'),
    bodyParser = require('body-parser'),
    db = require('diskdb'),
    app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let articles,tags,images,users,user=null;
db.connect(__dirname +'/public/JSON', ['articles','tags','users','images']);
users=db.users.find();

app.get('/articles', (req, res) =>{res.send(db.articles.find());});
app.post('/articles', (req, res)=>{
    db.articles.remove();
    db.loadCollections(['articles']);
    db.articles.save(req.body);
});

app.get('/tags', (req, res) =>{res.send(db.tags.find());});
app.post('/tags', (req, res)=>{
    db.tags.remove();
    db.loadCollections(['tags']);
    db.tags.save(req.body);
});

app.get('/images', (req, res) =>{res.send(db.images.find());});
app.post('/images', (req, res)=>{
    db.images.remove();
    db.loadCollections(['images']);
    db.images.save(req.body);
});

app.post('/login', (req, res) =>{
    var customUser;
    if(customUser=users.find(param=>param.firstName===req.body.name &&param.lastName===req.body.password))
        user=customUser.firstName;
});

app.post('/logout', (req, res) =>{user=null;});

app.get('/user', (req, res)=>{
    if(user===null)
        res.status(400).send('Current password does not match');
    else {
        res.send(user);
    }
});

app.get('/', function (req, res) {
	res.sendfile('public/index.html');
});

app.listen(process.env.PORT || 5000);