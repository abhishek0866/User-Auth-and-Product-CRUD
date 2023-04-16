const sqlConnection = {
    MYSQL_HOST : process.env.MYSQL_HOST,
    MYSQL_USER : process.env.MYSQL_USER,
    MYSQL_PASSWORD : process.env.MYSQL_PASSWORD,
    MYSQL_DATABASE : process.env.MYSQL_DATABASE,
    MYSQL_DAILECT : process.env.MYSQL_DAILECT
};

const isLog = process.env.IS_LOG; // for mysql log
const isMysqlConsoleLog = process.env.IS_MYSQL_CONSOLE_LOG; // for query from mysql  

module.exports = {
    sqlConnection,
    isLog,
    isMysqlConsoleLog
};

