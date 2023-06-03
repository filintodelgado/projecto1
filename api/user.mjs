import { currentLevel } from "./level.mjs";
import { AutoSaver, cleanup } from "./utils.mjs";

const MALE = 0;
const FEMALE = 1;

/**
 * Represents a user/player that plays the game.
 */
export
class User {
  _email
  /** 
   * The use email that must be unque for each user
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
      // those two methods return the value each time
      // the name is accessed directly or converted to string
      toString() {
        return this.nick;
      },
      valueOf() {
        return this.toString();
      }
    }
  }
  _borndate;
  get borndate() { return this._borndate }
  set borndate(value) {
    this._borndate = new Date(value);
  }
  local;
  _gender;
  get gender() { return this.gender }
  set gender(value) {
    try {
      value = parseInt(value);
    } catch {
      value = String(value).toLowerCase();
    }

    if(value == MALE || value == "male") {
      this._gender = "masculino";
      this._gender.formated = "Masculino";
      this._gender.code = MALE;
    } else if (value == FEMALE || value == "female") {
      this._gender = "feminino";
      this._gender.formated = "Feminino";
      this._gender.code = FEMALE;
    }
  };
  
  /** The state of the level the User is currectly playing. */
  get level() { return currentLevel.odjectify() };

  /**
   * Creates a new User and saves it to the store.
   * 
   * @param {String} email 
   * @param {String} password 
   * @param {String} name 
   * @param {String | Number} borndate 
   * @param {String} local 
   * @param {Number} gender 
   * @returns {Porxy<User>} A User proxy instance that can autosave
   * if the {@link autosave} property is set.
   */
  constructor(email, password, name, borndate, local, gender) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.borndate = borndate;
    this.local = local;
    this.gender = gender;

    // the returned object will autosave itself each time it is changed
    return AutoSaver(this);
  };

  autosave = true;

  odjectify() {};

  save() {
    console.log("working")
  };

  static exists(email) {};

  static load(email) {};
}