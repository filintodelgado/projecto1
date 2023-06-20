import { EventModel } from "./event.mjs";
import { loggedUser } from "./user.mjs";
import { AutoSaver, makeKey } from "./utils.mjs";
import { Puzzle, PuzzleChoose, PuzzleSelect, PuzzleDrag } from "./puzzle.mjs";
import { currentLevel } from "./level.mjs";
import { Timer } from "./timer.mjs";

/**
 * A Object that represents the challenge.
 * 
 * @typedef {{
 * type: String,
 * id: Number,
 * key: String,
 * goal: Number
 * }} ChallengeObject
 */

/**
 * Represents a challenge that the user can complete.
 * 
 * The challenge will listen for a {@link Challenge.event | event} in a 
 * {@link Challenge.object|object} and run the {@link handle}.
 */
export
class Challenge 
extends EventModel{
  /**
   * Contains all the id of all the challenges that are registred.
   * 
   * @type {Challenge[]}
   */
  static get all() {
    let challenges = localStorage["challenges"];

    if(!challenges) return [];

    return JSON.parse(challenges);
  }
  static set all(instance) {
    // overwrite if it is an array
    if(instance instanceof Array) {
      localStorage["challenges"] = JSON.stringify(instance);
      return;
    }
    // needs to be a id
    else if(parseInt(instance) === NaN) return;

    instance = parseInt(instance);
    const all = this.all;
    // only store if it is not included already
    if(all.includes(instance)) return;
    all.push(instance);
    localStorage["challenges"] = JSON.stringify(all);
  }

  /**
   * Includes all the challenges that are stored.
   * 
   * @type {Challenge[]}
   */
  static get allInstances() {
    const all = [];

    // restore the challenges and store in the array
    for(const id of this.all) all.push(this.restore(id));

    return all;
  }

  /**
   * Returns a unique number ID for {@link Challenge} each time it is ccalled.
   * Remenber the last ID as it uses the {@link localStorage}.
   * 
   * @returns {Number}
   */
  static getId() {
    if(!localStorage["challengeid"]) localStorage["challengeid"] = 0;
    
    let id = parseInt(localStorage["challengeid"]);
    localStorage["challengeid"] = id + 1;

    return id;
  }

  /**
   * A unique id that identifies challenges among itselfs.
   * 
   * @type {Number}
   */
  id = 0;

  /**
   * Makes a a key for the give {@link challengeId | challenge id}.
   * 
   * @param {Number} challengeId 
   * @returns {`${Challenge.name}:${challengeId}`}
   */
  static key(challengeId) {
    return makeKey(Challenge.name, String(challengeId));
  }

  /**
   * A key that uniquily identifies the challenge.
   * 
   * @returns {Number}
   */
  get key() {
    return Challenge.key(this.id);
  }

  /**
   * The value the user is expected to reached.
   * 
   * @type {Number}
   */
  goal = 0;

  /**
   * The imediate value before the {@link progress} was alterated.
   * 
   * @type {Number}
   */
  oldProgress = 0;

  /**
   * Indicates how much the {@link progress} **increased** when it was modified.
   * 
   * @type {Number}
   */
  get increase() { return this.progress - this.oldProgress };
  /**
   * Indicates how much the {@link progress} **decreased** when it was modified.
   */
  get decrease() { return -this.increase };

  /**
   * How user is progressing.
   * 
   * When the progress gets equal to to goal the challenge is consider
   * completed.
   * 
   * The progress may overpass the goal.
   */
  get progress() {
    // set up the progress if not set
    if(!loggedUser.challenges[this.id])
      loggedUser.challenges[this.id] = 0;

    return loggedUser.challenges[this.id];
  };
  set progress(value) {
    // only accept numbers
    if(typeof(value) != "number") return;

    // dont let it go below zero
    value = Math.max(0, value);

    // dont change if the new value is equal
    if(value == this.progress) return;

    // the last valu is useful to validate if the user increase
    // or decrease
    this.oldProgress = this.progress;
      
    // the value is changed in the user object
    loggedUser.challenges[this.id] = value;

    // we want to trigger the event after changing the value
    this.dispatchEvent("progress");

    // trigger events based if the value increase or decrease
    if(value > this.oldProgress) this.dispatchEvent("increase");
    else this.dispatchEvent("decrease");

    // trigger the complete event if the goal is reached
    if(this.progress == this.goal) this.dispatchEvent("complete");;
  }

  /**
   * Will complete the challenge if not completed by setting the progress to the save value
   * as the goal.
   * 
   * @returns 
   */
  complete() {
    if(this.completed)
      return false;
    
    // if not completed simply force the progress to be equal to goal
    this.progress = this.goal;
  }

  /**
   * Uncompletes the challenge by setting the progress back to 0.
   * 
   * @returns 
   */
  uncomplete() {
    if(!this.completed)
      return false;
    
    this.progress = 0;
    this.dispatchEvent("uncomplete");
  }

  /**
   * Says if the goal as been reached. If set to `true` will make the progress reach goal,
   * if set to `false` will reset the progress.
   * 
   * @type {Boolean}
   */
  get completed() {
    // we consider that it is completed when the progress is equal to the goal
    return this.progress >= this.goal;
  }
  set completed(value) {
    if(typeof(value) != "boolean" || value == this.completed)
      return;
    
    if(value) this.complete();
    else this.uncomplete();
  }

  /**
   * How much it remains for the user to reach the goal.
   */
  get remaining() {
    return this.goal - this.progress;
  }

  /**
   * @param {Number} value 
   * @returns 
   */
  increaseProgress(value=1) {
    // do nothing if it is not a number
    if(typeof(value) != "number") return
      
    this.progress+=value;
  }

  /**
   * @param {Number} value 
   */
  decreaseProgress(value=1) {
    this.increaseProgress(-value);
  }

  /** The type of the challenge */
  type = "challenge";

  /**
   * Turns the challenge into a generic object.
   */
  objectify() {
    // access the objectify method of the class
    return this.constructor.objectify(this);
  }

  /**
   * Turns the challenge into a JSON string.
   * 
   * @retuns {String}
   */
  stringify() {
    // convert to json notation string
    return JSON.stringify(this.objectify());
  }

  toJSON() {
    return this.stringify();
  }

  /**
   * The schema that {@link objectify} uses to make the object.
   * 
   * Contains all the keys that will be stored.
   */
  static schema = ["type", "id", "key", "goal"];

  /**
   * Adds new {@link keys | key(s)} to the {@link schema} that will be include when
   * exporting the instance as an object.
   * 
   * @param  {...String} keys 
   */
  static addToSchema(...keys) {
    for(const key of keys) {
      // only add if not included to avoid repetition
      if(!this.schema.includes(key))
        this._schema = this.schema.push(key);
    }
  }

  /**
   * Removes all the {@link keys | key(s)} from the {@link schema}.
   * @param  {...any} keys 
   */
  static removeFromSchema(...keys) {
    // will filter out all the keys contained in schema
    this._schema = this._schema.filter((value) => !keys.includes(value))
  }

  /**
   * Turns the challenge into a generic object.
   * 
   * @param {Challenge} instance 
   * @returns {ChallengeObject}
   */
  static objectify(instance) {
    const obj = {};

    for(const key of this.schema) obj[key] = instance[key];

    return obj;
  }

  _handler;
  /**
   * The handler that is called when the event is trigged.
   * 
   * The challenge will listen to a expecific {@link event} on a given {@link object}
   * and will run this handler when so.
   * 
   * @type {(this: this) => void}
   */
  get handler() { return this._handler };
  set handler(value) {
    // the handler must be a function
    if(typeof(value) != "function") return;

    // save the last handler as we will remove it from the objects
    const lastHandler = this._handler

    // bind the this value and save it
    this._handler = value.bind(this);

    // remove the last handler from the objects and add the new
    const objects = !(this.object instanceof Array)
    ? [this.object]
    : this.object;

    for(const object of objects) {
      object.removeEventListener(this.event, lastHandler);
      object.addEventListener(this.event, this._handler);
    };
  }
  /**
   * The event the Challenge will listen to on {@link object}.
   * 
   * @type {String}
   */
  event;
  /**
   * The object(s) the event will be applied to.
   * 
   * @type {EventModel | EventModel[]}
   */
  object;

  /**
   * Creates a new challenge intance.
   * 
   * You can restore a challenge by providing the optional arguments or using the
   * {@link restore}
   * 
   * @param {Number} goal 
   * @param {Number} progress 
   * @param {Boolean} completed 
   * @param {Number} id 
   */
  constructor(goal, progress=0, completed=false, id=null) {
    super();

    // the goal is the only required argument it specifies when the challange can be
    // considered complete
    this.goal = goal;
    // the user can provide a process if the challange as been started before
    this.progress = progress;
    // if the challange as been completed completed can also be provided
    this.completed = completed;
    // the id is normally autoseted but it can be provided it the challange is been restored
    this.id = id;
    if(!id) this.id = Challenge.getId();

    // subclasses should define a handler when the there is a progress
    if(this.handler) {
      let objects = this.object;

      // the object can be eather a array or a single array we will use it as an array
      // so it is easy to use the loop
      if(!(objects instanceof Array)) objects = [objects];
      
      for(const object of objects)
        // apply the event listener to all of them
        object.addEventListener(this.event, this.handler);
    }
  }

  #removed = false;
  get removed() { return this.#removed };
  set removed(value) {
    // only accepts boolean values
    if(typeof(value) != "boolean"
    || value == this.#removed) return;


  }

  /**
   * Adds the id to the list in {@link localStorage}.
   * @param {Number} id 
   */
  static add(id) {
    this.all = id;
  }
  /**
   * Register the instance to the challenge list.
   */
  add() {
    Challenge.add(this.id);
    this.#removed = false;
  }
  
  /**
   * Removes the id from the challenge list in {@link localStorage}.
   * @param {*} id 
   */
  static remove(id) {
    id = parseInt(id);
    this.all = this.all.filter((value) => value != id);
  }

  /**
   * Removes the instance from the challenge list.
   */
  remove() {
    Challenge.remove(this.id);
    this.#removed = true;
  }

  /**
   * Save the challenge to the localStorage using the property {@link key} as the key.
   */
  save() {
    if(!this.#removed) this.add();
    Challenge.save(this);
  }

  /**
   * Saves the challenge to the localStorage using the property {@link key} as the key.
   * 
   * @param {Challenge} instance 
   */
  static save(instance) {
    localStorage[instance.key] = instance.toJSON();
  }

  /**
   * Restores a challenge saved in the {@link localStorage}.
   * 
   * @param {String | Number} id Can be eather the number id or the key used in localStorage.
   */
  static restore(id) {
    // if the id is a number it means it is not a key so make the key
    if(typeof(id) == "number") id = this.key(id);

    // get the string data
    let restored = localStorage[id];

    if(!restored) return false

    // convert to a object
    restored = JSON.parse(restored);

    // return a new challenge with the data restored
    return createChallenge(restored.type, restored.goal, restored.level);
  }

  static get readableTeplate() {}

  /**
   * A redable string that represents the challenge.
   */
  get readable() {}
}

/**
 * Defines a challenge that the User is asked to solve a centain
 * number of puzzles.
 */
export
class SolvePuzzleChallenge
extends Challenge {
  constructor(goal, progress=0, completed=false, id=null) {
    super(goal, progress, completed, id);

    // setup the type and save it
    this.type = "solvePuzzle";

    // setup the puzzle object
    this.object = Puzzle

    // setup the event
    this.event = "solve";

    // setup the handler to increase progress when user completes a puzzle
    this.handler = function() {
      // wrap it inside a function because the event passes a argument that will mess up
      // the value argument that increaseProgress uses
      this.increaseProgress();
    };

    this.save();

    // return a proxy that saves automaticly
    return AutoSaver(this);
  }
}

/**
 * A challenge that asks the user to complete a specific Level.
 */
export
class CompleteLevelChallenge
extends Challenge {
  constructor(goal, progress=0, completed=false, id=null) {
    super(goal, progress, completed, id);

    this.type = "completeLevel";

    this.object = Level;

    this.event = "complete";

    this.handler = function() {
      this.increaseProgress();
    };

    this.save();

    return AutoSaver(this);
  }
}

/**
 * A challenge that asks the user to solve a centain number of puzzles in
 * a expecific Level.
 */
export
class SolvePuzzleInLevelChanllenge
extends Challenge {
  /** @typedef { Challenge & {level: String} } ChallengeObject */

  /** 
   * The level the user is suppost to solve the puzzles in.
   * 
   * @type {String}
   */
  level;

  constructor(goal, level, progress=0, completed=false, id=null) {
    super(goal, progress, completed, id);

    if(!level) throw TypeError("Challenge: level is required.");

    this.level = level

    this.type = "solvePuzzleLevel";

    this.object = Puzzle;

    this.event = "solve";

    this.handler = function() {
      // only increment if the level is the same as the current level the user is playing
      if(this.level == currentLevel.name)
        this.increaseProgress();
    }

    // append the new level key to the scheme before saving
    this.constructor.addToSchema("level");
    this.save();

    return AutoSaver(this);
  }
}

/**
 * A challenge that the user is asked to complete a level in under than the
 * given seconds.
 */
export
class CompleteUnderSecondsChallenge
extends Challenge {
  // the complete works different here
  // it will be completed if the progress is below the goal
  get completed() { return this.progress < this.goal }

  constructor(goal, progress=0, completed=false, id=null) {
    super(goal, progress, completed, id);

    // reset progress everytime the challenge is start so that the user can restart the
    // level and try the challenge again
    this.progress = 0;

    this.type = "completeUnderSeconds";

    this.object = Timer;

    this.event = "step";

    this.handler = function() {
      this.increaseProgress();
    }

    this.save();

    return AutoSaver(this);
  }
}

/** All the challenges defined */
const allChallenges = Challenge.all;

/**
 * @description Creates a new {@link Challenge} for one of the 4 types.
 * 
 * @param {String} type The type of the puzzle.
 * @param {Number} goal When the challenge should be consider completed.
 * @param {...*} args The optional data.
 * @returns {Challenge}
 * 
 * @overload
 * 
 * A challenge that requires the user to solve a {@link goal | number} of puzzles. 
 * 
 * @param {"solvePuzzle"} type
 * @param {Number} goal How many puzzle the user must solve.
 * @param {Number} [progress] How much puzzle the user has solved so far.
 * @param {Boolean} [completed] Has the user solved all the puzzles yet?
 * @returns {SolvePuzzleChallenge}
 * 
 * @overload
 * 
 * Creates a challenge that requires the user to complete a expecific {@link level}.
 * 
 * @param {"completeLevel"} type
 * @param {Number} goal How many times the user needs to complete levels.
 * @param {Number} [progress] How much times the user has completed levels.
 * @param {Boolean} [completed] Has user completed the levels {@link goal | time}.
 * enougth to be consider completed.
 * @returns {CompleteLevelChallenge}
 * 
 * @overload
 * 
 * Creates a challenge that requires the user to complete a centeain number of 
 * {@link goal | puzzles} in a centain {@link level}.
 * 
 * @param {"solvePuzzleLevel"} type
 * @param {Number} goal How many times the user needs to solve puzzles in the {@link level}.
 * @param {String} level The level the user should solve puzzles in.
 * @param {Number} [progress] How much times the user has completed those {@link goal | puzzles}.
 * @param {Boolean} [completed] Has user solved the puzzles {@link goal | time}
 * enougth to be consider completed.
 * @returns {SolvePuzzleInLevelChanllenge}
 * 
 * @overload
 * 
 * Creates a challenge that requires the user to complete a expecific {@link level} under a number
 * of {@link goal | seconds}.
 * 
 * @param {"completeUnderSeconds"} type
 * @param {Number} goal How much time the user as to complete the level.
 * @param {Number} [progress] How much time the user as take in the level.
 * @param {Boolean} [completed] Has user completed the levels under the expecifid
 * {@link goal | time}.
 * @returns {CompleteUnderSecondsChallenge}
 */
export
function createChallenge(type, goal, ...args) {
  /**
   * Holds the correct challenge type constructor the user selected
   * 
   * @type {Challenge}
   */
  let challenge;

  switch(type) {
    case "solvePuzzle":
      challenge = SolvePuzzleChallenge;
      break;
    case "completeLevel":
      challenge = CompleteLevelChallenge;
      break;
    case "solvePuzzleLevel":
      challenge = SolvePuzzleInLevelChanllenge;
      break;
    case "completeUnderSeconds":
      challenge = CompleteUnderSecondsChallenge;
      break;
    default:
      break;
  }

  // create challenge using the args
  if(challenge) return new challenge(goal, ...args);
  else return false;
}

/**
 * Restores a challenge from the {@link localStorage}.
 * 
 * @param {Number | String} id eather the id or the key used in {@link localStorage}.
 * 
 * @returns {Challenge}
 */
export
function restoreChallenge(id) {
  return Challenge.restore(id);
}