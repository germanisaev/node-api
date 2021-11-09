const Profile = require("../models/profile.model");

// Create and Save a new Profile
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Profile
    const profile = new Profile({
        name: req.body.name,
        gender: req.body.gender,
        lat: req.body.lat,
        lng: req.body.lng,
        birthDate: req.body.birthDate,
        pitch: req.body.pitch,
        description: req.body.description,
        email: req.body.email,
        phone: req.body.phone,
        createdAt: req.body.createdAt,
        updatedAt: req.body.updatedAt
    });

    // Save Profile in the database
    Profile.create(profile, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Profile."
            });
        else res.send(data);
    });
};

// Retrieve all Profiles from the database.
exports.findAll = (req, res) => {
    Profile.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving profiles."
            });
        else res.send(data);
    });
};

// Find a single Profile with a profileId
exports.findOne = (req, res) => {
    Profile.findById(req.params.profileId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Profile with id ${req.params.profileId}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Profile with id " + req.params.profileId
                });
            }
        } else res.send(data);
    });
};

// Update a Profile identified by the profileId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Profile.updateById(
        req.params.profileId,
        new Profile(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Profile with id ${req.params.profileId}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Profile with id " + req.params.profileId
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Profile with the specified profileId in the request
exports.delete = (req, res) => {
    Profile.remove(req.params.profileId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Profile with id ${req.params.profileId}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Profile with id " + req.params.profileId
                });
            }
        } else res.send({ message: `Profile was deleted successfully!` });
    });
};

// Delete all Profiles from the database.
exports.deleteAll = (req, res) => {
    Profile.removeAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all profiles."
            });
        else res.send({ message: `All Profiles were deleted successfully!` });
    });
};

// Search Profiles by Stored Procedure from the database.
/* exports.searchProfile = (req, res) => {
    Profile.searchProfile(req.params.query, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Profile with id ${req.params.query}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Profile with id " + req.params.query
                });
            }
        } else res.json(data[0]);
    });
}; */

// Insert_Update Profile by Stored Procedure from the database.
/* exports.updateProfile = (request, response) => {
    Profile.updateProfile(request.params.query, (error, result) => {
        if (error) {
            if (error.kind === "not_found") {
                response.status(404).send({
                    message: `Not found Profile with id ${request.params.query}.`
                });
            } else {
                response.status(500).send({
                    message: "Error retrieving Profile with id " + request.params.query
                });
            }
        } else response.json(result[0]);
    });
}; */

/* app.get('/api/v1/details/:query', (request, response) => {

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