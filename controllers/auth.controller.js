const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const tokenList = {};
var refreshTokensDB = [];

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    // Save User to Database
    await User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    })
        .then(user => {
            if (req.body.roles) {
                Role.findAll({
                    where: {
                        name: {
                            [Op.or]: req.body.roles
                        }
                    }
                }).then(roles => {
                    user.setRoles(roles).then(() => {
                        res.send({ message: "User was registered successfully!" });
                    });
                });
            } else {
                // user role = 1
                user.setRoles([1]).then(() => {
                    res.send({ message: "User was registered successfully!" });
                });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.signin = async (req, res) => {
    await User.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: config.tokenLife });

            const refreshToken = jwt.sign({ id: user.id }, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife });
            const response = {
                "status": "Logged in",
                "token": token,
                "refreshToken": refreshToken,
            };
            tokenList[refreshToken] = response;
            //res.status(200).json(response);

            var authorities = [];
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }
                res.status(200).send({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                    //accessToken: token,
                    refreshToken: response
                });
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

// check delete Refresh Token option
exports.delRefreshToken = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        res.json({ message: 'Invalid access token' });
    }
    else {

        var index = refreshTokensDB.indexOf(token);
        await delete refreshTokensDB[index];
        //refreshTokensDB = refreshTokensDB.filter(data => data !== token);
        res.json({ message: 'Refresh token deleted successfully' });
    }

};

// check logout option
exports.logout = async (req, res) => {
    await req.user.deleteToken(req.token, (err, user) => {
        if (err) return res.status(400).send(err);
        res.sendStatus(200);
    });
}

// check blacklist option
exports.blacklist = async (req, res, next) => {
    await verify(req.body.token)
        .then(decoded =>
            decoded.exp - parseInt(new Date().getTime() / 1000))
        .then(expiration => redis.set(req.body.token, true, 'EX', expiration));
    next();
}



