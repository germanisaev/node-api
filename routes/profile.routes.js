

const { authJwt } = require("../middleware");
const controller = require("../controllers/profile.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // Create a new Profile
    app.post("/api/v1/profiles",
        [authJwt.verifyToken],
        controller.create);

    // Retrieve all Profiles
    app.get("/api/v1/profiles",
        [authJwt.verifyToken],
        controller.findAll);

    // Retrieve a single Profile with profileId
    app.get("/api/v1/profiles/:profileId",
        [authJwt.verifyToken],
        controller.findOne);

    // Update a Profile with profileId
    app.put("/api/v1/profiles/:profileId",
        [authJwt.verifyToken],
        controller.update);

    // Delete a Profile with profileId
    app.delete("/api/v1/profiles/:profileId",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.delete);

    // Delete all Profiles
    app.delete("/api/v1/profiles",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteAll);

    /* // Search Profiles By Preferences Filter
    app.get("/api/v1/searchProfile/:query",
        [authJwt.verifyToken],
        controller.searchProfile
    );

    // Search Profiles By Preferences Filter
    app.get("/api/v1/updateProfile/:query",
        //[authJwt.verifyToken],
        controller.updateProfile
    ); */
};



/*
module.exports = app => {
    const authJwt = require("../middleware/authJwt");
    const profiles = require("../controllers/profile.controller.js");

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // Create a new User
    app.post("/profiles", profiles.create);

    // Retrieve all users
    app.get("/profiles", profiles.findAll);

    // Retrieve a single User with userId
    app.get("/profiles/:profileId", profiles.findOne); // [authJwt.verifyToken],

    // Update a User with userId
    app.put("/profiles/:profileId", profiles.update);

    // Delete a User with userId
    app.delete("/profiles/:profileId", profiles.delete);

    // Create a new User
    app.delete("/profiles", profiles.deleteAll);
};
*/