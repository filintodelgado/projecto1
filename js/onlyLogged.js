/**
 * This file when applyed to a HTML file will send the user back to home
 * page if it is not logged in.
 * 
 * Apply in the `<head>` without `difer` so it won't load all the file if
 * the user not logged.
 * 
 * Apply to pages the user should not see if not logged.
 * 
 * @module cinescape/validator/onlyLogged.js
 */

import { loggedUser } from "../api/user.mjs";

// send user back to home
if(!loggedUser) location.href = "../";