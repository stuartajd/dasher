/**
 Dasher - dasher.js

 The main client script for the Dasher package.
 */

'use strict'

var ws = new WebSocket('ws://35.187.54.249:8081');
var socket_connected = false;

ws.onopen = function (event) {
    socket_connected = true;
    console.log("Socket Connection Established");
};

ws.onmessage = function (event) {
    var message = JSON.parse(event.data);
    console.log(message);
    switch(message.action){
        case "weather":
            console.log(message.forecast.icon);
            updateElementHTML("#widget_weather_icon", '<i class="wi wi-forecast-io-'+message.forecast.icon+'"></i>');
            updateElementText("#widget_weather_text", message.forecast.summary);
            break;
        case "location":
            updateElementText("#current_location", message.location);
            break;
        case "news":
            var newsHeadlines = message.articles;
            var news = document.createElement("ul");
            for(var i = 0; i < 5; i++){
                var ti = document.createElement("li");
                ti.innerHTML = '<a href="'+ newsHeadlines[i].url +'" target="_blank">' + newsHeadlines[i].title +'</a>';
                news.append(ti);
            }
            document.querySelector("#news_headlines").innerHTML = news.innerHTML;
            break;
    }
}

/**
 * Run as soon as the document is loaded.
 */

loadDasher();

/**
 * Update the current displayed time on the dashboard
 */
function updateCurrentTime(){
    var time = new Date();
    var mins = (time.getMinutes() <= 9) ? "0"+time.getMinutes() : time.getMinutes();
    var AMPM = (time.getHours() >= 12) ? "PM" : "AM";
    var hours= (time.getHours() >= 12) ? time.getHours() - 12 : time.getHours();
    document.querySelector("#current-time").textContent = "" + hours + ":" + mins + AMPM;
}

/**
 * Update the current displayed date on the dashboard
 */
function updateCurrentDate(){
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var date = new Date();
    document.querySelector("#current-date").textContent = "" + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear() + "";
}

/**
 * Updates the current news headlines.
 */
function updateCurrentNews(){
    ws.send(JSON.stringify({"action":"news"}));
}

function updateCurrentWeather(){
    ws.send(JSON.stringify({"action":"weather", "lat":localStorage.getItem("locLat"), "lon":localStorage.getItem("locLon")}));
}

/**
 * Starts the timer to update the dashboard time. Runs every 5 seconds.
 */
function startTimeTimer(){
    updateCurrentTime();
    setInterval(function(){
        updateCurrentTime()
    }, 5000);
}

/**
 * Starts the timer to update the news headlines. Runs every 15 minutes.
 */
function startNewsTimer(){
    updateCurrentNews();
    setInterval(function(){
        updateCurrentNews();
    }, 900000);
}

/**
 * Starts the timer to update the dashboard date. Runs every 15 minutes.
 */
function startDateTimer(){
    updateCurrentDate();
    setInterval(function(){
        updateCurrentDate();
    }, 900000);
}

/**
 * Starts the timer to update the current weather. Runs every 15 minutes.
 */
function startWeatherTimer(){
    updateCurrentWeather();
    setInterval(function(){
        updateCurrentWeather();
    }, 900000);
}

/**
 * Load up the dasher functions
 */
function loadDasher(){
    configureDashboard();

    if(socket_connected){
        getLocation();

        // Display the loading screen
        showLoading();

        setTimeout(function() {
            if(localStorage.getItem("locLon") === "unavailable" && localStorage.getItem("locLat") == "unavailable"){
                // Fall back to using GeoLocation from IP Address
                getLocationFromIP();
                setTimeout(function(){
                    loadDasher();
                }, 1000);
            } else {
                if(localStorage.getItem("locLon") != "false" && localStorage.getItem("locLat") != "false"){


                    // Start the date and time timers
                    startTimeTimer();
                    startDateTimer();
                    startNewsTimer();
                    startWeatherTimer();

                    // Send current lat and lon to get the location response
                    ws.send(JSON.stringify({"action":"location", "lat":localStorage.getItem("locLat"), "lon":localStorage.getItem("locLon")}));

                    showDashboard();
                } else {
                    showErrors();
                }
            }
        }, 2000);
    } else {
        setTimeout(function(){
            loadDasher();
        }, 1000);
    }
}

function configureDashboard(){
    if(localStorage.getItem("locLon") === null){
        localStorage.setItem("locLon", "false");
    }

    if(localStorage.getItem("locLat") === null){
        localStorage.setItem("locLat", "false");
    }

    // SET DEFAULTS
    if(localStorage.getItem("setting_background_type") === null){
        localStorage.setItem("setting_background_type", "nature");
    }

    if(localStorage.getItem("setting_background_color") === null){
        localStorage.setItem("setting_background_color", "#008cff");
    }

    if(localStorage.getItem("setting_display_news") === null){
        localStorage.setItem("setting_display_news", "true");
    }

    if(localStorage.getItem("setting_display_weather") === null){
        localStorage.setItem("setting_display_weather", "true");
    }

    // Update Background Picture
    document.querySelector("body").style.backgroundImage = 'url("https://source.unsplash.com/category/' + localStorage.getItem("setting_background_type") + '/1280x720/")';

    // Update Widget Header Colour
    var widgets = document.querySelectorAll(".widget_header");
    for(var i = 0; i < widgets.length; i++){
        widgets[i].style.backgroundColor = localStorage.getItem("setting_background_color");
    }

    var widgets = document.querySelectorAll(".widget");
    for(var i = 0; i < widgets.length; i++){
        widgets[i].style.borderBottomColor = localStorage.getItem("setting_background_color");
    }

    // Display News Widget
    if(localStorage.getItem("setting_display_news") == "true"){
        window.widget_news.style.display = "block";
    } else {
        window.widget_news.style.display = "none";
    }

    // Display Weather Widget
    if(localStorage.getItem("setting_display_weather") == "true"){
        window.widget_weather.style.display = "block";
    } else {
        window.widget_weather.style.display = "none";
    }
}

function updateElementText(element, text){
    document.querySelector(element).textContent = text;
}

function updateElementHTML(element, text){
    document.querySelector(element).innerHTML = text;
}


/**
 * Hide the error messages
 */
function showDashboard(){
    window.dashboard_loading.classList.add("hidden");
    window.dashboard_error.classList.add("hidden");
    window.dashboard.classList.remove("hidden");
    window.settings_button.classList.remove("hidden");
}

/**
 * Shows the error display
 */
function showErrors(){
    window.dashboard_loading.classList.add("hidden");
    window.dashboard_error.classList.remove("hidden");
    window.dashboard.classList.add("hidden");
    window.settings_button.classList.add("hidden");
}

/**
 * Shows the loading screen
 */
function showLoading(){
    window.dashboard_loading.classList.remove("hidden");
    window.dashboard_error.classList.add("hidden");
    window.dashboard.classList.add("hidden");
    window.settings_button.classList.add("hidden");
}

/**
 * Event Listeners
 */
document.getElementById("settings_box_close").addEventListener("click", updateSettings);
document.getElementById("settings_button").addEventListener("click", showSettingsBox);
document.getElementById("setting_background_type").addEventListener("change", updateSettingsBackground);
document.getElementById("display_news_button").addEventListener("click", updateSettingsNews);
document.getElementById("display_weather_button").addEventListener("click", updateSettingsWeather);
document.getElementById("setting_color_picker").addEventListener("change", updateSettingsBackgroundColor);
document.getElementById("setting_reset_dasher").addEventListener("click", updateResetDasher);

/**
 * Event Handlers
 */
function showSettingsBox(){
    // Loop through all the backgrounds
    var set_bg_ty = document.getElementById("setting_background_type");
    for(var i = 0; i < set_bg_ty.options.length; i++){
        if(set_bg_ty.options[i].value == localStorage.getItem("setting_background_type")){
            set_bg_ty.options[i].selected = true;
            break;
        }
    }

    // Check if news is enabled
    if(localStorage.getItem("setting_display_news") == "true"){
        window.display_news_button.innerHTML = '<i class="fa fa-toggle-on"></i> Shown';
    } else {
        window.display_news_button.innerHTML = '<i class="fa fa-toggle-off"></i> Hidden';
    }

    // Check if weather is enabled
    if(localStorage.getItem("setting_display_weather") == "true"){
        window.display_weather_button.innerHTML = '<i class="fa fa-toggle-on"></i> Shown';
    } else {
        window.display_weather_button.innerHTML = '<i class="fa fa-toggle-off"></i> Hidden';
    }


    window.setting_color_picker.value = localStorage.getItem("setting_background_color");

    window.settings_box.classList.toggle("hidden");
}

/**
 * Reset Dasher to defaults
 */
function updateResetDasher(){
    localStorage.setItem("setting_display_news", "true");
    localStorage.setItem("setting_display_weather", "true");
    localStorage.setItem("setting_background_color", "#008cff");
    localStorage.setItem("setting_background_type", "nature");
}

/**
 * If the news setting is True, changes to False as they have clicked to hide
 */
function updateSettingsNews(){
    if(localStorage.getItem("setting_display_news") == "true"){
        localStorage.setItem("setting_display_news", "false");
        window.display_news_button.innerHTML = '<i class="fa fa-toggle-off"></i> Hidden';
        window.widget_news.style.display = "none";
    } else {
        localStorage.setItem("setting_display_news", "true");
        window.display_news_button.innerHTML = '<i class="fa fa-toggle-on"></i> Shown';
        window.widget_news.style.display = "block";
    }
}

/**
 * Update the value of the colours
 */
function updateSettingsBackgroundColor(){
    localStorage.setItem("setting_background_color", window.setting_color_picker.value);
}

/**
 * If the news setting is True, changes to False as they have clicked to hide
 */
function updateSettingsWeather(){
    if(localStorage.getItem("setting_display_weather") == "true"){
        localStorage.setItem("setting_display_weather", "false");
        window.display_weather_button.innerHTML = '<i class="fa fa-toggle-off"></i> Hidden';
        window.widget_weather.style.display = "none";
    } else {
        localStorage.setItem("setting_display_weather", "true");
        window.display_weather_button.innerHTML = '<i class="fa fa-toggle-on"></i> Shown';
        window.widget_weather.style.display = "block";
    }
}

/**
 * Updates the settings for the dashboard, then closes the settings page.
 */
function updateSettings(){
    configureDashboard()
    showSettingsBox()
}

/**
 * Updates the background of the site.
 */
function updateSettingsBackground(){
    var background = document.getElementById("setting_background_type");
    localStorage.setItem("setting_background_type", background.options[background.selectedIndex].value);
}

/**
 * Get location from IP Address
 */
function getLocationFromIP(){
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", locationIPResponse);
    oReq.open("GET", "http://ip-api.com/json");
    oReq.send();
}

function locationIPResponse(){
    var response = JSON.parse(this.responseText);
    localStorage.setItem("locLon", response.lon);
    localStorage.setItem("locLat", response.lat);
}

/**
 * HTML Geolocation - getLocation
 */
function getLocation() {
    var options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(saveLocation, locationError, options);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

/**
 * Stores the user location to browser LocalStorage
 * @param position
 */
function saveLocation(position){
    localStorage.setItem("locLat", position.coords.latitude);
    localStorage.setItem("locLon", position.coords.longitude);
}

/**
 * Error handler for getLocation functions
 * @param error
 */
function locationError(error) {
    localStorage.setItem("locLat", "unavailable");
    localStorage.setItem("locLon", "unavailable");

    switch(error.code) {
        case error.PERMISSION_DENIED:
            window.error_message.textContent = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            window.error_message.textContent = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            window.error_message.textContent = "The request to get user location timed out.";
            break;
        default:
        case error.UNKNOWN_ERROR:
            window.error_message.textContent = "An unknown error occurred.";
            break;
    }
}

