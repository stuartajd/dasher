# Dasher - Configurable Dashboard
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Dasher - Configurable Dashboard](#)
	- [Introduction to Dasher](#introduction-to-dasher)
	- [Requirements](#requirements)
	- [Installation Guide](#installation-guide)
	- [Customisation](#cusomisation)
        - [How do I customise the site?](#how-do-i-customise-the-site)
        - [Customisation Options](#customisation-options)
	- [Data Sources](#data-sources)
	- [Mark Scheme Notes](#mark-scheme-notes)
        - [Functionality](#functionality)
        - [Maintainability](#maintainability)
        - [Usability](#usability)
        - [Accessibility](#accessibility)
        - [Reflection](#reflection)

## Introduction to Dasher
Dasher is a configurable dashboard built in CSS, HTML &amp; Javascript to display appropriate information as required, 
it is fully customisable with different modules that can be selected as you wish to use them. It is self contained and 
is shipped with an HTTP server to ensure that you simply run a few commands for it to function.

Dasher is also mobile friendly, it can be used and shaped on all devices without hassle!

Dasher is also built to automatically update all the information periodically, you never need to refresh your dashboard!
It'll also reconnect when the system drops connection to the socket server!

As Dasher is built to be a customisable dashboard for the client side, the server is able to have multiple connections
allowing as many people as wanted to join the same system! Their own customisation options will remain on their 
browser! The more people on one server the more communication you can have in the live chat!

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

This will kickstart the server and dashboard itself. Once the server has started running simply visit the URL that is 
given and you will be able to begin using the dashboard (See example of console below)

```
[SERVER] Welcome to Dasher.. We're just loading the server now!
[SERVER] Dasher has loaded, visit {YOUR IP}:8080 to view!
```

## Customisation
Dasher has a load of different customisation options, you're able to alter the background colours, images along with
showing and hiding all different widgets that on are the site.

Dasher has 6 main widgets:
* News Headlines Feed
* Weather Forecast (Current & Week Ahead)
* Notepad to store text in
* Local Area Map with Traffic Guide
* Twitter Feed
* Live Chat Box

And also has a local clock, date and location widgets which remain at the top of the page. By default all 6 widgets are 
shown!

#### How do I customise the site?
Customisation is easy, simply click the cog in the top left corner, then it'll display the site settings, then just 
click on the settings that you want to change!

#### Customisation Options
- House colours can be changed
- Background Category [Nature, Buildings, Food, People, Technology, Objects]
- Displaying and Hiding specific elements
- Notepad Facility
- User name for the chat
- And more!

## Data Sources
Data is sourced from multiple locations, they have been credited below.

- Unsplash Backgrounds: https://unsplash.com/
- Weather API: https://darksky.net
- Location API: Google API
- Weather Icons: https://www.iconfinder.com/iconsets/weather-color-2
- News Headlines: https://newsapi.org

Any functions used from external sources have been credited in the code comments.

## Mark Scheme Notes
#### Functionality
_How appropriate is the design? Does it all work? How much does it do? How much is your own work as opposed to libraries?_

Dasher is built to display the information produced in a clear and concise manner, showing each of the main widgets 
with headers to make identification easier. When the widgets are hidden, the backend grid system should move the 
remaining widgets into place to ensure that there isn't massive spaces between them, keeping the system clean. All 
features that have been implemented in Dasher are functional, there is no untested or nonfunctional code. Libraries 
are used throughout the package however the majority of the code created was created by myself.

As the method of storage, I chose to use HTML5 localStorage. This is because I found that the localStorage of the browser
is able to hold as much data as required by my system but is also able to keep it for as long as the user wants it for as
it does not clear unless the user specifically clears their browsing data.

#### Maintainability
_Code style, comprehensibility and maintainability. This includes formatting, file structure, naming - everything that 
can help your work live on and be useful after it is graded, including how well the code and any documentation 
communicates any concepts necessary to understand the architecture and configuration of the systems_

All functions within both the client and server side javascript has comments, all additional systems including the 
array of widgets & events at the top have indepth comments detailing how they function and how additions and changes
can be made if required.

#### Usability
_Ease-of-use of your system, including the use of event-driven input, background refresh, drag and drop, intuitive UI 
design, etc._

Dasher makes use of timers to automatically update the system as neccesary. A single page system it has a pop up box
for the settings to enable fast and simple setting changes to configure the dashboard itself. It will automatically
update and create any changes when the settings box is closed. The system does not use any drag and drop features.

#### Accessibility
_The appearance of your pages, including use of CSS and relevant capabilites such that the product is suitable for a 
diverse audience_

Dasher is built to be customised, the background category and the colours help make the page fit the users needs, they
are also able to completely hide the elements from the system if they do not want to see them anymore, allowing many
people to use the system to how they wish. The page is a flat and clear layout featuring seperate widgets spaced evenly
around the page to create a simple layout design.

#### Reflection
_Marked for insight, analysis and evaluation of encountered designs and technologies._

Throughout the creation of Dasher, I found that I had to locate the best APIs and modules to get the most out of the
system, things like the weather API from DarkSky had more options that could be useful than others allowing me an easier
route to customisation that I could have got from other APIs available. I was also able to use the weather icons with
the DarkSky API to ensure that my weather widget looked the best it can.

At the start of the project, I did have issues creating a grid system that was both robust and responsive, the system
could fit multiple screens but would not reshape if a widget is removed, this is why I decided to go with the Bootstrap
grid system for the dashboard. Bootstrap had the multiple options for different positions including the different sizes
of widgets allowing me to create two kinds, the static widgets [time, date and location] along with the larger main widgets.

I ran into issues with the GeoLocation not functioning correctly when running on servers without HTTPS, this caused errors
with the location reversal, weather retrival, maps etc and could've spelled the end for this version of the dashboard,
however after reviewing how the error was created and how I could overcome, I was able to create a fallback mechanism
that takes the user IP address and collects their location information based off it. Although the IP address location can be 
inaccurate, it still provides a rough estimate for their location which would still allow them to use Dasher. During the
fallback mechanism creation, I found that the IP location address AJAX request was being blocked by AdBlockers, preventing
the correct information from being passed through, I was able to counter this by creating the simple "ads.js" file, which
after research I found that this is one of the keywords that the adblocker system looks for. By using the "ads.js" file to
create an element, then checking if the element actually exists allows a primative way of checking if the user has an adblocker,
ofcourse this only requires it to be disabled if the fallback system is used. The fallback method is also used for users
who don't share their user information via the GeoLocation, so it will be called if there is any error found within the
location system.

Another issue found was that the Twitter Feed will not refresh automatically when the username is updated, this forces
the user to refresh the page itself to fully update the twitter user. This is because the system automatically generates
an iFrame to embed the twitter feed into the page, after attempting to use different selections including childNodes of
`#twitterFeed` and also querySelector to get the iFrame, I was unable to force a refresh on the frame and reload the 
feed, therefore a warning message appears when updating the twitter feed, the username in the localStorage saves however
to update the feed display a refresh is required.

