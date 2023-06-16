/**
 * Will send to the logged homepage if the user is already logged.
 * 
 * @module cinescape/validator/onlyLoggedOut
 */

import { loggedUser } from "../api/user.mjs";

// sends the user to the homepage of the logged user
if(loggedUser) location.href = "./html/escapeRoom.html";