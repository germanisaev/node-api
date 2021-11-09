const sql = require("./db");

// constructor
const Verification = function (user) {
    this.email = user.email;
    this.phone = user.phone;
    this.code = user.code;
    this.time = user.time;
    this.counter = user.counter;
};

Verification.create = async (userData, result) => {
    await sql.query("INSERT INTO verification SET ?", userData, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created verification: ", { id: res.insertId, ...userData });
        result(null, { id: res.insertId, ...userData });
    });
};

Verification.findById = async (sendId, result) => {
    await sql.query(`SELECT * FROM verification WHERE id = ${sendId}`, (err, res) => {
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

        // not found verification with the id
        result({ kind: "not_found" }, null);
    });
};

Verification.getAll = async result => {
    await sql.query("SELECT * FROM verification", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("verifications: ", res);
        result(null, res);
    });
};

Verification.updateById = async (id, verification, result) => {
    await sql.query(
        "UPDATE verification SET " +
        "email = ?, phone = ?, " +
        "code = ?, time = ?, counter = ? " +
        "WHERE id = ?",
        [
            verification.email,
            verification.phone,
            verification.code,
            verification.time,
            verification.counter,
            id
        ],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found verification with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated verification: ", { id: id, ...send });
            result(null, { id: id, ...send });
        }
    );
};

Verification.remove = async (id, result) => {
    await sql.query("DELETE FROM verification WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found verification with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted verification with id: ", id);
        result(null, res);
    });
};

Verification.removeAll = async result => {
    await sql.query("DELETE FROM verification", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log(`deleted ${res.affectedRows} verifications`);
        result(null, res);
    });
};

module.exports = Verification;