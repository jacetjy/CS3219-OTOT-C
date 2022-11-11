// Import express
let express = require('express');
// Import Body parser
let bodyParser = require('body-parser');
// Import cookie parser
const cookieParser = require('cookie-parser');
// Import Mongoose
let mongoose = require('mongoose');
// Import Morgan
let morgan = require('morgan');
// Import ROLES
const ROLES_LIST = require("./config/roles_list");
const verifyRoles = require("./middleware/verifyRoles");
// Initialise the app
let app = express();

// use morgan to log at command line
app.use(morgan('combined'));

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//middleware for cookies
app.use(cookieParser());

// Connect to Mongoose and set connection variable
mongoose.connect('mongodb+srv://jace:ttesting123@cluster0.azkss3u.mongodb.net/test', { useNewUrlParser: true});
var db = mongoose.connection;

// Added check for DB connection
if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

// Setup server port
var port = process.env.PORT || 8080;

// Set default API response
app.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Hello World with Express',
    });
});

// register
app.use('/register', require('./routes/register'));
// login
app.use('/auth', require('./routes/auth'));
// refresh token
app.use('/refresh', require('./routes/refresh'))
// verifyJWT
const verifyJWT = require('./middleware/verifyJWT');
app.use(verifyJWT);

// Import contact controller
let contactController = require('./routes/contact');

// Contact routes
app.route('/contacts')
    .get(contactController.getContacts)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), contactController.postContact)
app.route('/contacts/:id')
    .get(contactController.getContact)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), contactController.updateContact)
    .delete(verifyRoles(ROLES_LIST.Admin), contactController.deleteContact);

// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running RestHub on port " + port);
});

module.exports = app;