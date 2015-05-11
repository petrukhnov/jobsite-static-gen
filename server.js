var fs             = require('fs');
var gulp           = require('gulp');
var express        = require('express');
var bodyParser     = require('body-parser');
var expressWinston = require('express-winston');
var winston        = require('winston');

require('./gulpfile.js');
var ENV         = process.env.TFOX_ENV;
var DEPLOY_TASK = 'deploy';

var PORT   = process.env.JOBSITE_GENERATOR_PORT || 8080;
var SECRET = process.env.PRISMIC_SECRET;
var APIURL = process.env.PRISMIC_APIURL;
var DEBUG  = process.env.JOBSITE_GENERATOR_DEBUG;

var TYPE   = "api-update";
var app    = module.exports = express();

debug('Debug logging enabled');

// parse json on all requests
app.use(bodyParser.json());

var logDirectory = __dirname + '/log';
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// add request body to logging
expressWinston.requestWhitelist.push('body');

// request logging
app.use(expressWinston.logger({
    transports: [
        new winston.transports.DailyRotateFile({
            filename: logDirectory + '/access'
        })
    ]
}));

app.get('/healthcheck', function (req, res, next) {
    res.send('OK');
});

app.post('/prismic-hook', function (req, res, next) {
    if (DEBUG) {
        debug('Got a request, headers:', req.headers, ', body:', req.body);
    }

    var secret = req.body.secret;
    var apiUrl = req.body.apiUrl;
    var type   = req.body.type;
    if (secret === SECRET && apiUrl === APIURL && type === TYPE) {
        debug('Starting deployment to', ENV);
        gulp.start(DEPLOY_TASK, function(err) {
            if (err === null) {
                res.json(req.body);
            } else {
                res.status(500);
                next(new Error('Website build failed.'));
            }
            debug('Deployment to', ENV, 'done');
        });
    } else {
        res.status(400);
        next(new Error('Invalid POST data on prismic hook.'));
    }
});

// TODO add hook for app upgrade via Gitlab webhook
// app.use('/gitlab-hook', function (req, res, next) {});

// handling non-matching routes
app.use(function(req, res, next) {
    res.sendStatus(404);
});

// error handler
app.use(function(err, req, res, next) {
    res.json({error: err.message});
});

// error logging
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.DailyRotateFile({
            filename: logDirectory + '/error'
        })
    ]
}));

var server   = app.listen(PORT, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server listening at http://%s:%s', host, port);
});

function debug(arg1 /*...*/) {
    if (DEBUG) {
        console.log.apply(console, arguments);
    }
}
