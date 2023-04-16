const { Sequelize } = require('sequelize');
const { sqlConnection, isMysqlConsoleLog } = require('../../../../env');

const dbConn = {};

const DBInit = async () => {
    try {
        const sequelize = new Sequelize(
            sqlConnection.MYSQL_DATABASE,
            sqlConnection.MYSQL_USER,
            sqlConnection.MYSQL_PASSWORD, {
            host: sqlConnection.MYSQL_HOST,
            dialect: sqlConnection.MYSQL_DAILECT,
            logging(query) {
                if (isMysqlConsoleLog) {
                    console.log('query : ', query);
                }
            },
        },
        );

        dbConn.Sequelize = Sequelize;
        dbConn.sequelize = sequelize;

        dbConn.sequelize.authenticate().then(() => {
            console.log('Connection has been established successfully : ');
        }).catch(err => {
            console.error('Unable to connect to the database:', err);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = {
    DBInit,
    dbConn,
};

