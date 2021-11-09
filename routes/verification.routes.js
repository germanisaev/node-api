const { authJwt } = require("../middleware");
const controller = require("../controllers/verification.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // Create a new verification
    app.post("/api/v1/verification",
        [authJwt.verifyToken],
        controller.create);

    // Retrieve all verifications
    app.get("/api/v1/verification",
        [authJwt.verifyToken],
        controller.findAll);

    // Retrieve a single Profile with profileId
    app.get("/api/v1/verification/:verificationId",
        [authJwt.verifyToken],
        controller.findOne);

    // Update a Profile with profileId
    app.put("/api/v1/verification/:verificationId",
        [authJwt.verifyToken],
        controller.update);

    // Delete a Profile with profileId
    app.delete("/api/v1/verification/:verificationId",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.delete);

    // Delete all Profiles
    app.delete("/api/v1/verification",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteAll);
};