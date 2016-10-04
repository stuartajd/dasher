/* ================================================= */
/*                  SOCKET SERVER                    */
/* ================================================= */

/*
 * Required Modules
 */
var server = require('http').createServer();
var io = require('socket.io')(server);
var request = require('request');

/*
 * When the server is running on the correct port
 */
server.listen(9090, function(){
    console.log("[SRV] Configurable Dashboard Local Loading Complete");
});


/*
 * When a connection is established to the socket
 */
io.on('connection', function(socket){    
    socket.on('event', function(data){});
    
    socket.on('disconnect', function(){});
    
    /*
     * Client sends to Sync Dashboard
     */
    socket.on('syncData', function(data){
        console.log("[SRV] syncData() RECEIVED: {locX: "+ data.locX + ", locY: "+ data.locY +"}");
        io.emit('syncData', { locX: data.locX, locY: data.locY }); 
        console.log(getSetting("localWeather"));
    });
    
});

/* ================================================= */
/*                      FUNCTIONS                    */
/* ================================================= */

function getSetting(settingName){
    request.post('http://localhost:100/server/api.php?action=getSetting', { form: { setting : settingName } }, function(error, response, body) {
        return response.body;
    });	
}

function updateSetting(settingName, action){
    request.post('http://localhost:100/server/api.php?action=updateSetting', { form: { setting : settingName, action: action } }, function(error, response, body) {
        console.log(response.body);
    });	
}

function getLocalWeather(locX, locY){
    request.post('', { form: { secure_key: '98220E17F7F824662FD8C41BDCEF92BF', action : 'confirm', number : '' + spinNumber + '' } }, function(error, response, body) {
		if(!error){
			setTimeout(function(){
				clearBets();
			},900); 
		}
	});
}
