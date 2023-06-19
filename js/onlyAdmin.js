import { loggedUser } from "../api/user.mjs";

if(!loggedUser || !loggedUser.admin) location.href = "../";