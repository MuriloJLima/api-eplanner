const Sequelize = require('sequelize');

const connection = new Sequelize(
    'eplanner', 
    'root',
    '',
    {
        host:'localhost',
        dialect:'mysql',
        timezone: '-03:00',
    }
);

module.exports = connection;