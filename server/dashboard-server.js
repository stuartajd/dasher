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
    socket.on('disconnect', function(){});
    
    /*
     * Client sends to Sync Dashboard
     */
    socket.on('syncData', function(data){
        //console.log("[SRV] syncData() RECEIVED: {locX: "+ data.locX + ", locY: "+ data.locY +"}");
            
        getSetting("localWeather").on("data", function(response) {
            var localWeather = "wi-forecast-io-cloudy";
            var localWeatherHighTemp = "18";

            io.emit('syncData', { locX: data.locX, locY: data.locY, localWeather: localWeather, localWeatherHighTemp: localWeatherHighTemp }); 
        });        
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

function updateWeather(locX, locY){    
    /*
    API RESPONSE
    currently: {
        time: 1475608728,
        summary: "Partly Cloudy",
        icon: "partly-cloudy-day",
        nearestStormDistance: 170,
        nearestStormBearing: 52,
        precipIntensity: 0,
        precipProbability: 0,
        temperature: 62.33,
        apparentTemperature: 62.33,
        dewPoint: 51.94,
        humidity: 0.69,
        windSpeed: 4.95,
        windBearing: 291,
        visibility: 9.33,
        cloudCover: 0.53,
        pressure: 1016.93,
        ozone: 292.23
    },
    */
}