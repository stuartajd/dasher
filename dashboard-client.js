/* ================================================= */
/*                  PAGE LOAD SCRIPT                 */
/* ================================================= */

$( document ).ready(function() {
    setDashboardDate();
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
    var date = new Date();
    var today = "" + date.getUTCDay() + "/" + date.getMonth() + "/" + date.getFullYear();
    $("#dashboard-date").text(today);
}

