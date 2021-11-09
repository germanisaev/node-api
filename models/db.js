const mysql = require("mysql2");
const dbConfig = require("../config/db.config");


// Create a connection to the database
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  multipleStatements: true
});

const pool = mysql.createPool({
  connectionLimit: 100, //important
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  debug: false,
  multipleStatements: true,
});

// open the MySQL connection
connection.connect((error) => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

/* connection.connect((err) => {
  if (!err) {
    console.log("Db Connection Succeed");
  }
  else {
    console.log("Db connect Failed \n Error :" + JSON.stringify(err, undefined, 2));
  }
}); */

/* module.exports = connection; */

module.exports = {
  connection,
  pool
};


/*
const mssql = require('mssql');
class DBConnection {
  async getConnection() {
     try {
       return await mssql.connect({
              user: 'sa',
              password: 'sa',
              server: 'localhost',
              database: 'Demo',
              port: 1433
       });
    }
    catch(error) {
      console.log(error);
    }
  }
}
module.exports = new DBConnection();
*/