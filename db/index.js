const db = require('./db')
const chalk = require('chalk');
const Sequelize = db.Sequelize;

const User = db.define('user', {
	name: Sequelize.STRING
}, {
	instanceMethods: {
		getDepartments: function(){
			let depts =[];
			this.user_departments.forEach(function(dept){
				depts.push(dept.department.get());
			});
			return depts;	
		}
	}
});

const Department = db.define('department', {
	name: Sequelize.STRING
});

const UserDepartment = db.define('user_department', {});

User.hasMany(UserDepartment);
Department.hasMany(UserDepartment);
UserDepartment.belongsTo(Department); 
UserDepartment.belongsTo(User);


const getUser = (id)=> {
	let user;
	return User.findById(id, {
		include: [
			{
				model: UserDepartment, 
				include: [ Department ]
			}
		] 
	})
	.then((_user)=> {
		user=_user;
		return Department.findAll({include: [
				{model: UserDepartment,
					include: [User]
				}
			]
		});	
	})
	.then((depts)=> {
		let deptIdBelong = user.getDepartments().map(function(dept){
			return dept.id*1;
		})
		let deptsNoBelong = depts.filter(function(dept){
			if (deptIdBelong.indexOf(dept.id) === -1)
				{return dept.id}
		});
		let color, everyDept, noDept;
		if ( deptsNoBelong.length === 0){
			color = 'gold';
			everyDept = true;
		}
		if ( deptIdBelong.length === 0 ){
			color = 'Cyan';
			noDept = true;
		}
		return {'user': user, "depts": depts, "deptsnobelong": deptsNoBelong, "color": color, "everyDept": everyDept, "noDept": noDept};
	});
};

const getAll = ()=> {
	let depts;
	let users;
	return Department.findAll()
	.then((_depts)=> {
		depts = _depts;
		return User.findAll({
			include: [{
				model: UserDepartment, 
				include: [ Department ]
			} ]
		});
	})
	.then((_users)=> {
		users = _users;
		users.forEach(function(user) {
			if (user.getDepartments().length === 0) {
				user.color = "cyan";
				user.noDept = true;

			} else if (user.getDepartments().length === depts.length) {
				user.color = "gold";
				user.everyDept = true;
			} else {
				user.color = '';
			}
		});
		return {'users': users, 'depts': depts};
	});
};

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
			UserDepartment.create({userId: Watson.id, departmentId: IT.id}),
			UserDepartment.create({userId: Watson.id, departmentId: Sales.id}),
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
		});
	})
	.then((user)=> {
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
	sync, 
	getUser,
	getAll
};



