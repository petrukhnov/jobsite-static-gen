var express        = require('express');
var bodyParser     = require('body-parser');
var exec = require('child_process').exec;

var ENV         = process.env.TFOX_ENV;
var DEPLOY_TASK = 'deploy';

var PORT   = process.env.JOBSITE_GENERATOR_PORT || 8080;
var SECRET = process.env.PRISMIC_SECRET;
var APIURL = process.env.PRISMIC_APIURL;
var DEBUG  = process.env.JOBSITE_GENERATOR_DEBUG;

var TYPE   = "api-update";
var TEST_TYPE = "test-trigger";
var app    = module.exports = express();

debug('Debug logging enabled');

// parse json on all requests
app.use(bodyParser.json());

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
    if (secret === SECRET && apiUrl === APIURL && (type === TYPE || type === TEST_TYPE)) {
        debug('Starting deployment to', ENV);
        var child = exec('./node_modules/.bin/gulp ' + DEPLOY_TASK + ' -e ' + ENV, function(err) {
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
