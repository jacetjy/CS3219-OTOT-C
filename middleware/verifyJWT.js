const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, token) => {
            if (err) return res.sendStatus(403); // invalid token
            req.user = token.UserInfo.username;
            req.roles = token.UserInfo.roles;
            next();
        }
    )
}

module.exports = verifyJWT;