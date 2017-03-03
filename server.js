const express = require('express');
const app = express();
const db = require('./db');
const nunjucks = require('nunjucks');
const BodyParser = require('body-parser');//bodyParser
const methodOverride = require('method-override');
const routesUsers = require('./routes/users');//look at solution.. you can put this right in app.use('/users', require('./routes/users'));
const routesDepartments = require('./routes/departments');


const path = require('path');
const User = db.models.User;//not being used?
const Dept = db.models.Department;
const UserDepartment = db.models.UserDepartment;

const noCache = process.env.NOCACHE || false;

app.use(express.static(path.join(__dirname, 'node_modules')));
app.set('view engine', 'html');
app.engine('html', nunjucks.render);
nunjucks.configure('views', { noCache: noCache});
app.use(BodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));

//i don't like this.. you're creating data-- this should be a post
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

app.use('/users', routesUsers);
app.use('/depts', routesDepartments);
			
const port = process.env.PORT || 3001;

app.listen(port, ()=> console.log(`Listening on port ${port}`))

db.seed();
