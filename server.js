require('rootpath');
var path = require('path');
var appDir = path.dirname(require.main.filename);
var compression = require('compression');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('./_helpers/jwt');
const errorHandler = require('./_helpers/error-handler');
const config = require('./config.json');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(compression());


// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/users', require('./users/users.controller'));
app.use('/posts', require('./posts/posts.controller'));
app.use('/events', require('./events/events.controller') )

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
    console.info(config.connectionString);
});
