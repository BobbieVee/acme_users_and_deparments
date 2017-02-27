const db = require('./db')
const chalk = require('chalk');
const Sequelize = db.Sequelize;


const User = db.define('user', {
	name: Sequelize.STRING
}, {
	instanceMethods: {
		getDepartments: function(){
			let depts =[];
			// console.log("***test = ", this)
			// return UserDepartment.findAll({where: {userId: this.id}
			this.user_departments.forEach(function(dept){
				depts.push(dept.department.get())
			});
			return depts;		;	
			}
	
		}
	}
);

const Department = db.define('department', {
	name: Sequelize.STRING
});

const UserDepartment = db.define('user_department', {});

User.hasMany(UserDepartment);
Department.hasMany(UserDepartment);
UserDepartment.belongsTo(Department); 
UserDepartment.belongsTo(User);

const sync = () => db.sync({force: true});



const seed = () => {
	let _Watson;
	return sync()
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
			}),
			Department.create({
				name: 'HR'
			}),
			Department.create({
				name: 'Sales'
			}),
			Department.create({
				name: 'IT'
			})
		]);
	}) 
	.spread((Watson, Sherlock, Bobby, HR, Sales, IT)=>{
		_Watson = Watson;
		return Promise.all([
			UserDepartment.create({userId: Watson.id, departmentId: HR.id}),
			UserDepartment.create({userId: Watson.id, departmentId: Sales.id}),
			UserDepartment.create({userId: Sherlock.id, departmentId: HR.id}),
			UserDepartment.create({userId: Bobby.id, departmentId: HR.id}),
			UserDepartment.create({userId: Bobby.id, departmentId: IT.id})
		]);
	}) 
	
	.then((result)=> {
		console.log(chalk.blue('Synched and seeded!!!!'));
		return User.findById( _Watson.id, {
			include: [{
				model: UserDepartment, 
				include: [ Department ]
			} ]
		})

		
	})
	.then((user)=> {
		// console.log('user = ', user.user_departments[0].department.get())
		// console.log('user.getDepartments = ', user.getDepartments());
	})
	.catch((err)=> {
		console.log(err);
	});
	
};

module.exports = {
	models: {
		User,
		Department,
		UserDepartment
	},
	seed,
	sync
};



