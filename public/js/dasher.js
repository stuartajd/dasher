/**
 Dasher - dasher.js

 The main client script for the Dasher package.
 */

'use strict'

var ws = new WebSocket('ws://'+window.location.hostname+':' + window.location.port || 8080 +'/');
var socket_connected = false;

ws.onopen = function (event) {
    socket_connected = true;
};

ws.onmessage = function (event) {
    var message = JSON.parse(event.data);
    switch(message.action){
        case "weather":
            updateElementHTML("#widget_weather_icon", '<i class="wi wi-forecast-io-'+message.forecast.currently.icon+'"></i>');
            updateElementHTML("#widget_weather_text", 'It\'s currently ' + message.forecast.currently.summary + "<hr>");

            var weekly = document.createElement("table");
            weekly.classList.add("table");

            var weekForecast = message.forecast.hourly.data;

            for(var i = 0; i < 5; i++){
                var time = new Date(0); // The 0 there is the key, which sets the date to the epoch
                time.setUTCSeconds(weekForecast[i+1].time);
                var mins = (time.getMinutes() <= 9) ? "0"+time.getMinutes() : time.getMinutes();
                var AMPM = (time.getHours() >= 12) ? "PM" : "AM";
                var hours= (time.getHours() >= 12) ? time.getHours() - 12 : time.getHours();

                var fore = document.createElement("td");
                fore.innerHTML = '<i title="'+ weekForecast[i+1].summary +'" class="wi wi-forecast-io-'+ weekForecast[i+1].icon +'"></i><br />'+ hours + ":" + mins + AMPM ;
                weekly.appendChild(fore);
            }

            document.getElementById("widget_weather_week").innerHTML = "";
            document.getElementById("widget_weather_week").append(weekly);
            break;
        case "location":
            updateElementText("#current_location", message.location);
            break;
        case "news":
            var newsHeadlines = message.articles;
            var news = document.createElement("ul");
            for(var i = 0; i < 5; i++){
                var headline = "";
                if(newsHeadlines[i].title.length > 50) {
                    headline = newsHeadlines[i].title.substr(0, 50) + '..';
                } else {
                    headline = newsHeadlines[i].title;
                }

                var ti = document.createElement("li");
                ti.innerHTML = '<span class="news_headline" id="news_headline_'+i+'">' + headline +'</a>' +
                    '<article class="news_body hidden"><img src="' + newsHeadlines[i].urlToImage +'" class="img-responsive"><br />' +
                    '' + newsHeadlines[i].title + '<hr>' + newsHeadlines[i].description  +
                    '<p class="text-right"><a href="'+ newsHeadlines[i].url +'" target="_blank">Read More</a></p></article></span>';

                ti.setAttribute('onclick', 'viewNews(news_headline_'+i+')');

                news.append(ti);
            }
            document.querySelector("#news_headlines").innerHTML = news.innerHTML;
            break;
    }
}

function createTrafficMap(){

    var myLatlng = new google.maps.LatLng(Number(localStorage.getItem("locLat")), Number(localStorage.getItem("locLon")));

    var map = new google.maps.Map(document.getElementById('widget_map_image'), {
        zoom: 13,
        center: myLatlng
    });

    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
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
        // Display the loading screen
        showLoading();

        setTimeout(function() {
            if(localStorage.getItem("locLon") != "false" && localStorage.getItem("locLat") != "false") {
                // Start the date and time timers
                startTimeTimer();
                startDateTimer();
                startNewsTimer();
                startWeatherTimer();

                // Send current lat and lon to get the location response
                ws.send(JSON.stringify({
                    "action": "location",
                    "lat": localStorage.getItem("locLat"),
                    "lon": localStorage.getItem("locLon")
                }));

                createTrafficMap();

                showDashboard();
            }else {
                getLocation();

                setTimeout(function () {
                    loadDasher();
                }, 1000);
            }

        }, 2000);
    } else {
        setTimeout(function(){
            window.error_message.textContent = "Cannot connect to the dashboard server!";
            showErrors();
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

    if(localStorage.getItem("setting_display_map") === null){
        localStorage.setItem("setting_display_map", "true");
    }

    if(localStorage.getItem("setting_display_weather") === null){
        localStorage.setItem("setting_display_weather", "true");
    }

    if(localStorage.getItem("setting_display_notepad") === null){
        localStorage.setItem("setting_display_notepad", "true");
    }

    if(localStorage.getItem("notepad_content") === null){
        localStorage.setItem("notepad_content", "");
    }

    // Update Background Picture
    document.querySelector("body").style.background = 'url("https://source.unsplash.com/category/' + localStorage.getItem("setting_background_type") + '/1280x720/") no-repeat center center fixed';

    // Update Notepad Content
    document.getElementById("notepad_content").innerHTML = strip_tags(localStorage.getItem("notepad_content"), "<div><br>");

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

    // Display Map Widget
    if(localStorage.getItem("setting_display_map") == "true"){
        window.widget_map.style.display = "block";
    } else {
        window.widget_map.style.display = "none";
    }

    // Display Weather Widget
    if(localStorage.getItem("setting_display_weather") == "true"){
        window.widget_weather.style.display = "block";
    } else {
        window.widget_weather.style.display = "none";
    }

    // Display Notepad Widget
    if(localStorage.getItem("setting_display_notepad") == "true"){
        window.widget_notepad.style.display = "block";
    } else {
        window.widget_notepad.style.display = "none";
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
    window.about_button.classList.remove("hidden");
}

/**
 * Shows the error display
 */
function showErrors(){
    window.dashboard_loading.classList.add("hidden");
    window.dashboard_error.classList.remove("hidden");
    window.dashboard.classList.add("hidden");
    window.settings_button.classList.add("hidden");
    window.about_button.classList.add("hidden");
}

/**
 * Shows the loading screen
 */
function showLoading(){
    window.dashboard_loading.classList.remove("hidden");
    window.dashboard_error.classList.add("hidden");
    window.dashboard.classList.add("hidden");
    window.settings_button.classList.add("hidden");
    window.about_button.classList.add("hidden");
}

/**
 * Event Listeners
 */
document.getElementById("settings_box_close").addEventListener("click", updateSettings);
document.getElementById("settings_button").addEventListener("click", showSettingsBox);
document.getElementById("about_button").addEventListener("click", showAboutBox);
document.getElementById("about_box_close").addEventListener("click", showAboutBox);
document.getElementById("setting_background_type").addEventListener("change", updateSettingsBackground);
document.getElementById("display_news_button").addEventListener("click", updateSettingsNews);
document.getElementById("display_weather_button").addEventListener("click", updateSettingsWeather);
document.getElementById("display_notepad_button").addEventListener("click", updateSettingsNotepad);
document.getElementById("display_map_button").addEventListener("click", updateSettingsMap);
document.getElementById("setting_color_picker").addEventListener("change", updateSettingsBackgroundColor);
document.getElementById("setting_reset_dasher").addEventListener("click", updateResetDasher);
document.getElementById("notepad_content").addEventListener("keyup", updateNotepadContent);


/**
 * Event Handlers
 */
function viewNews(element){
    element.childNodes[1].classList.toggle("hidden");
}

function showAboutBox(){
    window.about_box.classList.toggle("hidden");
}

function showSettingsBox(){
    window.about_box.classList.toggle("hidden");

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

    // Check if weather is enabled
    if(localStorage.getItem("setting_display_map") == "true"){
        window.display_map_button.innerHTML = '<i class="fa fa-toggle-on"></i> Shown';
    } else {
        window.display_map_button.innerHTML = '<i class="fa fa-toggle-off"></i> Hidden';
    }

    // Check if weather is enabled
    if(localStorage.getItem("setting_display_notepad") == "true"){
        window.display_notepad_button.innerHTML = '<i class="fa fa-toggle-on"></i> Shown';
    } else {
        window.display_notepad_button.innerHTML = '<i class="fa fa-toggle-off"></i> Hidden';
    }

    window.setting_color_picker.value = localStorage.getItem("setting_background_color");

    window.settings_box.classList.toggle("hidden");
}

/**
 * Reset Dasher to defaults
 */
function updateResetDasher(){
    localStorage.removeItem("locLon");
    localStorage.removeItem("locLat");

    getLocation();

    localStorage.setItem("setting_display_news", "true");
    localStorage.setItem("setting_display_weather", "true");
    localStorage.setItem("setting_display_map", "true");
    localStorage.setItem("setting_display_notepad", "true");
    localStorage.setItem("setting_background_color", "#008cff");
    localStorage.setItem("setting_background_type", "nature");
    localStorage.setItem("notepad_content", "");

    // Close all news articles
    var articles = document.querySelectorAll(".news_headline");
    for(var i = 0; i < articles.length; i++){
        articles[i].childNodes[1].classList.add("hidden");
    }
}

/**
 * Save Notepad Content
 */
function updateNotepadContent(){
    if(document.getElementById("notepad_content").textContent.length > 250){
        // More than 250 characters, ignore :(
        window.notepad_max_length.classList.remove("hidden");
    } else {
        // Less than 250 characters, therefore save =)
        window.notepad_max_length.classList.add("hidden");
        localStorage.setItem("notepad_content", document.getElementById("notepad_content").innerHTML);
    }
}

/**
 * If the news setting is True, changes to False as they have clicked to hide
 */
function updateSettingsNews(){
    if(localStorage.getItem("setting_display_news") == "true"){
        localStorage.setItem("setting_display_news", "false");
        window.display_news_button.innerHTML = '<i class="fa fa-toggle-off"></i> Hidden';
    } else {
        localStorage.setItem("setting_display_news", "true");
        window.display_news_button.innerHTML = '<i class="fa fa-toggle-on"></i> Shown';
    }
}

/**
 * If the news setting is True, changes to False as they have clicked to hide
 */
function updateSettingsMap(){
    if(localStorage.getItem("setting_display_map") == "true"){
        localStorage.setItem("setting_display_map", "false");
        window.display_map_button.innerHTML = '<i class="fa fa-toggle-off"></i> Hidden';
    } else {
        localStorage.setItem("setting_display_map", "true");
        window.display_map_button.innerHTML = '<i class="fa fa-toggle-on"></i> Shown';
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
    } else {
        localStorage.setItem("setting_display_weather", "true");
        window.display_weather_button.innerHTML = '<i class="fa fa-toggle-on"></i> Shown';
    }
}

/**
 * If the news setting is True, changes to False as they have clicked to hide
 */
function updateSettingsNotepad(){
    if(localStorage.getItem("setting_display_notepad") == "true"){
        localStorage.setItem("setting_display_notepad", "false");
        window.display_notepad_button.innerHTML = '<i class="fa fa-toggle-off"></i> Hidden';
    } else {
        localStorage.setItem("setting_display_notepad", "true");
        window.display_notepad_button.innerHTML = '<i class="fa fa-toggle-on"></i> Shown';
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
    document.getElementById("widget_loc_warning").classList.remove("hidden");

    var req = new XMLHttpRequest();
    req.addEventListener("load", locationIPResponse);
    req.open("GET", "http://ip-api.com/json");
    req.send();
}

function locationIPResponse(){
    var response = JSON.parse(this.responseText);
    localStorage.setItem("locLon", response.lon);
    localStorage.setItem("locLat", response.lat);

    setTimeout(function(){
        document.getElementById("widget_loc_warning").classList.add("hidden");
    }, 10000);
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
    localStorage.setItem("locLat", "false");
    localStorage.setItem("locLon", "false");

    // Run fallback to get location
    getLocationFromIP();

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

// Source: http://coursesweb.net/javascript/strip_tags-stripslashes-javascript_cs
function strip_tags(str, allow) {
    // making sure the allow arg is a string containing only tags in lowercase (<a><b><c>)
    allow = (((allow || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');

    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
    var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return str.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
        return allow.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
}

