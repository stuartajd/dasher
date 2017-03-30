/**
 * Dasher - dasher.js
 *
 * The client side scripts for the Dasher Package.
 *
 * @author: UP772629
 */

'use strict';

/**
 * Debug mode will show the debug messages for different functions within the dasher system, shown in the Browser Console.
 *
 * Default: false
 */
var debug_mode = false;

/**
 * Widgets_Defaults is a store of all the widgets, their element IDs along with their defaults for the localStorage.
 *
 * It is used to quickly reset default to avoid having to constantly rewrite the same code over and over.
 *
 * How does this work?
 * ======================
 *
 * There are two types of data stored in widgets_defaults, one is for the widgets themselves, these all contain the
 * unique ID assigned to each widget, the other is for the remaining local storage defaults for dasher.
 *
 * When required, the data stored in this array will automatically populate the different settings throughout dasher
 * such as during the resetDasher function when required, it will update all the localStorage settings to create
 * a default item.
 *
 * How do I add new widget defaults?
 * ===================================
 *
 * When creating a new widget, the default will need to be added. Add a JSON entry to the array below.
 *
 * widget_id -> The unique ID for the entire widget within the index.html file
 * store_name -> The name for the localStorage setting that will be default for this widget (this will be shown / hidden)
 * store_value -> The value for the localStorage setting (most likely true / false for widgets)
 * settings_button -> The ID for the settings button for use within the settings page, this will toggle the button created
 *                    within the index.html page / settings popup.
 *
 * How do I add a new general default?
 * =====================================
 *
 * When creating a new default, add a JSON entry to the array below.
 *
 * widget_id -> This is not required, simply set this to false.
 * store_name -> This is the name for the localStorage setting.
 * store_value -> The default value for the localStorage setting.
 *
 */
var widgets_defaults = [
    // Default for Widgets
    {
        "widget_id":"widget_weather",
        "store_name":"setting_display_weather",
        "store_value":"true",
        "settings_button":"display_weather_button"
    },
    {
        "widget_id":"widget_news",
        "store_name":"setting_display_news",
        "store_value":"true",
        "settings_button":"display_news_button"
    },
    {
        "widget_id":"widget_map",
        "store_name":"setting_display_map",
        "store_value":"true",
        "settings_button":"display_map_button"
    },
    {
        "widget_id":"widget_twitter",
        "store_name":"setting_display_twitter",
        "store_value":"true",
        "settings_button":"display_twitter_button"
    },
    {
        "widget_id":"widget_chat",
        "store_name":"setting_display_chat",
        "store_value":"true",
        "settings_button":"display_chat_button"
    },
    {
        "widget_id":"widget_notepad",
        "store_name":"setting_display_notepad",
        "store_value":"true",
        "settings_button":"display_notepad_button"
    },

    // Defaults for Local Storage
    {
        "widget_id":false,
        "store_name":"notepad_content",
        "store_value":""
    },
    {
        "widget_id":false,
        "store_name":"setting_background_color",
        "store_value":"#008cff"
    },
    {
        "widget_id":false,
        "store_name":"setting_background_type",
        "store_value":"technology"
    },
    {
        "widget_id":false,
        "store_name":"setting_twitter_user",
        "store_value":"twitterdev"
    },
    {
        "widget_id":false,
        "store_name":"setting_message_name",
        "store_value":"Dasher User"
    },
    {
        "widget_id":false,
        "store_name":"locLat",
        "store_value":"false"
    },
    {
        "widget_id":false,
        "store_name":"locLon",
        "store_value":"false"
    },
]

/**
 * Widgets_Events stores all the events, the element and the function to run. In the event listeners section, a for loop
 * creates the system.
 *
 * Creating new events
 * =====================
 *
 * To create a new event simply add a new JSON entry to the widgets_events array, use the following format.
 * element_id -> The element that the event will take place on, must be a unique ID specified.
 * event_type -> The event to listen for such as keyup or click.
 * event_func -> The function to call when the event has been completed.
 *
 * How does it work?
 * ====================
 *
 * There is a for loop further down the dasher.js page that creates all the events and correctly sets everything
 * up to make event listeners faster, the event handler functions still need to be created however this simplifies
 * the creation of listeners.
 */
var widgets_events = [
    {
        "element_id":"settings_box_close",
        "event_type": "click",
        "event_func": updateSettings
    },
    {
        "element_id":"settings_button",
        "event_type": "click",
        "event_func": showSettingsBox
    },
    {
        "element_id":"about_button",
        "event_type": "click",
        "event_func": showAboutBox
    },
    {
        "element_id":"about_box_close",
        "event_type": "click",
        "event_func": showAboutBox
    },
    {
        "element_id":"setting_background_type",
        "event_type": "change",
        "event_func": updateSettingsBackground
    },
    {
        "element_id":"display_news_button",
        "event_type": "click",
        "event_func": updateSettingsNews
    },
    {
        "element_id":"display_weather_button",
        "event_type": "click",
        "event_func": updateSettingsWeather
    },
    {
        "element_id":"display_twitter_button",
        "event_type": "click",
        "event_func": updateSettingsTwitter
    },
    {
        "element_id":"display_notepad_button",
        "event_type": "click",
        "event_func": updateSettingsNotepad
    },
    {
        "element_id":"display_map_button",
        "event_type": "click",
        "event_func": updateSettingsMap
    },
    {
        "element_id":"display_chat_button",
        "event_type": "click",
        "event_func": updateSettingsChat
    },
    {
        "element_id":"setting_color_picker",
        "event_type": "change",
        "event_func": updateSettingsBackgroundColor
    },
    {
        "element_id":"setting_reset_dasher",
        "event_type": "click",
        "event_func": updateResetDasher
    },
    {
        "element_id":"notepad_content",
        "event_type": "keyup",
        "event_func": updateNotepadContent
    },
    {
        "element_id":"twitter_user_name",
        "event_type": "keyup",
        "event_func": updateTwitterUsername
    },
    {
        "element_id":"chat_input",
        "event_type":"keypress",
        "event_func": sendMessage
    },
    {
        "element_id":"setting_message_name",
        "event_type":"keyup",
        "event_func":updateSettingsChatUser
    }
];

/**
 * An array of all the days of the week.
 */
var days = ["MON", "TUE", "WED", "THUR", "FRI", "SAT", "SUN"];
var fullDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/**
 * An array of all the months of the year.
 */
var months = [  "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

// Assign a value for the global declaration.
var ws = null;
var socket_connected = false;

/**
 * Establish a connection to the socket server.
 */
function socket_connect(){
    try{
        ws = new WebSocket('ws://'+window.location.hostname+':' + window.location.port || 8080 +'/');
        debug("Connected to socket server");
    } catch (e){
        debug("Cannot connect to socket server");
    }
}

// Attempt a connection
socket_connect();

/**
 * When the socket server has opened.
 */
ws.onopen = function () {
    socket_connected = true;
};

/**
 * Checks if the socket connection is still alive / connected.
 */
function checkSocketConnection(){
    if(ws.readyState === 1){
        debug("Socket connection live.");
        socket_connected = true;
        setTimeout(function(){
            document.getElementById("widget_soc_warning").classList.add("hidden");
        }, 2500);
    } else {
        debug("Socket connection lost.");
        document.getElementById("widget_soc_warning").classList.remove("hidden");
        socket_connected = false;
        socket_connect();
    }
}

/**
 * When the socket server has closed.
 */
ws.onclose = function(){
    socket_connected = false;
    debug("Disconnected from Socket Server");
};

/**
 * Converts a fahrenheit temperature into the celcius and returns it with a string along with C at the end.
 * @param temp
 * @returns {string}
 */
function convertToC(temp){
    return Math.round((Number(temp) - 32) / (9 / 5)) + '&deg; C';
}

/**
 * When the socket server sends a message to the client.
 * It will return a JSON message containing an action [weather, location, news] and the data that comes with it.
 */
ws.onmessage = function (event) {
    var message = JSON.parse(event.data);
    debug("Message Received : " + message.action);

    switch(message.action){
        // Updates the total users conncted counter
        case "users":
            updateElementText(
                '#chat_user_connected',
                message.count
            );
            break;
        // Updates the current weather
        case "weather":
            updateElementHTML(
                "#widget_weather_icon",
                '<div class="row"><div class="col-md-6 text-center">' +
                '<img src="/images/'+ message.forecast.currently.icon +'.png">' +
                '</div><div class="col-md-6">' + convertToC(message.forecast.currently.temperature) + '</div></div>'
            );

            updateElementHTML(
                "#widget_weather_text",
                'It\'s currently ' + message.forecast.currently.summary + "<hr>"
            );

            var weekly = document.createElement("table");
            weekly.classList.add("table");
            weekly.style.textAlign = "center";

            var weekForecast = message.forecast.daily.data;

            for(var i = 0; i < 5; i++){
                var time = new Date(0); // The 0 there is the key, which sets the date to the epoch
                time.setUTCSeconds(weekForecast[i].time);
                var day = time.getDay();

                var fore = document.createElement("td");
                fore.innerHTML = days[day] + '<br /><small>' + convertToC(weekForecast[i].temperatureMin) +
                    '</small><br /><img src="/images/'+ weekForecast[i].icon +'.png" style="width: 2em;">';
                weekly.appendChild(fore);
            }

            document.getElementById("widget_weather_week").innerHTML = "";
            document.getElementById("widget_weather_week").append(weekly);
            break;
        // Updates the current location from lat / long
        case "location":
            updateElementText("#current_location", message.location);
            break;
        // Updates to display the messages from the chat
        case "message":
            var chat = document.createElement("li");
            chat.innerHTML = '<small><span style="color: blue;">'+ message.user + '</span> ' + message.message +
                '</small>';
            document.getElementById("chat_content").prepend(chat);
            break;
        // Updates the latest news headlines
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
                    '<article class="news_body hidden"><img src="' + newsHeadlines[i].urlToImage +'"' +
                    ' class="img-responsive"><br />' +
                    '' + newsHeadlines[i].title + '<hr>' + newsHeadlines[i].description  +
                    '<p class="text-right"><a href="'+ newsHeadlines[i].url +'"' +
                    ' target="_blank">Read More</a></p></article></span>';

                ti.setAttribute('onclick', 'viewNews(news_headline_'+i+')');

                news.append(ti);
            }
            document.querySelector("#news_headlines").innerHTML = news.innerHTML;
            break;
    }
}

/**
 * Creates a map of the area with an overlay of current traffic.
 */
function createTrafficMap(){

    var myLatlng = new google.maps.LatLng(
        Number(localStorage.getItem("locLat")),
        Number(localStorage.getItem("locLon"))
    );

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
    debug("updateCurrentTime()");

    var time = new Date();
    var mins = (time.getMinutes() <= 9) ? "0"+time.getMinutes() : time.getMinutes();
    var secs = (time.getSeconds() <= 9) ? "0"+time.getSeconds() : time.getSeconds();

    document.querySelector("#current-time").textContent = "" + time.getHours() + ":" + mins + ":" + secs;
}

/**
 * Function to get the ordinal from the date [st, nd, rd, th]
 *
 * Source: http://stackoverflow.com/a/6003589
 */
function get_nth_suffix(date) {
    switch (date) {
        case 1:
        case 21:
        case 31:
            return 'st';
        case 2:
        case 22:
            return 'nd';
        case 3:
        case 23:
            return 'rd';
        default:
            return 'th';
    }
}

/**
 * Update the current displayed date on the dashboard
 */
function updateCurrentDate(){
    debug("updateCurrentDate()");

    var date = new Date();
    document.querySelector("#current-date").textContent = fullDays[date.getDay()] + " " + date.getDate() +
        "" + get_nth_suffix(date.getDate()) + " " +months[date.getMonth()] + " " + date.getFullYear() + "";
}

/**
 * Sends a message to the socket server to update the news headlines.
 */
function updateCurrentNews(){
    debug("updateCurrentNews()");
    if(socket_connected) {
        ws.send(JSON.stringify({
            "action": "news"
        }));
    }
}

/**
 * Sends a message to the socket server to update the weather.
 */
function updateCurrentWeather(){
    debug("updateCurrentWeather()");
    if(socket_connected) {
        ws.send(JSON.stringify({
            "action": "weather",
            "lat": localStorage.getItem("locLat"),
            "lon": localStorage.getItem("locLon")
        }));
    }
}

/**
 * Starts the timer to update the dashboard time. Runs every second.
 */
function startTimeTimer(){
    updateCurrentTime();
    setInterval(function(){
        updateCurrentTime()
    }, 1000);
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
 * Starts the timer to update the current location. Runs every 10 minutes.
 */
function startLocationTimer(){
    setInterval(function(){
        getLocation();
    }, 600000);
}

/**
 * Checks if the server is connected to the web sockets! Runs every 5 seconds.
 */
function checkSocketConnectionTimer(){
    setInterval(function(){
        checkSocketConnection();
    }, 5000);
}

/**
 * Load up the dasher functions to set up the system
 */
function loadDasher(){
    // Create all defaults etc for the localStorage.
    configureDashboard();

    // If there is a connection to the socket server, continue.
    if(socket_connected){
        // Display the loading screen
        showLoading();

        // Gets the current user location
        getLocation();

        // Starts the socket timer to ensure the server is connected
        checkSocketConnectionTimer();

        // Runs after 2 seconds to ensure everything has started / location has been gathered.
        setTimeout(function() {
            // If the location is found
            if(localStorage.getItem("locLon") != "false" && localStorage.getItem("locLat") != "false") {
                // Start the timers
                startTimeTimer();
                startDateTimer();
                startNewsTimer();
                startWeatherTimer();
                startLocationTimer();

                // Send current lat and lon to get the location response
                if(socket_connected) {
                    ws.send(JSON.stringify({
                        "action": "location",
                        "lat": localStorage.getItem("locLat"),
                        "lon": localStorage.getItem("locLon")
                    }));
                }

                // Create the traffic map
                createTrafficMap();

                // Show the dashboard itself, hiding the loading screen
                showDashboard();
            }else {
                // Otherwise restart the loadDasher function to get location again.
                setTimeout(function(){
                    loadDasher();
                }, 10000);
            }

        }, 2000);
    } else {
        // Attempt to reconnect if there is no connection by "loadDasher" call as the server will automatically attempt
        // a reconnection after 5 seconds.
        setTimeout(function(){
            window.error_message.textContent = "Cannot connect to the dashboard server!";
            showErrors();
            loadDasher();
        }, 1000);
    }
}

/**
 * Configure the dashboard defaults if required otherwise sort out the user settings.
 *
 * The system uses the widgets_defaults array at the top to find & set the default values for all of the
 * widgets displayed on the site.
 */
function configureDashboard(){
    debug("configureDashboard()");
    // Set up the default values for the localStorage
    for(var i = 0; i < widgets_defaults.length; i++){
        if(localStorage.getItem(widgets_defaults[i].store_name) === null){
            localStorage.setItem(widgets_defaults[i].store_name, widgets_defaults[i].store_value);
        }
    }

    // Show or hide the elements, only if the widget_id isn't false!
    for(var i = 0; i < widgets_defaults.length; i++){
        if(widgets_defaults[i].widget_id !== false){
            if(localStorage.getItem(widgets_defaults[i].store_name) == "true"){
                document.getElementById(widgets_defaults[i].widget_id).style.display = "block";
            } else {
                document.getElementById(widgets_defaults[i].widget_id).style.display = "none";
            }
        }
    }

    // Update settings placeholder
    document.querySelector("#twitter_user_name").placeholder = localStorage.getItem("setting_twitter_user");

    // Update Background Picture
    document.querySelector("body").style.background = 'url("https://source.unsplash.com/category/' +
        localStorage.getItem("setting_background_type") + '/1280x720/") no-repeat center center fixed';

    // Update Notepad Content
    document.getElementById("notepad_content").innerHTML = strip_tags(localStorage.getItem("notepad_content"),
        "<div><br>");

    // Update Widget Header Colour
    var widgets = document.querySelectorAll(".widget_header");
    for(var i = 0; i < widgets.length; i++){
        widgets[i].style.backgroundColor = localStorage.getItem("setting_background_color");
    }

    var widgets = document.querySelectorAll(".widget");
    for(var i = 0; i < widgets.length; i++){
        widgets[i].style.borderBottomColor = localStorage.getItem("setting_background_color");
    }

    // Set the twitter feed to be the correct user on refresh
    document.getElementById("twitterFeed").childNodes[1].href = "https://twitter.com/" +
        localStorage.getItem("setting_twitter_user");
}

/**
 * Takes an element then updates the textContent for it
 */
function updateElementText(element, text){
    document.querySelector(element).textContent = text;
}

/**
 * Takes an element then updates the innerHTML for it
 */
function updateElementHTML(element, text){
    document.querySelector(element).innerHTML = text;
}

/**
 * Hide the error messages, displays the dashboard
 */
function showDashboard(){
    window.dashboard_loading.classList.add("hidden");
    window.dashboard_error.classList.add("hidden");
    window.dashboard.classList.remove("hidden");
    window.settings_button.classList.remove("hidden");
    window.about_button.classList.remove("hidden");
}

/**
 * Shows the error display, hides loading / dashboard
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
 *
 * This uses the widgets_events array to create the full list of eventListeners to make creating them
 * faster and simpler.
 */
for(var i = 0; i < widgets_events.length; i++){
    document.getElementById(widgets_events[i].element_id).addEventListener( widgets_events[i].event_type,
                                                                            widgets_events[i].event_func);
}

/**
 * When a news headline is clicked, toggle the display of the description / image for the news story
 */
function viewNews(element){
    element.childNodes[1].classList.toggle("hidden");
}

/**
 * Updates the twitter username for the display, also updating the localStorage.
 */
function updateTwitterUsername(){
    document.getElementById("setting_twitter_save").classList.remove("hidden");
    localStorage.setItem("setting_twitter_user", document.getElementById("twitter_user_name").value);
}

/**
 * Toggles the display of the aboutBox
 */
function showAboutBox(){
    window.about_box.classList.toggle("hidden");
}

/**
 * Toggles the display of the settings box but also sets up the menu to display all the settings.
 */
function showSettingsBox(){
    // If the about box is open, close it!
    window.about_box.classList.add("hidden");

    // Loop through all the backgrounds to check which is selected.
    var set_bg_ty = document.getElementById("setting_background_type");
    for(var i = 0; i < set_bg_ty.options.length; i++){
        if(set_bg_ty.options[i].value == localStorage.getItem("setting_background_type")){
            set_bg_ty.options[i].selected = true;
            break;
        }
    }

    // Uses the widgets_defaults to see which option is currently set to which!
    for(var i = 0; i < widgets_defaults.length; i++){
        if(widgets_defaults[i].widget_id !== false){
            if(localStorage.getItem(widgets_defaults[i].store_name) == "true"){
                document.getElementById(widgets_defaults[i].settings_button).innerHTML =
                    '<i class="fa fa-toggle-on"></i> Shown';
            } else {
                document.getElementById(widgets_defaults[i].settings_button).innerHTML =
                    '<i class="fa fa-toggle-off"></i> Hidden';
            }
        }
    }

    // Set the value of the colour picker
    window.setting_color_picker.value = localStorage.getItem("setting_background_color");

    // Remove the messager user name
    window.setting_message_name.value = "";
    window.setting_message_name.placeholder = localStorage.getItem("setting_message_name");

    // Display / Hide the settings box
    window.settings_box.classList.toggle("hidden");
}

/**
 * Reset Dasher to defaults, updating all the localStorage to match the widgets_defaults values
 */
function updateResetDasher(){
    // Removes the location items from LocalStorage
    localStorage.removeItem("locLon");
    localStorage.removeItem("locLat");

    // Resets the current location
    getLocation();

    // Sets the items to match the default from widgets_defaults
    for(var i = 0; i < widgets_defaults.length; i++){
        localStorage.setItem(widgets_defaults[i].store_name, widgets_defaults[i].store_value);
    }

    // Close all news articles that are expanded
    var articles = document.querySelectorAll(".news_headline");
    for(var i = 0; i < articles.length; i++){
        articles[i].childNodes[1].classList.add("hidden");
    }
}

/**
 * Save Notepad Content, if greater than 500 chars, don't save and show an error.
 */
function updateNotepadContent(){
    if(document.getElementById("notepad_content").textContent.length > 500){
        // More than 500 characters, ignore :(
        window.notepad_max_length.classList.remove("hidden");
    } else {
        // Less than 500 characters, therefore save =)
        window.notepad_max_length.classList.add("hidden");
        localStorage.setItem("notepad_content", document.getElementById("notepad_content").innerHTML);
    }
}

/**
 * If the news setting is True, changes to False as they have clicked to hide
 */
function updateSettingsNews(){
    toggleElementDisplay("setting_display_news");
}

/**
 * If the chat setting is True, changes to False as they have clicked to hide
 */
function updateSettingsChat(){
    toggleElementDisplay("setting_display_chat");
}

/**
 * If the map setting is True, changes to False as they have clicked to hide
 */
function updateSettingsMap(){
    toggleElementDisplay("setting_display_map");
}

/**
 * If the news setting is True, changes to False as they have clicked to hide
 */
function updateSettingsWeather(){
    toggleElementDisplay("setting_display_weather");
}

/**
 * If the twitter setting is True, changes to False as they have clicked to hide
 */
function updateSettingsTwitter(){
    toggleElementDisplay("setting_display_twitter");
}

/**
 * If the news setting is True, changes to False as they have clicked to hide
 */
function updateSettingsNotepad(){
    toggleElementDisplay("setting_display_notepad");
}

/**
 * Uses the store_name value from widgets_defaults to locate the element required
 * then displays or hides the element based on it's current value.
 *
 * Used by the settings box to show and hide the widgets on the dashboard then flick the switch to show the status.
 */
function toggleElementDisplay(store_name){
    for(var i = 0; i < widgets_defaults.length; i++){
        // Check if a button exists for the widget (it is a widget not a store default)
        if(widgets_defaults[i].settings_button) {
            if (widgets_defaults[i].store_name == store_name) {
                var button = document.getElementById(widgets_defaults[i].settings_button);
                if (localStorage.getItem(store_name) == "true") {
                    // It's displayed, hide it!
                    localStorage.setItem(store_name, "false");
                    button.innerHTML = '<i class="fa fa-toggle-off"></i> Hidden';
                } else {
                    // It's hidden, show it!
                    localStorage.setItem(store_name, "true");
                    button.innerHTML = '<i class="fa fa-toggle-on"></i> Shown';
                }
            }
        }
    }
}

/**
 * Update the value of the colours
 */
function updateSettingsBackgroundColor(){
    localStorage.setItem("setting_background_color", window.setting_color_picker.value);
}

/**
 * Updates the settings for the dashboard, then closes the settings page.
 */
function updateSettings(){
    debug("updateSettings()");
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
 * Updates the background of the site.
 */
function updateSettingsChatUser(){
    localStorage.setItem("setting_message_name", strip_tags(document.getElementById("setting_message_name").value));
}

/**
 * Get location from IP Address as a fallback for the getLocation GEOLocation. Show a warning for using IP.
 *
 * Adblock can cause errors, so we check to see if adblock is enabled!
 */
function getLocationFromIP(){
    debug("getLocationFromIP()");

    document.getElementById("widget_loc_warning").classList.remove("hidden");

    if(document.getElementById('checkAdBlocker')) {
        // Doesn't have an adblock so this'll work fine!
        var req = new XMLHttpRequest();
        req.addEventListener("load", locationIPResponse);
        req.open("GET", "http://ip-api.com/json");
        req.send();
    } else {
        // Does have an adblocker, show an error?
        window.error_message.innerHTML = "Please disable your adblock, our fallback location system " +
            "isn't able to detect where you are!<br />Please disable adBlock and refresh!";
        showErrors();
        throw new Error("Adblock has been detected, fallback location check can't run, closing!");
    }
}

/**
 * Gets the response from the getLocationFromIP. Hides the warning that it's using IP after 10 seconds.
 */
function locationIPResponse(){
    var response = JSON.parse(this.responseText);
    localStorage.setItem("locLon", response.lon);
    localStorage.setItem("locLat", response.lat);

    setTimeout(function(){
        document.getElementById("widget_loc_warning").classList.add("hidden");
    }, 10000);
}

/**
 * HTML Geolocation - Gets the users location from their browser.
 */
function getLocation() {
    debug("getLocation()");

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
 */
function saveLocation(position){
    localStorage.setItem("locLat", position.coords.latitude);
    localStorage.setItem("locLon", position.coords.longitude);
}

/**
 * Error handler for getLocation functions
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

/**
 * Removes all tags from a string that shouldn't be there except those that have been given in the allow param.
 *
 * Source: http://coursesweb.net/javascript/strip_tags-stripslashes-javascript_cs
 */
function strip_tags(str, allow) {
    // making sure the allow arg is a string containing only tags in lowercase (<a><b><c>)
    allow = (((allow || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');

    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
    var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return str.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
        return allow.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
}

/**
 * Displays a formatted console message that says [DEBUG] before, only displays if debug_mode == true at the top
 * of the page.
 */
function debug(message){
    if(debug_mode) {
        console.log("[DEBUG] " + message);
    }
}

/**
 * Sends a user message from the chat box
 */
function sendMessage(event){
    if(event.keyCode == 13){
        // They press the enter key
        var message = document.getElementById("chat_input").value;
        ws.send(JSON.stringify({"action":"message", "user":localStorage.getItem("setting_message_name"), "message":strip_tags(message) }));
        document.getElementById("chat_input").value = "";
    }
}