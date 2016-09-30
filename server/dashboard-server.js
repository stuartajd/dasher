/* ================================================= */
/*                  SOCKET SERVER                    */
/* ================================================= */

/*
 * Required Modules
 */
var server = require('http').createServer();
var io = require('socket.io')(server);
var server_address = require("ip").address();
var mysql = require('mysql');

/*
 * Initiate the MySQL Database Connection
 */
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'configurable-dashboard'
});

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
    connection.connect();
    
    socket.on('event', function(data){});
    socket.on('disconnect', function(){
        connection.end();        
    });
    
    socket.on('background-update', function(data)
    {
        connection.query('SELECT `action` FROM `settings` WHERE `setting` = "background_theme"', function(err, rows, fields) {
            if (err) throw err;

            console.log('The solution is: ', rows[0].action);
        });          
    });
});