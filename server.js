const express = require('express');
const app = express();
const db = require('./db');
const nunjucks = require('nunjucks');
const BodyParser = require('body-parser');
const methodOverride = require('method-override');


const path = require('path');
const User = db.models.User;
const Dept = db.models.Department;

const noCache = process.env.NOCACHE || false;

app.use(express.static(path.join(__dirname, 'node_modules')));
app.set('view engine', 'html');
app.engine('html', nunjucks.render);
nunjucks.configure('views', { noCache: noCache});
app.use(BodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));


app.get('/', (req, res, next)=> {
	let depts;
	Dept.findAll()
	.then((_depts)=> {
		depts = _depts;
		return User.findAll()
	})
	.then((users)=> {
		res.render("index", {users: users, depts: depts});
	})
	.catch(next);
	
});

app.post('/users', (req, res, next)=> {
	User.findOrCreate({where: {name: req.body.name }})
	.then(()=> res.redirect('/'))
	.catch(next);
});

app.delete('/users/:id',(req, res, next)=>{
	User.destroy({where: {id: req.params.id}})
	.then(()=> res.redirect('/'))
	.catch(next);
});

app.post('/depts', (req, res, next)=> {
	Dept.findOrCreate({where: {name: req.body.name }})
	.then(()=> res.redirect('/'))
	.catch(next);
});

app.delete('/depts/:id',(req, res, next)=>{
	Dept.destroy({where: {id: req.params.id}})
	.then(()=> res.redirect('/'))
	.catch(next);
});







const port = process.env.PORT || 3001;

app.listen(port, ()=> console.log(`Listening on port ${port}`))

db.seed();