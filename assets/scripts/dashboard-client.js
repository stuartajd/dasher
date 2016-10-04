/* ================================================= */
/*                  PAGE LOAD SCRIPT                 */
/* ================================================= */
var connected = false;
$( document ).ready(function() {
    setDashboardDate();
    syncData();
    syncDataTimer();
    connected = false;
});

/* ================================================= */
/*                  SOCKET CONNECTION                */
/*

socket.on 'connect',-> console.log 'connected'
socket.on 'reconnect',-> console.log 'reconnect'
socket.on 'connecting',-> console.log 'connecting'
socket.on 'reconnecting',-> console.log 'reconnecting'
socket.on 'connect_failed',-> console.log 'connect failed'
socket.on 'reconnect_failed',-> console.log 'reconnect failed'
socket.on 'close',-> console.log 'close'
socket.on 'disconnect',-> console.log 'disconnect'

*/
/* ================================================= */

/*
 * Initialise the websocket
 */
var socket = io.connect('http://localhost:9090');
    

/*
 * Cannot connect to the server as there was an unknown error
 */
socket.on('error', function (err) {
    showNoConnection();
});

socket.on('reconnect_failed', function (err) {
    console.log(err);
});

/*
 * Check if user is connected to the Socket Server
 */
if(socket.connected == false)
{
	showNoConnection();
}

/*
 * The user has connected to the Socket Server
 */
socket.on('connect', function () {
	showNoConnection(false);
});

/*
 * The user has disconnected from the Socket Server
 */
socket.on('disconnect', function () 
{
	showNoConnection();
});

/*
 * Data Sync Returned from Server
 */
socket.on('syncData', function(data){
    // locX: data.locX, locY: data.locY, localWeather: localWeather, username: username
    console.log("Server Returned: "+ data.locX + " / " + data.locY + " / " + data.localWeather + " / " + data.username);
    
    $("#dashboard-user").text(data.username);
    $("#dashboard-weather").text(data.localWeather);
});

/* ================================================= */
/*                      FUNCTIONS                    */
/* ================================================= */

/* 
 * Reconnect to Socket Server
 */
function socket_reconnect(){
    socket.io.reconnect();
} 

/*
 * Disconnect from Socket Server
 */
function socket_disconnect(){
    socket.io.disconnect();
}

/*
 * Display the cannot connect to server message
 */
function showNoConnection(shown = true){
    if(shown){
        $("#cannot-connect").slideDown();
        socket_reconnect();
        connected = false;
    } else {
        $("#cannot-connect").slideUp();
        connected = true;
    }
};

/*
 * Get the current date & Update the dashboard
 */
function setDashboardDate(){
    $("#dashboard-date").text( moment().format('dddd, DD MMMM') );
}

/*
 * Get the users current location
 */
var locX, locY;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setLocation, locationError);
        
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function setLocation(position){
    locX = position.coords.latitude;
    locY = position.coords.longitude;
}

function locationError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            $("#cannot-connect").text("User denied the request for Geolocation.").slideDown();
            break;
        case error.POSITION_UNAVAILABLE:
            $("#cannot-connect").text("Location information is unavailable.").slideDown();
            break;
        case error.TIMEOUT:
            $("#cannot-connect").text("The request to get user location timed out.").slideDown();
            break;
        case error.UNKNOWN_ERROR:
            $("#cannot-connect").text("An unknown error occurred.").slideDown();
            break;
    }
}

/*
 * Sync Data to NodeJS Server
 * Data includes current location
 * @returns - Success (True / False), Current Weather, Config Display Options, Background Image
 */
function syncData(){
    getLocation();
    setTimeout(function() {
        socket.emit('syncData', { locX: "" + locX, locY: "" + locY});
    }, 1000);
}

function syncDataTimer(){
    setInterval(function(){
        if(connected){
            console.log("Running Sync Data");
            syncData();
        } else {
            socket_reconnect();
            console.log("Cannot run Sync Data");
        }
    }, 5000);
}
