const app = require('express').Router();
const db = require('../db');
const User = db.models.User;
const UserDepartment = db.models.UserDepartment;

app.post('/', (req, res, next)=> {
	User.findOrCreate({where: {name: req.body.name }})
	.then(()=> res.redirect('/'))
	.catch(next);
});

app.get('/:id', (req, res, next)=> {
	db.getUser(req.params.id)
	.then((user)=> {
		res.render('user', user)
	})
	.catch(next);
});

app.delete('/:id', (req, res, next)=> {
	UserDepartment.destroy({where: {userId: req.params.id}})
	.then(()=> {
		return User.destroy({where: {id: req.params.id}})
	})	
	.then(()=> res.redirect('/'))
	.catch(next);
});

app.post('/:userId/department/:deptId', ((req, res, next)=> {
	UserDepartment.create({userId: req.params.userId, departmentId: req.params.deptId})
	.then(()=> res.redirect('/users/' + req.params.userId))
	.catch(next);
}));

app.delete('/:userId/department/:deptId', ((req, res, next)=> {
	UserDepartment.destroy({where: {userId: req.params.userId, departmentId: req.params.deptId}})
	.then(()=> res.redirect('/users/' + req.params.userId))
	.catch(next);
}));


module.exports = app;