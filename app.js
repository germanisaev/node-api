"use strict";

const express = require('express');
const inject = require('require-all');
//const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const cors = require("cors");

const DiContainer = require('./utils/di_container');
//const config = require('./config/auth.config');

const { authJwt } = require('./middleware');
const sql = require('./models/db');
const connection = sql.connection;
const pool = sql.pool;

const corsOptions = require('./config/cors.config');
const dbConfig = require("./config/db.config");

const diContainer = new DiContainer();

const db = require("./models");
const Role = db.role;

db.sequelize.sync({ force: true }).then(() => {
    console.log('Drop and Resync Db');
    initial();
});

const app = express();

//const router = express.Router();

app.use(cors(corsOptions));

// // parse requests of content-type - application/json
app.use(bodyParser.json());

// // parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//if we are here then the specified request is not found
// app.use((req, res, next) => {
//     const err = new Error("Not Found");
//     err.status = 404;
//     next(err);
// });

// //all other requests are not implemented.
// app.use((err, req, res, next) => {
//     res.status(err.status || 501);
//     res.json({
//         error: {
//             code: err.status || 501,
//             message: err.message
//         }
//     });
// });  [authJwt.verifyToken],

/* app.post('/api/v1/insert_update', (req, res) => {
    let obj = req.body;
    var sql = "SET @query=?; CALL exists_row_in_table(@query);"
    connection.query(sql, [obj.query], (err, rows, fields) => {
        if (!err)
            res.send("Insertion Completed" + rows);
        else
            console.log(err);
    })
}); */

/* app.get('/search', async (req, res) => {
    try {
        await pool.connect();
        const result = await pool.request()
            .input('query', req.query.query)
            .execute(`exists_row_in_table`);
        const profiles = result.recordset;

        res.json(profiles);
    } catch (error) {
        res.status(500).json(error);
    }
}); */

//app.post('/api/v1/insert__update', async (req, res) => {

    /* var objJSON = req.body;
    var queryString = 'CALL exists_row_in_table(?)';
    //var pool = mysql.createPool(opts);
    connection.query(queryString, [objJSON], (error, result) => {
        if (error) {
            console.log(error)
            //pool.end();
            return;
          }
        
          console.log(result);
          res.send(result);
          //pool.end();
    }); */
    //query_str = "CALL sp_whatever(?,?,?,@output); select @output";
    /* connection.query(queryString, [objJSON], function (err, rows) {
        if (err) throw err;
        console.log(rows);
        res.send(rows);
    }); */
    /* try {
        await pool.connect();
        const result = await pool.request()
            .input('query', req.body)
            .output('message', '')
            .execute(`exists_row_in_table`);

        //const message = result.recordsets;
        const summary = {
            message: result.output.message
        };

        res.json(summary);
    } catch (error) {
        res.status(500).json(error);
    } */
    /* pool.query("CALL exists_row_in_table(?)", [objJSON], function (err, result) {
        if(err) {
            console.error(err);
            return;
        }
        // rows from SP
        console.log(result);
        res.send(result);
    }); */

    //connection.release();
    /* console.log(req.params);
    const request = new connection.Request(db);
    request.input("query", connection.json, req.params.query);
    request.execute("exists_row_in_table", (err, result) => {
        if (!err) {
            res.send(result);
            console.log(res);
          } else {
            res.send(err);
          }
          res.end();
    }); */
    // query to the database and execute procedure 
    /* let query = "exec exists_row_in_table query=" + objJSON + ";";
    console.log(query)
    request.query(query, function (err, recordset) {
        if (err) {
            console.log(err);
            connection.close();
        }
        connection.close();
        res.send(recordset);

    }); */
//});

app.get('/api/v1/insert_update/:query', (request, response) => {

    var fields = request.params.query;

    connection.query('CALL exists_row_in_table(?)', [fields], (error, result, fields) => {
        if(error) {
            throw error;
        }
        else {
            response.json(result[0]);
        }
    });
});


/* app.get('/api/v1/search', async (req, res) => {
    try {
        await pool.connect();
        const result = await pool.request()
            .input('query', req.params.query)
            .execute(`exists_row_in_table`);
        const profiles = result.recordset;

        res.json(profiles);
    } catch (error) {
        res.status(500).json(error);
    }
}); */
/* 
router.post('/available-copies', function (req, res) {
var ssn = req.body.userssn;
var password = req.body.userpassword;

sql.connect(sqlConfig, function (err) {
    if (err) console.log(err);
    // create Request object
    var request = new sql.Request();
    // query to the database and execute procedure 
    let query = "exec LoginMember @SSN='" + ssn + "', @PASSWORD='" + password + "';";
    console.log(query)
    request.query(query, function (err, recordset) {
        if (err) {
            console.log(err);
            sql.close();
        }
        sql.close();
        res.send(recordset);

    });
  });
});

app.get('/api/v1/details/:query', (request, response) => {

    var fields = request.params.query;
    connection.query('CALL exists_row_in_table(?)', [fields], (error, result, fields) => {
        if(error) {
            throw error;
        }
        else {
            response.json(result[0]);
        }
    })
}); 

app.post('/learners', (req, res) => {
    let learner = req.body;
    var sql = "SET @learner_id = ?;
               SET @learner_name = ?;
               SET @learner_email = ?;
               SET @course_Id = ?; 
               CALL learnerAddOrEdit(@learner_id,@learner_name,@learner_email,@course_Id);";
    mysqlConnection.query(sql, [learner.learner_id, 
                                learner.learner_name, 
                                learner.learner_email, 
                                learner.course_Id], (err, rows, fields) => {
    if (!err)
    rows.forEach(element => {
        if(element.constructor == Array)
            res.send('New Learner ID : '+ element[0].learner_id);
        });
        else
            console.log(err);
    })
}); 
*/

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    });
});

// app.post('/api/v1/posts', verifyToken, (req, res) => {
//     jwt.verify(req.token, config.jwtSecretKey, (err, authData) => {
//         if (err) {
//             res.sendStatus(403);
//         } else {
//             res.json({
//                 message: 'Post created...',
//                 authData
//             });
//         }
//     });
// });

// app.post('/api/v1/login', (req, res) => {

//     const user = {
//         id: 1,
//         username: 'german',
//         email: 'german.isaev@gmail.com'
//     }
//     jwt.sign({ user }, config.jwtSecretKey, { expiresIn: config.jwtExpirySeconds }, (err, token) => {
//         res.json({
//             token
//         });
//     });
// });

// function verifyToken(req, res, next) {
//     const bearerHeader = req.headers['authorization'];
//     if (typeof bearerHeader !== 'undefined') {
//         const bearer = bearerHeader.split(' ');
//         const bearerToken = bearer[1];
//         req.token = bearerToken;
//         next();
//     } else {
//         res.sendStatus(403);
//     }
// }

function initial() {
    Role.create({
        id: 1,
        name: "user"
    });
    Role.create({
        id: 2,
        name: "moderator"
    });
    Role.create({
        id: 3,
        name: "admin"
    });
}

try {
    const routers = inject(__dirname + '/routes');
    //const models = inject(__dirname, '/models');
    for (const name in routers) {
        //require(`./routes/${name}`)(app);
        diContainer.factory(`${name}`, require(`./routes/${name}`)(app));
        //app.use(`/${name}`, routers[name](router));
    }
    /* for(const model in models) {
        //require(`./routes/${name}`)(app);
        diContainer.factory(`${model}`, require(`./models/${model}`));
        //app.use(`/${name}`, routers[name](router));
    } */
}
catch (e) {
    console.error(e);
}

/* require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/profile.routes')(app);
require('./routes/send.routes')(app); */



//const diContainer = new DiContainer();
// diContainer.register('dbName', 'testdb');
// //diContainer.factory('movieSuggestion', require('./model/ms'));
// //diContainer.factory('db', require('./utils/db'));
//diContainer.factory('profile', require('./models/profile.model'));
//diContainer.factory('profileController', require('./controllers/profile.controller'));

//const controller = diContainer.get('profileController');


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});