/**
 * Dasher - dasher.module.js
 *
 * The client side scripts for the Dasher Package.
 *
 * @author: UP772629
 */

/**
 * Clears the screen, then display the Dasher ASCII code.
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