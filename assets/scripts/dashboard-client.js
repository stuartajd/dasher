/* ================================================= */
/*                  PAGE LOAD SCRIPT                 */
/* ================================================= */

$( document ).ready(function() {
    setDashboardDate();
    syncData();
});

/* ================================================= */
/*                  SOCKET CONNECTION                */
/* ================================================= */

/*
 * Initialise the websocket
 */
var socket = io.connect('http://localhost:9090');

/*
 * User is reconnecting to the Socket Server
 */
socket.on('reconnecting', function(){
   console.log("connecting"); 
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
    console.log("Server Returned: "+ data.locX + " / " + data.locY);
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
    } else {
        $("#cannot-connect").slideUp();
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
