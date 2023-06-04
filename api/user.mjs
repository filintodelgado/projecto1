import { EventModel } from "./event.mjs";
import { Level, currentLevel } from "./level.mjs";
import { AutoSaver, cleanup } from "./utils.mjs";

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
    super();

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

    // save the user as when finished
    this.save();

    // save the user everytime the state of the level changes
    Level.addEventListener("change", this.save.bind(this))

    // the returned object will autosave itself each time it is changed
    return AutoSaver(this);
  };

  /** The key tha is used in {@link localStorage}. */
  get _key() {
    return makeUserKey(this.email);
  }

  /** Tells if the User should be autosaved to the storage. */
  autosave = true;

  /** Tells if the User is logged. Setting it to true will log the user and vice-versa. */
  get logged() { return User.currentUser == this.email };
  set logged(value) {
    value = Boolean(value);

    if(value == this._logged)
      return;

    if(value) this.loggin();
    else this.logout();
  }

  /** 
   * Logs the user in by loginout whoever is logged.
   */
  login() {}
  /**
   * Logs out the user if the user is logged
   */
  logout() {}

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
   * Saves the User to the storage.
   */
  save() {
    const data = this.objectify();

    localStorage[this._key] = JSON.stringify(data);
  };

  /**
   * Removes the user from the {@link all | storage} and sets the
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
    localStorage.removeItem(makeUserKey(email));
  }

  /**
   * Removes all the users from the {@link localStorage | register}.
   */
  static removeAll() {
    for(const user of this.all)
      this.remove(user);
  }

  /**
   * All the users that are currectly registred.
   * 
   * @returns {String[]}
   */
  static get all() {
    const data = localStorage["registredUsers"];

    if(data)
      return JSON.parse(data);
    else return [];
  }

  /**
   * Verifies if the user already exists.
   * 
   * @param {String} email 
   */
  static exists(email) {
    return this.all.includes(email);
  };
  
  /**
   * Says who is the current loggend user
   */
  static get currentUser() {
    return localStorage["currentUser"];
  }

  /**
   * Adds the user to the {@link registredUsers}.
   * 
   * @param {User | String} value Can be the {@link User} instance or just
   * the {@link email}.
   */
  static register(value) {
    // we will just use the email so if it is a User get the email
    if(value instanceof User)
      value = value.email;

    value = cleanup(value);
    
    const registredUsers = this.all;
    if(!registredUsers.includes(value))
      localStorage["registredUsers"] = registredUsers.push(value);
  }
  
  /**
   * Will load the user object from the storage.
   * 
   * @param {String} email The registred user Email.
   * @returns {Levels}
   */
  static load(email) {
    const jsonData = localStorage[makeUserKey(email)]

    if(!jsonData) return false;

    return JSON.parse(localStorage[makeUserKey(email)]);
  }
}

/** 
 * Makes the key that will be used with {@link localStorage}.
 * 
 * @param {String} email
 * 
 * @returns {`user:${email}`}
 */
function makeUserKey(email) {
  return `user:${email}`
}