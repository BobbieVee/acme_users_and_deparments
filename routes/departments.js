const app = require('express').Router();
const db = require('../db');
const Department = db.models.Department;
const UserDepartment = db.models.UserDepartment


app.post('/', (req, res, next)=> {
	Department.findOrCreate({where: {name: req.body.name }})
	.then(()=> res.redirect('/'))
	.catch(next);
});

app.delete('/:id',(req, res, next)=>{
  //good
	UserDepartment.destroy({where: {departmentId: req.params.id}})
	.then(()=> {
		return Department.destroy({where: {id: req.params.id}});	
	})
	.then(()=> res.redirect('/'))
	.catch(next);
});

module.exports = app;
