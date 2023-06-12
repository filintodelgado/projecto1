import { EventModel } from "./event.mjs";
import { Level, currentLevel } from "./level.mjs";
import { AutoSaver, cleanup, makeInstanceKey, makeKey } from "./utils.mjs";

// Defining some alias
/** @typedef {import("./level.mjs").LevelObject} LevelObject */
/** @typedef {import("./level.mjs").Level} Level */

/**
 * Levels organized in a object.
 * 
 * The key is the {@link LevelObject.name | name} of the {@link Level}.
 * 
 * @typedef { {
 *  [key: String]: import("./level.mjs").LevelObject;
 * } } Levels
 */

/**
 * A object that represents the User.
 * 
 * @typedef {{
 * "email": String,
 * "password": String,
 * "name": String,
 * "borndate": String,
 * "local": String,
 * "gender": String,
 * "levels": Levels,
 * "admin": boolean
 * }} UserObject
 */

/**
 * Represents the state of all the challenges the User is making.
 * 
 * @typedef {{
 *  [key: Number]: Number
 * }} ChallengeState
 */

/**
 * Represents a user/player that plays the game.
 */
export
class User
extends EventModel {
  _email
  /** 
   * The use email that must be unque for each user
   * 
   * @type {String}
   */
  get email() { return this._email };
  set email(value) {
    this._email = value;
  }
  password;
  _name;
  /**
   * The name of the user.
   * 
   * @type {{
   *  nick: String,
   *  full: String,
   *  toString: () => String,
   *  valueOf: () => String
   * }}
   */
  get name() { return this._name }
  set name(value) {
    // do some basic cleanup
    value = cleanup(value);
    // the name will contain only the first word
    this._name = {
      nick: value.split(" ")[0],
      full: value,
      // this method will be called any time the object is converted to string
      toString() {
        return this.nick;
      },
      // this will be called when it is converted to object
      valueOf() {
        return this.full();
      }
    }
  }
  _borndate;
  /**
   * The date the user was born.
   * 
   * @type {Date}
   */
  get borndate() { return this._borndate }
  set borndate(value) {
    this._borndate = new Date(value);
  }
  local;
  _gender;
  get gender() { return this._gender }
  set gender(value) {
    value = String(value).toLowerCase();

    if (value == "female") {
      this._gender = {
        "value": "female",
        "formated": "Feminino"
      }
    } else {
      this._gender = {
        "value": "male",
        "formated": "Masculino"
      }
    }

    // we want to return the formated version if it gets converted to a string
    this._gender.toString = function() { return this.formated }
  };
  
  /** The state of the level the User is currectly playing. */
  get level() { return currentLevel.objectify() };

  /** 
   * Retrive the state of all levels the user as played so far. 
   * 
   * @returns {{
   *  [key: String]: import("./level.mjs").LevelObject
   * }}
   */
  get levels() {
    // load the level from the storage
    let levelLoad = User.load(this.email)
    ? User.load(this.email).levels
    // default to a object if there is none
    : {}

    if(!levelLoad) levelLoad = {}

    // overwrite the current level
    levelLoad[this.level.name] = this.level;

    return levelLoad;
  }

  admin;

  /**
   * Creates a new User and saves it to the store. If the user already exists the
   * data is overwrite.
   * 
   * @param {String} email The email that will also be used as the username;
   * @param {String} password A 8 or greater character long string;
   * @param {String} [name] The name of the user;
   * @param {String | Number} [borndate] The date the user was born;
   * @param {String} [local] The local where the user lives;
   * @param {"male" | "female"} [gender] The gender of the user;
   * @returns {Porxy<User>} A User proxy instance that can autosave;
   * if the {@link autosave} property is set.
   */
  constructor(email, password=null, name=null, borndate=null, local=null, gender=null, admin=false) {
    // just return the logged user if there is in case the email is not defined
    if(!email) {
      const currentUser = User.loggedUser;
      
      if(currentUser) return currentUser
    }

    super();
    
    // if still no email returns undefined
    if(!email) return undefined;

    // if any of the data is not provided we will extract from the storage
    const allDataProvided = password && name && borndate && local && gender;

    // load the user if all the data wasn't provided
    if(!allDataProvided) {
      const data = User.load(email);

      // throws a simple error in case of missing data
      if(!data)
        throw TypeError(`Email ${email} is not registred.`);

      // extract the data to the 
      name = data.name;
      password = data.password;
      borndate = data.borndate;
      local = data.local;
      gender = data.gender
      admin = data.admin
    }

    this.email = email;
    this.password = password;
    this.name = name;
    this.borndate = borndate;
    this.local = local;
    this.gender = gender;
    this.admin = admin

    this.register();

    // save the user everytime the state of the level changes
    Level.addEventListener("change", this.save.bind(this))

    // the returned object will autosave itself each time it is changed
    return AutoSaver(this);
  };

  /** The key tha is used in {@link localStorage}. */
  get _key() {
    return makeKey(this.constructor.name, this.email);
  }

  /** Tells if the User should be autosaved to the storage. */
  autosave = true;

  /** Tells if the User is logged. Setting it to true will log the user and vice-versa. */
  get logged() { return User.loggedUser == this.email };
  set logged(value) {
    value = Boolean(value);

    if(value == this.logged)
      return;

    if(value) this.loggin();
    else this.logout();
  }

  /** 
   * Logs the user in by loginout whoever is logged. 
   * 
   * The current user is set to this User email.
   */
  login() {
    // simply set the current user to this user email
    User.loggedUser = this.email;
  }
  /**
   * Logs out the user if the user is logged
   */
  logout() {
    // only logout if the user is logged in
    if(!this.logged)
      return
    
    User.logout();
  }

  /**
   * Logout whoever user is logged in.
   */
  static logout() {
    // redefine
    User.loggedUser = null;
  }

  /**
   * Represents the User as a genereic object.
   * 
   * @returns {UserObject}
   */
  objectify() {
    return {
      "email": this.email,
      "password": this.password,
      "name": this.name.full,
      "borndate": `${this.borndate.getFullYear()}-${this.borndate.getMonth()}-${this.borndate.getDate()}`,
      "local": this.local,
      "gender": this.gender.value,
      "levels": this.levels,
      "admin": this.admin
    }
  };

  /**
   * Converts to a string representation.
   */
  stringify() {
    return JSON.stringify(this.objectify());
  }

  /**
   * Used by {@link JSON.stringify}, converts to its string representation.
   * @returns 
   */
  toJSON() {
    return this.stringify();
  }

  /**
   * Saves the User object to the {@link localStorage}.
   */
  save() {
    const data = this.objectify();

    localStorage[this._key] = JSON.stringify(data);
  };

  /**
   * Removes the user from the {@link allEmails | storage} and sets the
   * {@link autosave} to `false`.
   */
  remove() {
    User.remove(this.email);
  }

  /**
   * Removes the user from the {@link localStorage | register}.
   * 
   * @param {String} email 
   */
  static remove(email) {
    // removes the object
    localStorage.removeItem(makeKey(this.name), email);
    // removes it from the email list
    this.allEmails = this.allEmails.filter((value, index, array) => value == email ? false : true)
  }

  /**
   * Removes all the users from the {@link localStorage | register}.
   */
  static removeAll() {
    const users = this.instances;

    for(const user of users)
      user.remove();
  }

  /**
   * All the users emails that are currectly registred.
   * 
   * @returns {String[]}
   */
  static get allEmails() {
    const data = localStorage["registredUsers"];

    if(data)
      return JSON.parse(data);
    else return [];
  }

  static set allEmails(value) {
    if(!(value instanceof Array))
      return;

    localStorage["registredUsers"] = JSON.stringify(value);
  }

  static get instances() {
    const allInstances = [];

    for(const email of this.allEmails)
      allInstances.push(new User(email))

    return allInstances;
  }

  /**
   * Verifies if the user already exists.
   * 
   * @param {String} email 
   */
  static exists(email) {
    return this.allEmails.includes(email);
  };
  
  /**
   * Returns a instance of the currently logged user.
   * 
   * @returns {User}
   */
  static get loggedUser() {
    const currentUser = localStorage["currentUser"];

    if(!currentUser) return undefined;

    return new User(localStorage["currentUser"]);
  }
  static set loggedUser(email) {
    if(email instanceof User)
      email = email.email
    
    // only set if the email is registred
    if(!this.allEmails.includes(email))
      return
    
    // remove the current user if the email is not defined
    if(!email) localStorage.removeItem("currentUser");
    // othewise set the email
    else localStorage["currentUser"] = email
  }

  /**
   * Adds the user to the {@link registredUsers}.
   * 
   * @param {User | String} email Can be the {@link User} instance or just
   * the {@link email}.
   */
  static register(email) {
    // if email is a user instance
    if(email instanceof User) {
      // save first
      email.save();
      // trigger event
      email.dispatchEvent("register");
      // retrive the email
      email = email.email
    }

    // make a easy cleaup
    email = cleanup(email);

    const allEmails = this.allEmails;
    
    if(!allEmails.includes(email)) {
      allEmails.push(email);
      this.allEmails = allEmails;
    }
  }
  
  /**
   * Register the user by adding it to the {@link localStorage}.
   */
  register() {
    User.register(this);
  }
  
  /**
   * Will load the user object from the storage.
   * 
   * @param {String} email The registred user Email.
   * @returns {Levels}
   */
  static load(email) {
    const jsonData = localStorage[makeKey(this.name, email)]

    if(!jsonData) return false;

    return JSON.parse(jsonData);
  }

  /**
   * The state of all the challenge the user makes.
   * 
   * Stores the id and the progress only
   * 
   * @type {ChallengeState}
   */
  challenges = {};
}

/**
 * 
 * @returns 
 */
export
const getLoggedUser = () => {
  return User.loggedUser;
}

export const loggedUser = getLoggedUser();