const sql = require("./db");

//const sql = db.connection;
//const pool = db.pool;

// constructor
const Profile = function (profile) {
    this.name = profile.name;
    this.gender= req.body.gender;
    this.lat= req.body.lat;
    this.lng= req.body.lng;
    this.birthDate = profile.birthDate;
    this.pitch = profile.pitch;
    this.description = profile.description;
    this.email = profile.email;
    this.phone = profile.phone;
    this.createdAt= req.body.createdAt;
    this.updatedAt= req.body.updatedAt;
};

Profile.create = async (newProfile, result) => {
    try {
        await sql.query("INSERT INTO profile SET ?", newProfile, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            console.log("created profile: ", { id: res.insertId, ...newProfile });
            result(null, { id: res.insertId, ...newProfile });
        });
    } catch {
        res.json({ message: 'Internal server error' });
    }
};

Profile.findById = async (profileId, result) => {
    try {
        await sql.query(`SELECT * FROM profile WHERE id = ${profileId}`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            if (res.length) {
                console.log("found profile: ", res[0]);
                result(null, res[0]);
                return;
            }

            // not found Profile with the id
            result({ kind: "not_found" }, null);
        });
    } catch {
        res.json({ message: 'Internal server error' });
    }
};

Profile.getAll = async result => {
    try {
        await sql.query("SELECT * FROM profile", (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            console.log("Profiles: ", res);
            result(null, res);
        });
    } catch {
        res.json({ message: 'Internal server error' });
    }
};

Profile.updateById = async (id, profile, result) => {
    try {
        await sql.query(
            "UPDATE profile SET " +
            "name = ?, gender = ?, lat = ?, lng = ?, birthDate = ?, pitch = ?, description = ?, email = ?, phone = ? " +
            "WHERE id = ?",
            [
                profile.name,
                profile.gender,
                profile.lat,
                profile.lng,
                profile.birthDate,
                profile.pitch,
                profile.description,
                profile.email,
                profile.phone,
                id
            ],
            (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(null, err);
                    return;
                }

                if (res.affectedRows == 0) {
                    // not found profile with the id
                    result({ kind: "not_found" }, null);
                    return;
                }

                console.log("updated profile: ", { id: id, ...profile });
                result(null, { id: id, ...profile });
            }
        );
    } catch {
        res.json({ message: 'Internal server error' });
    }
};

Profile.remove = async (id, result) => {
    try {
        await sql.query("DELETE FROM profile WHERE id = ?", id, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Profile with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("deleted profile with id: ", id);
            result(null, res);
        });
    } catch {
        res.json({ message: 'Internal server error' });
    }
};

Profile.removeAll = async result => {
    try {
        await sql.query("DELETE FROM profile", (err, res) => {
            if (err) {
                console.log("error: ", err);
                //sql.end();
                result(null, err);
                return;
            }

            console.log(`deleted ${res.affectedRows} profiles`);
            result(null, res);
            //sql.end();
        });
    } catch {
        res.json({ message: 'Internal server error' });
    }
};

/* Profile.searchProfile = async (query) => {
    try {
        await sql.query("CALL sp_get_search_profiles(?)", [query], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            console.log(`searched ${res.affectedRows} profiles`);
            result(null, res);
        });
    } catch {
        res.json({ message: 'Internal server error' });
    }
}; */

/* Profile.updateProfile = async (query) => {
    try {
        await sql.query("CALL exists_row_in_table(?)", [query], (err, res, fields) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            console.log(`updated ${res.affectedRows} profile`);
            result(null, res[0]);
            //response.json(res[0]);
        });
    } catch {
        res.json({ message: 'Internal server error' });
    }
}; */

/* 
router.get('/search', async (req, res) => {
    try {
        await pool.connect();
        const result = await pool.request()
            .input('Name', req.query.name)
            .execute(`SearchEmployee`);
        const employees = result.recordset;

        res.json(employees);
    } catch (error) {
        res.status(500).json(error);
    }
});




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
}); */

/* app.post('/learners', (req, res) => {
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

connection.query("call procedure_name(?,?)", [param1, param2], function (err, result) {
*/

/* Profile.searchProfile = async (field, result) => {
    try {
         //var sql = "SET @profile_id = ?; CALL sp_get_search_profiles(@profile_id)";
         var sql = "CALL sp_get_search_profiles(?)";
        //await sql.query(`CALL sp_get_search_profiles('${profile_id}')`), (err, res) => {
            await sql.query(sql, [field]), (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            if (res.length) {
                console.log("found profile: ", res[0]);
                result(null, res[0]);
                return;
            }

            // not found Profile with the id
            result({ kind: "not_found" }, null);
        }
        rows = res[0]
    }
    catch {
        res.json({ message: 'Internal server error' });
    }
} */

module.exports = Profile;



/* create = async ({ username, password, first_name, last_name, email, role = Role.SuperUser, age = 0 }) => {
    const sql = 'CALL insert_data(?,?,?,?,?,?,?)';

    const result = await query(sql, [username, password, first_name, last_name, email, role, age]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
} */