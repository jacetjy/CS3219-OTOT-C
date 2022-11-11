const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
}

const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    var foundUser = undefined;
    for (user in usersDB.users) {
        if (refreshToken == usersDB.users[user].refreshToken) {
            foundUser = usersDB.users[user];
            break;
        }
    }
    //const foundUser = (usersDB.users).find(person => person.refreshToken === refreshToken);
    if (foundUser == undefined) return res.sendStatus(403); // forbidden

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, token) => {
            if (err || foundUser.username !== token.username) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "User Info" : {
                        "username" : token.username,
                        "roles" : roles,
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '59s'}
            );
            res.json({ accessToken })
        }
    );
}
module.exports = { handleRefreshToken };