const Sequelize = require('sequelize');
//test1 is the name of the schema 
const db = new Sequelize('test1', 'postgres', 'demo', {
    dialect: 'postgres'
  });

  
  const User = db.define('user', {
    id: {type:Sequelize.UUID, primaryKey: true,defaultValue: Sequelize.UUIDV4},
    email: {type:Sequelize.STRING,unique: true,allowNull: false},
    password: {type:Sequelize.STRING,allowNull: false}
  });

  /*db.sync({force : true}).then(() => {
      User.create({
          email: 'bana@gmail.com',
          password: '1234'
      })
  })*/
  
//   User.create({
//     email: 'eana@gmail.com',
//     password: '1234'
// })



  exports = module.exports = {User}