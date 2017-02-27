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
	let depts;
	let users;
	Dept.findAll()
	.then((_depts)=> {
		depts = _depts;
		return User.findAll({
			include: [{
				model: UserDepartment, 
				include: [ Dept ]
			} ]
		});
	})
	.then((_users)=> {
		users = _users;
		// return UserDepartment.findAll({include: [User]}	)
	// })
	// .then((userDepts) => {
		// console.log('users = ', users[0].user_departments[0].department.get())
		res.render("index", {users: users, depts: depts});
	})
	.catch(e => console.log(e));
			
app.get('/users/:id', (req, res, next)=> {
	console.log('id = ', req.params.id)
	User.findById(req.params.id, {
		include: [
			{
				model: UserDepartment, 
				include: [ Dept ]
			}
		] 
	})
	.then((user)=> {
		console.log('user = ', user);
		res.render('user', {user: user})
	})
})

	
	
	
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