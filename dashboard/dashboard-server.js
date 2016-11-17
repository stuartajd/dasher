/* ================================================= */
/*                  SOCKET SERVER                    */
/* ================================================= */

/*
 * Required Modules
 */
var server = require('http').createServer();
var express = require("express");
var app = express();
var cmd = require('node-cmd');
var io = require('socket.io')(server);
var ip = require('ip');
var request = require('request');
var colors = require('colors');
var args = require('optimist').argv;

var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./dashboard-server-localStorage/');

if(args.debug){
    var debug_mode = true;
    debug("Debug Mode Enabled");
} else {
    var debug_mode = false;
}

/*
 * When the server is running on the correct port
 */
server.listen(9090, function(){
    debug("Socket Server Started");

    app.use('/css', express.static(__dirname + '/public/css'));
    app.use('/js', express.static(__dirname + '/public/js'));


    app.listen(80, function(){
        debug("Web Server Started");

        console.log("[SRV] Webserver Started");
    });

    app.get('/',function(req,res){
        res.sendFile(__dirname + '/public/test.html');
    });

    debug("Loading Complete");

    startWeatherUpdateTimer();
});


/*
 * When a connection is established to the socket
 */
io.on('connection', function(socket){ 
    debug("A client has connected to the server");
        
    socket.on('disconnect', function(){
        debug("A client has disconnected from the server");     
    });
    
    /*
     * Client sends to Sync Dashboard
     */
    socket.on('syncData', function(data){
        debug("syncData() request has been recieved");
        
        // Update localStorage to include the current X & Y locations
        localStorage.setItem("locX", data.locX);
        localStorage.setItem("locY", data.locY);        
        
        // Return all the required variables for the sync
        io.emit('syncData', { 
            locX: data.locX, 
            locY: data.locY, 
            localWeather: localStorage.getItem("localWeather"), 
            localWeatherHighTemp: localStorage.getItem("localWeatherHighTemp") 
        }); 
        
        debug("syncData() request results have been returned");
    });
});

/* ================================================= */
/*                      FUNCTIONS                    */
/* ================================================= */

function startWeatherUpdateTimer(){
    if(!localStorage.getItem("locX") || !localStorage.getItem("locY") ||
        localStorage.getItem("locX") == "undefined" || localStorage.getItem("locY") == "undefined"){
        debug("startWeatherUpdateTimer() does not have the X or Y co-ordinates in localStorage");
        // They do not exist in the localStorage, attempt to reaquire location.
        io.emit('location');
        
        // Check if the location is available after 2 seconds.
        setTimeout(function(){
            startWeatherUpdateTimer();
        }, 2000);
    } else {
        debug("startWeatherUpdateTimer() has started successfully");
        // Run the update weather function @ server startup
        updateWeather(localStorage.getItem("locX"), localStorage.getItem("locY"));

        // Then run every 10 minutes
        setInterval(function(){
            updateWeather(localStorage.getItem("locX"), localStorage.getItem("locY"));
        }, 600000);
    }
}

function updateWeather(locX, locY){  
    request('https://api.darksky.net/forecast/130474c13d870a20cd8b548373536d63/' + locX + ',' + locY, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            debug("updateWeather() has started successfully and connected to the API");
            
            var weatherJSON = JSON.parse(body);
            localStorage.setItem("localWeather", "wi-forecast-io-"+ weatherJSON.currently.icon);
            
            var temperature = Math.floor((weatherJSON.currently.temperature - 32)*(5 / 9));
            
            localStorage.setItem("localWeatherHighTemp", temperature);
        }
    });
}

function debug(message){
    if(debug_mode){
        console.log("[" + "DEBUG".red + "] " + message);
    }
}