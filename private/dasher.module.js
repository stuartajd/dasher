/**
 Dasher Module
 */

function dashboardText(){
    // Clear the display screen
    process.stdout.write('\x1Bc');

    // Display the "Dasher" Logo
    console.log("");
    console.log(" ██████╗  █████╗ ███████╗██╗  ██╗███████╗██████╗");
    console.log(" ██╔══██╗██╔══██╗██╔════╝██║  ██║██╔════╝██╔══██╗");
    console.log(" ██║  ██║███████║███████╗███████║█████╗  ██████╔╝");
    console.log(" ██║  ██║██╔══██║╚════██║██╔══██║██╔══╝  ██╔══██╗");
    console.log(" ██████╔╝██║  ██║███████║██║  ██║███████╗██║  ██║");
    console.log(" ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝");
    console.log("");
}

module.exports.dashboardText = dashboardText;