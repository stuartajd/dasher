/* ================================================= */
/*                  PAGE LOAD SCRIPT                 */
/* ================================================= */
var connected = false;
$( document ).ready(function() {
    // Show the loading screen during the initial page load (allows syncing without displaying the placeholders)
    showLoadingScreen();
    
    // Run syncData to begin syncing
    syncData();
    
    // Start the syncData timer for every 5 seconds
    syncDataTimer();
    
    // We're not connected to the socket yet
    connected = false;
});

/* ================================================= */
/*                  SOCKET CONNECTION                */
/* ================================================= */

/*
 * Initialise the websocket
 */

var socket = io.connect("http://localhost:9090/");

/*
 * Cannot connect to the server as there was an unknown error
 */
socket.io.on('connect_error', function(err) {
    showNoConnection();
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
    // Update the localStorage
    updateSetting("localWeather", data.localWeather);
    updateSetting("localWeatherHighTemp", data.localWeatherHighTemp);
    
    // Update the site to reflect changes
    $("#dashboard-user").text(data.username);
    $("#dashboard-weather").html('<i class="wi ' + localStorage.getItem("localWeather") + '"></i> <small>Highs of '+ localStorage.getItem("localWeatherHighTemp") +'&deg;</small>');
    
    // Wait for 1 second after completing sync to ensure everything is complete
    setInterval(function(){
        // Remove the loading screen
        showLoadingScreen(true);
    }, 1000);
});

socket.on('location', function(data){
    console.log("Location Requested");
    getLocation();
});

/* ================================================= */
/*                      FUNCTIONS                    */
/* ================================================= */

/* 
 * Reconnect to Socket Server
 */
function socket_reconnect(){
    if(!socket.connected){
        socket.io.connect();
    }
} 

/*
 * Display the cannot connect to server message
 */
function showNoConnection(shown = true){
    if(shown){
        $("#cannot-connect").slideDown();
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
    
    updateSetting("locX", locX);
    updateSetting("locY", locY);
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

function showLoadingScreen(already_shown=false)
{
    if(already_shown){
        // Show the main
        $("header").fadeIn();
        $("main").fadeIn();
        $("footer").fadeIn();

        // Hide the loading
        $("#splash-screen").fadeOut();
    } else {
        $("header").hide();
        $("main").hide();
        $("footer").hide();

        // Show the loading
        $("#splash-screen").show();
    }

}

/*
 * Sync Data to NodeJS Server
 * Data includes current location
 * @returns - Success (True / False), Current Weather, Config Display Options, Background Image
 */
function syncData(){
    getLocation();
    setDashboardDate();
    
    // Give the client time to find the location as otherwise it returns undefined.
    setTimeout(function() {    
        socket.emit('syncData', { locX: "" + locX, locY: "" + locY});
    }, 1000);    
}

function syncDataTimer(){
    setInterval(function(){
        if(connected){
            //console.log("Running Sync Data");
            syncData();
            showCannotConnect(true);
        } else {
            socket_reconnect();
            console.log("[ERROR] Cannot run Sync Data - No Server Connection");
            showCannotConnect();
        }
    }, 5000);
}

/*
 * Update the Local Storage Data / Create if it has not already
 */
function updateSetting(setting_name, setting_content){
    // Local Storage has not already been created
    localStorage.setItem(setting_name, setting_content);
}

/*
 * Show an error screen for not being able to connect to the server
 */
function showCannotConnect(shown=false){
    // The screen is already showing
    if(shown){
        $("p#splash-screen-error").slideUp();
    } else {
        $("p#splash-screen-error").slideDown();
    }
}
