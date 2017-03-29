var express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let articles,tags,images,users,user=null;

fs.readFile(__dirname +'/public/JSON/articles.json', 'utf8', (err, data)=> {articles=data});
fs.readFile(__dirname +'/public/JSON/tags.json', 'utf8', (err, data)=> {tags=data});
fs.readFile(__dirname +'/public/JSON/images.json', 'utf8', (err, data)=> {images=data});
fs.readFile(__dirname +'/public/JSON/users.json', 'utf8', (err, data)=> {users=JSON.parse(data)});

app.get('/articles', (req, res) =>{res.send(articles);});
app.post('/articles', (req, res)=>{articles=req.body;});

app.get('/tags', (req, res) =>{res.send(tags);});
app.post('/tags', (req, res)=>{tags=req.body;});

app.get('/images', (req, res) =>{res.send(images);});
app.post('/images', (req, res)=>{images=req.body;});

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