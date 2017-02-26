const db = require('./db')
const chalk = require('chalk');
const Sequelize = db.Sequelize;


const User = db.define('user', {
	name: Sequelize.STRING
});

const Department = db.define('department', {
	name: Sequelize.STRING
});

const UserDepartment = db.define('user_department', {});

User.hasMany(UserDepartment);
Department.hasMany(UserDepartment);
UserDepartment.belongsTo(User);
UserDepartment.belongsTo(Department);



const sync = () => db.sync({force: true});

const seed = () => {
	sync()
	.then(()=> {
		console.log(chalk.blue('Synched, Baby!'));
		return Promise.all([
			User.create({
				name: 'Watson'
			}),
			User.create({
				name: 'Sherlock'
			}),
			User.create({
				name: 'Bobby'
			})

		]);
	}) 
	.then(()=>{
		return Promise.all([
			Department.create({
				name: 'HR'
			}),
			Department.create({
				name: 'Sales'
			}),
			Department.create({
				name: 'IT'
			})

		])
	})
	.then(()=> {
		return Promise.all([
			UserDepartment.create({
				userId: 1,
				departmentId: 1	
			}),
			UserDepartment.create({
				userId: 1,
				departmentId: 2	
			}),
			UserDepartment.create({
				userId: 2,
				departmentId: 1	
			}),
			UserDepartment.create({
				userId: 3,
				departmentId: 1	
			}),
			UserDepartment.create({
				userId: 3,
				departmentId: 3	
			})

		])
	})
	.then(()=> {

		console.log(chalk.blue('Seeded, too.  oh!'));
}) 
	.catch(e => console.log(e));
}

module.exports = {
	models: {
		User,
		Department
	},
	seed,
	sync
};



