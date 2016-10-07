/* ================================================= */
/*                  SOCKET SERVER                    */
/* ================================================= */

/*
 * Required Modules
 */
var server = require('http').createServer();
var io = require('socket.io')(server);
var request = require('request');
//var LocalStorage = require('node-localstorage').LocalStorage;
//localStorage = new LocalStorage('./dashboard-server');

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
    console.log("[SRV] A connection has been established to the Dashboard Server");
    
    socket.on('disconnect', function(){});
    
    /*
     * Client sends to Sync Dashboard
     */
    socket.on('syncData', function(data){
        //localStorage.setItem("locX", data.locX);
        //localStorage.setItem("locY", data.locY);
        startWeatherUpdateTimer();

        //console.log("[SRV] syncData() RECEIVED: {locX: "+ data.locX + ", locY: "+ data.locY +"}");
            
        //updateWeather(data.locX, data.locY).on("data", function(response) {
            //var localWeather = localStorage.localWeather;
            //console.log(localWeather);
            
            var localWeather = "wi-forecast-io-clear-day";
            var localWeatherHighTemp = "18";

            io.emit('syncData', { locX: data.locX, locY: data.locY, localWeather: localWeather, localWeatherHighTemp: localWeatherHighTemp }); 
       // });        
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
    setInterval(function(){
       // updateWeather(localStorage.getItem("locX"), localStorage.getItem("locY"));
    }, 10000);
}

function updateWeather(locX, locY){    
    request
      .get('https://api.darksky.net/forecast/130474c13d870a20cd8b548373536d63/' + locX + ',' + locY)
      .on('response', function(response) {
            //localStorage.setItem("localWeather", "test");
      });
}
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