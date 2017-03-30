/**
 * Dasher - app.js
 *
 * The client side script to create an invisible element on the page, this is to check if an adblocker is enabled.
 *
 * This does not affect the dasher display in any way and should not be removed.
 *
 * @author: UP772629
 */

var e=document.createElement('div');
e.id='checkAdBlocker';
e.style.display='none';
document.body.appendChild(e);