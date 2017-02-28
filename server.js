const express = require('express');
const app = express();
const db = require('./db');
const nunjucks = require('nunjucks');
const BodyParser = require('body-parser');
const methodOverride = require('method-override');


const path = require('path');
const User = db.models.User;
const Dept = db.models.Department;
const UserDepartment = db.models.UserDepartment;

const noCache = process.env.NOCACHE || false;

app.use(express.static(path.join(__dirname, 'node_modules')));
app.set('view engine', 'html');
app.engine('html', nunjucks.render);
nunjucks.configure('views', { noCache: noCache});
app.use(BodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));

app.get('/seed/', (req, res, next)=> {
	db.seed()
	.then(()=> res.redirect('/'))
	.catch(next);
});

app.get('/', (req, res, next)=> {
	db.getAll()
	.then((data)=> {
		res.render("index", data);
	})	
	.catch(next);
});
			
app.get('/users/:id', (req, res, next)=> {
	db.getUser(req.params.id)
	.then((user)=> {
		res.render('user', user)
	})
	.catch(next);
});

app.post('/users', (req, res, next)=> {
	User.findOrCreate({where: {name: req.body.name }})
	.then(()=> res.redirect('/'))
	.catch(next);
});

app.delete('/users/:id', (req, res, next)=> {
	UserDepartment.destroy({where: {userId: req.params.id}})
	.then(()=> {
		return User.destroy({where: {id: req.params.id}})
	})	
	.then(()=> res.redirect('/'))
	.catch(next);
});

app.post('/users/:userId/department/:deptId', ((req, res, next)=> {
	UserDepartment.create({userId: req.params.userId, departmentId: req.params.deptId})
	.then(()=> res.redirect('/users/' + req.params.userId))
	.catch(next);
}));

app.delete('/users/:userId/department/:deptId', ((req, res, next)=> {
	UserDepartment.destroy({where: {userId: req.params.userId, departmentId: req.params.deptId}})
	.then(()=> res.redirect('/users/' + req.params.userId))
	.catch(next);
}));

app.post('/depts', (req, res, next)=> {
	Dept.findOrCreate({where: {name: req.body.name }})
	.then(()=> res.redirect('/'))
	.catch(next);
});

app.delete('/depts/:id',(req, res, next)=>{
	UserDepartment.destroy({where: {departmentId: req.params.id}})
	.then(()=> {
		return Dept.destroy({where: {id: req.params.id}});	
	})
	.then(()=> res.redirect('/'))
	.catch(next);
});


const port = process.env.PORT || 3001;

app.listen(port, ()=> console.log(`Listening on port ${port}`))

db.seed();