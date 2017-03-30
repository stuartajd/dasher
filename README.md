# Dasher - Configurable Dashboard
Dasher is a configurable dashboard built in CSS, HTML &amp; Javascript to display appropriate information as required, it is fully customisable with different modules that can be selected as you wish to use them. It is self contained and is shipped with an HTTP server to ensure that you simply run a few commands for it to function.

The system is built to be run on any system and many systems are able to access the server as all the customisation options are managed on the client side.


Dasher is also built to automatically update all the information periodically, you never need to refresh your dashboard!
## Requirements
A nodeJS server (npm installed)

Web Browser

## Installation Guide
To install the node.js modules simply run:

```
npm install
```

Then once all the required packages are installed simply run:

```
npm run dashboard
```

This will kickstart the server and dashboard itself. Once the server has started running simply visit the URL that is given and you will be able to begin using the dashboard (See example of console below)

```
[SERVER] Welcome to Dasher.. We're just loading the server now!
[SERVER] Dasher has loaded, visit {YOUR IP}:8080 to view!
```

## What can be customised?
Dasher has a load of different customisation options, you're able to alter the background colours, images along with showing and hiding all different widgets that on are the site. 

###How do I customise the site?
Customisation is easy, simply click the cog in the top left corner, then it'll display the site settings, then just click on the settings that you want to change!

###Customisation Options
* House colours can be changed
* Background Category [Nature, Buildings, Food, People, Technology, Objects]
* Displaying and Hiding specific elements
* Notepad Facility

#Data Sources
Data is sourced from multiple locations, they have been credited below.

* Weather API: https://darksky.net
* Location API: Google API
* Weather Icons: https://www.iconfinder.com/iconsets/weather-color-2
* News Headlines: https://newsapi.org

Any functions used from external sources have been credited in the code comments.

