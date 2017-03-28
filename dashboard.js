/*
 Dasher - dashboard.js

 The main dashboard server for the Dasher package.
 */

'use strict'

/**
 * Required Modules
 */
const http = require("http");
const wsserver = require('ws').Server;
const express = require("express");

var server = http.createServer();

/* Socket Content */
const wss = new wsserver({ server: server });

const app = express();
const colors = require("colors");
const args = require('optimist').argv;
const dasher = require("./private/dasher.module.js");
const nodeGeoCoder = require('node-geocoder');
const request = require('request');
const ip = require("ip");

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

server.listen(8080, function () {
    debug("Web Server Started");
    print("Web Server Started on "+this.address().address+":" + this.address().port, "Server");
});



app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/*', function (req, res) {
    res.redirect("/");
});




// dasher is connected via Socket
wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {
        var message = JSON.parse(message);
        switch(message.action){
            case "sync":

                break;
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

    ws.send(JSON.stringify({"action":"sync", "connected":true}));
});

/* Weather Content */
function getWeatherForcast(ws, lat, lon){
    request('https://api.darksky.net/forecast/130474c13d870a20cd8b548373536d63/'+lat+','+lon+'', function (error, response, body) {
        var forecast = JSON.parse(body);
        ws.send(JSON.stringify({"action":"weather", "forecast":forecast}));
    });
}

/* News Headlines */
function getNewsHeadlines(ws){
    request('https://newsapi.org/v1/articles?source=bbc-news&apiKey=08962d9950894e9ab44c424a0690d2aa', function (error, response, body) {
        ws.send(JSON.stringify({"action":"news", "articles":JSON.parse(body).articles}));
    });
}

/* Geolocation Content */
function getLocationString(ws, lat, lon){
    var options = {
        provider: 'google',

        httpAdapter: 'https', // Default
        apiKey: 'AIzaSyAu2pQkbeYVcYTeWouEVUi2EVT93LpIBp0', // for Mapquest, OpenCage, Google Premier
        formatter: null         // 'gpx', 'string', ...
    };

    var geocoder = nodeGeoCoder(options);

    geocoder.reverse({lat: lat, lon: lon}, function(err, res){
        location = res[0].city + ", " + res[0].country;
        ws.send(JSON.stringify({"action":"location", "location":location}));
    });
}


/* Message Commands */
function debug(message){
    if(debug_mode) {
        console.log("[" + "DEBUG".red + "] " + message);
    }
}
function print(message, source){
    if(source) {
        console.log("[" + source.toUpperCase().green + "] " + message);
    } else {
        console.log(message);
    }
}
