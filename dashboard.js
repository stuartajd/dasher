/**
 * Dasher - dashboard.js
 *
 * The server side scripts for the Dasher Package.
 *
 * @author: UP772629
 */

'use strict';

/**
 * Required Modules
 */
const http = require("http");
const wsserver = require('ws').Server;
const express = require("express");
var server = http.createServer();
const wss = new wsserver({ server: server });
const app = express();
const colors = require("colors");
const args = require('optimist').argv;
const dasher = require("./private/dasher.module.js");
const nodeGeoCoder = require('node-geocoder');
const request = require('request');
const externalip = require("externalip");

// Express will handle all the HTTP connections
server.on('request', app);

/**
 * Global Variables
 */
var debug_mode = (args.debug) ? true : false;
var location = null;

/**
 * Run start up commands
 */
dasher.dashboardText();
print("Welcome to Dasher.. We're just loading the server now!", "Server");
debug("Dasher Loading - Started");

/* Webserver Content */
app.use(express.static(__dirname + '/public'));

/**
 * When the server loading is complete on port 8080, get the external IP for the system
 * then display a success message + the IP.
 */
server.listen(8080, function () {
    externalip(function (err, ip) {
        debug("Web Server Started");
        print("Dasher has loaded successfully, to use visit: "+ ip +":8080 in any browser!", "Server");
    });
});

/**
 * Send the index.html page as it's a 1 page package.
 */
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

/**
 * Redirect all traffic that isn't on / to / package.
 */
app.get('/*', function (req, res) {
    res.redirect("/");
});


/**
 * A new connection is established on the server.
 */
wss.on('connection', function connection(ws) {
    debug("New Connection Established");

    /**
     * A message is received in the JSON format:
     *
     * {action, content}
     */
    ws.on('message', function incoming(message) {
        var message = JSON.parse(message);
        switch(message.action){
            case "weather":
                getWeatherForcast(ws, message.lat, message.lon);
                break;
            case "location":
                getLocationString(ws, message.lat, message.lon);
                break;
            case "news":
                getNewsHeadlines(ws);
                break;
        }
    });
});

/**
 * Returns the current weather forcast from the darksky API, then sends back via WS
 */
function getWeatherForcast(ws, lat, lon){
    request('https://api.darksky.net/forecast/130474c13d870a20cd8b548373536d63/'+lat+','+lon+'&units=SI', function (error, response, body) {
        var forecast = JSON.parse(body);
        ws.send(JSON.stringify({"action":"weather", "forecast":forecast}));
    });
}

/**
 * Returns the current news headlines from BBC News / newsAPI system, then sends back via WS
 */
function getNewsHeadlines(ws){
    request('https://newsapi.org/v1/articles?source=bbc-news&apiKey=08962d9950894e9ab44c424a0690d2aa', function (error, response, body) {
        ws.send(JSON.stringify({"action":"news", "articles":JSON.parse(body).articles}));
    });
}

/**
 * Converts the lat & long co-ordinates into the city, country location.
 *
 * Uses the Google Geocoder reverse functionality.
 */
function getLocationString(ws, lat, lon){
    var options = {
        provider: 'google',

        httpAdapter: 'https',
        apiKey: 'AIzaSyAu2pQkbeYVcYTeWouEVUi2EVT93LpIBp0',
        formatter: null
    };

    var geocoder = nodeGeoCoder(options);

    geocoder.reverse({lat: lat, lon: lon}, function(err, res){
        location = res[0].city + ", " + res[0].country;
        ws.send(JSON.stringify({"action":"location", "location":location}));
    });
}

/**
 * Returns a formatted debug string that has a coloured DEBUG in front, returns all messages to console if
 * debug_mode == true.
 */
function debug(message){
    if(debug_mode) {
        console.log("[" + "DEBUG".red + "] " + message);
    }
}

/**
 * Returns a formatted string that has a green text within [] specified in the param Source, then concats the message
 * content.
 */
function print(message, source){
    if(source) {
        console.log("[" + source.toUpperCase().green + "] " + message);
    } else {
        console.log(message);
    }
}
