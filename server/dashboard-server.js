/* ================================================= */
/*                  SOCKET SERVER                    */
/* ================================================= */

/*
 * Required Modules
 */
var server = require('http').createServer();
var io = require('socket.io')(server);
var request = require('request');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./dashboard-server-localStorage/');

/*
 * When the server is running on the correct port
 */
server.listen(9090, function(){
    console.log("[SRV] Configurable Dashboard Local Loading Complete");
    
    startWeatherUpdateTimer();
});


/*
 * When a connection is established to the socket
 */
io.on('connection', function(socket){ 
    console.log("[SRV] A connection has been established to the Dashboard Server");
        
    socket.on('disconnect', function(){
        console.log("[SRV] A connection has been terminated");        
    });
    
    /*
     * Client sends to Sync Dashboard
     */
    socket.on('syncData', function(data){
        localStorage.setItem("locX", data.locX);
        localStorage.setItem("locY", data.locY);        

        io.emit('syncData', { locX: data.locX, locY: data.locY, localWeather: localStorage.getItem("localWeather"), localWeatherHighTemp: localStorage.getItem("localWeatherHighTemp") }); 
    });
});

/* ================================================= */
/*                      FUNCTIONS                    */
/* ================================================= */

function getSetting(settingName){
    return request.post('http://localhost:100/server/api.php?action=getSetting', { form: { setting : settingName } });
}

function updateSetting(settingName, action){
    request.post('http://localhost:100/server/api.php?action=updateSetting', { form: { setting : settingName, action: action } });	
}

function startWeatherUpdateTimer(){
    // Run the update weather function @ server startup
    updateWeather(localStorage.getItem("locX"), localStorage.getItem("locY"));
    
    // Then run every 10 minutes
    setInterval(function(){
        updateWeather(localStorage.getItem("locX"), localStorage.getItem("locY"));
    }, 600000);
}

function updateWeather(locX, locY){  
    console.log("Starting weather update");
    request('https://api.darksky.net/forecast/130474c13d870a20cd8b548373536d63/' + locX + ',' + locY, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var weatherJSON = JSON.parse(body);
            localStorage.setItem("localWeather", "wi-forecast-io-"+ weatherJSON.currently.icon);
            
            var temperature = Math.floor((weatherJSON.currently.temperature - 32)*(5 / 9));
            
            localStorage.setItem("localWeatherHighTemp", temperature);
        }
    });
    console.log("Weather Update Complete");
}

/*
 * Update console.log to include timestamp
 * Source; http://stackoverflow.com/a/21801403/5203742
 */
console.logCopy = console.log.bind(console);

console.log = function()
{
    if (arguments.length)
    {
        var timestamp = new Date().toJSON(); // The easiest way I found to get milliseconds in the timestamp
        var args = arguments;
        args[0] = timestamp + ' > ' + arguments[0];
        this.logCopy.apply(this, args);
    }
};