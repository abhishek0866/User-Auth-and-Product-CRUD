const mysql = require("./mysql/connection");

(async ()=>{
    await mysql.DBInit(); // initialize mysql connection
})(); // IIFE

