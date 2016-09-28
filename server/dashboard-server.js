/* ================================================= */
/*                  SOCKET SERVER                    */
/* ================================================= */

/*
 * Required Modules
 */
var server = require('http').createServer();
var io = require('socket.io')(server);
var server_address = require("ip").address();

/*
 * When the server is running on the correct port
 */
server.listen(9090, function(){
    console.log("[SRV] Configurable Dashboard Local Loading Complete");

    console.log("Visit http://" + server_address + ":8080/ to use the system.");
});


/*
 * When a connection is established to the socket
 */
io.on('connection', function(socket){
    socket.on('event', function(data){});
    socket.on('disconnect', function(){});
});