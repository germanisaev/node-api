const Verification = require("../models/verification.model");

// Create and Save a new Verification
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Verification
    const verification = new Verification({
        email: req.body.email,
        phone: req.body.phone,
        code: req.body.code,
        time: req.body.time,
        counter: req.body.counter
    });

    // Save Verification in the database
    Verification.create(verification, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Verification."
            });
        else res.send(data);
    });
};

// Retrieve all Verifications from the database.
exports.findAll = (req, res) => {
    Verification.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Verifications."
            });
        else res.send(data);
    });
};

// Find a single Verification with a verificationId
exports.findOne = (req, res) => {
    Verification.findById(req.params.verificationId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Verification with id ${req.params.verificationId}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Verification with id " + req.params.verificationId
                });
            }
        } else res.send(data);
    });
};

// Update a Verification identified by the verificationId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Verification.updateById(
        req.params.verificationId,
        new Verification(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Verification with id ${req.params.verificationId}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Verification with id " + req.params.verificationId
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Verification with the specified verificationId in the request
exports.delete = (req, res) => {
    Verification.remove(req.params.verificationId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Verification with id ${req.params.verificationId}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Verification with id " + req.params.verificationId
                });
            }
        } else res.send({ message: `Verification was deleted successfully!` });
    });
};

// Delete all Verifications from the database.
exports.deleteAll = (req, res) => {
    Verification.removeAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Verifications."
            });
        else res.send({ message: `All Verifications were deleted successfully!` });
    });
};