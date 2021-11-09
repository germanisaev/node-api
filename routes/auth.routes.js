const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/auth/signup",
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ],
        controller.signup
    );

    app.post("/api/auth/signin", controller.signin);

    // check blacklist option
    app.post('api/auth/blacklist', controller.blacklist);

    // check logout option
    app.get("/api/auth/logout", verifySignUp.checkUserAuth, controller.logout);

    // check refresh Token option
    app.delete("api/auth/refreshToken", controller.delRefreshToken);
};