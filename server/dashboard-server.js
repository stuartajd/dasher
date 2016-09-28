/* ================================================= */
/*                  SOCKET SERVER                    */
/* ================================================= */

/*
 * Required Modules
 */
var server = require('http').createServer();
var io = require('socket.io')(server);

/*
 * When a connection is established to the socket
 */
io.on('connection', function(socket){
    socket.on('event', function(data){});
    socket.on('disconnect', function(){});
});

/*
 * When the server is running on the correct port
 */
server.listen(9090, function(){
    console.log("~ Dashboard Socket Server");
    console.log("~ Server Started on *:9090");
});