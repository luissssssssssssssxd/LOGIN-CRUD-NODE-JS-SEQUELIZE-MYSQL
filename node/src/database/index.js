const Sequelize = require('sequelize');

const dbConfig = require("../config/database.js");

const User = require('../models/Users');

const connection = new Sequelize(dbConfig);

User.init(connection);
/* 
try {
    connection.authenticate();
    console.log('Conexion establecida correctamente');
} catch (error) {
    console.error('Error en la conexion BD',error)
} */

module.exports= connection;