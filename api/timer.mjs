/**
 * Implements the Timer.
 * 
 * @module cinescape/timer
 */

/**
 * Generic Timer that allows to define a time to counter up to
 * and define callbacks for specific moments in the time.
 * 
 * Allows operantions like pause, resume and stop and define event
 * listeners for those operations.
 * 
 */
export class Timer {
  /**
   * A integer number that represent the time in seconds
   * @typedef {Number} Seconds
   */

  /**
   * A integer number that represent the time in miliseconds
   * @typedef {Number} Miliseconds
   */

  static #minTime = 0;

  /**
   * The minimun time for every {@link Timer}.
  */
  static get minTime() { return this.#minTime }

  /** 
   * The minimun stop time will always be {@link Timer.minTime} + 1
   */
  get minStopTime() { return Timer.minTime + 1 }

  #stopTime = Timer.minTime + 1;
  /**
   * The time in which the timer should stop
   * 
   * by default 
   */
  get stopTime() { return this.#stopTime };
  set stopTime(value) {
    // the stop will be always be at least 
    // be 1 more than the minTime
    value = Math.max(value, this.minStopTime);

    this.#stopTime = value;
  }

  #time = 0;
  /** 
   * The current time in seconds.
   * 
   * Can be set but will never be less than {@link Timer.minTime}
   * 
   * @type {Seconds}
   */
  get time() { return this.#time };
  set time(value) { 
    // the time should never be less than 0 (less then the minimun)
    value = Math.max(
      // garantee that it will never be greater than the stop
      Math.min(value, this.stopTime),
      Timer.#minTime
    )

    // the values should only be integer
    value = Math.floor(value);

    this.#time = value;
  }

  /** 
   * How much the time should be incremented each second. 
   * 
   * Default is 1 second.
   * 
   * @type {Seconds}.
   */
  step = 1;
  
  /**
   * How fast in ms the timer will be refreshed.
   * 
   * Default is 1000 miliseconds or 1 second.
   * 
   * @type {Miliseconds}.
   */
  speed = 1000;

  #paused = false;
  get paused() { return this.#paused };
  set paused(value) {
    if(typeof(value) != "boolean"
    || value == this.#paused) return;

    this.#paused = value
  }

  get running() { return !this.paused };

  /**
   * Increments the time.
   * 
   * @param {Seconds} increment How much should the time be incremented.
   * If no value is provided it will be incremented by the {@link step} 
   * that is 1 by default.
   * 
   * Decrements if the value is negative.
   */
  increment(increment=null) {
    // make sure it is a number
    // if it is not defined set the increment to the step
    increment = increment ? parseInt(increment) : this.step;
    this.time = this.time + increment;
  }

  /**
   * 
   * @param {Seconds} decrement How much should the time be decremented.
   * 
   * If no value is provided it will be incremented by the {@link step} 
   * that is 1 by default.
   * 
   * Increments if the value negative.
   */
  decrement(decrement=null) {
    decrement = decrement ? parseInt(decrement) : this.step;

    // unecessary to decrement manually
    // just use the incremenet with a inverted value
    this.increment(-decrement)
  }

  /**
   * The function that will execute each step;
   */
  _runner() {
    // only run the taks if not paused
    if(this.running) this._task();

    // stop on timeout
    if(this.time == this.stopTime)
      this.stop();

    // the timeout will always be set
    setTimeout(
      // bind so that the value of this stays the same
      this._runner.bind(this),
      this.speed
    )
  }

  /**
   * The tasks the timer will make if it is not paused
   * 
   * Things like:
   * 1. Increment the timer;
   * 1. Trigger Events;
   */
  _task() {
    this.increment();
    this.runBreakingPointCallbacks(this.time);
  }

  start() {
    // only execute if timer is not running
    if(!this.running) return false;

    this._runner();

    return true;
  }

  pause() {
    if(this.paused)
      return false;

    this.paused = true;

    return true;
  }

  reset() {
    // set the time to the minimum
    this.time = Timer.#minTime;
  }

  stop() {
    this.reset();

    // set pause without triggering the event
    this.#paused = true;
  }

  /**
   * The type of the callback called by a breaking point.
   * 
   * @typedef {(this: Timer, timer: Timer) => void} BreakingPointCallback
   */
  
  /**
   * The breaking points callbacks are stored in this object
   * were the key are the time assigned and the value is a 
   * array with the callbacks;
   * 
   * @type {{ [key: number]: Array<BreakingPointCallback> }}
   */
  #breakingPoints = {};

  /**
   * Says if the value is in range of the Timer
   * 
   * @param {Seconds} time 
   * @returns {Boolean}
   */
  _inRange(time) {
    // not a valid integer
    if(!(time = parseInt(time))) return false;

    if(time < Timer.minTime || time > this.stopTime)
      return false;

    return true;
  }

  /**
   * Says if a breaking point array already exists
   * 
   * @param {*} time 
   */
  _isBreakingPointArray(time) {
    if(this.#breakingPoints[time] instanceof Array)
      return true;
    
    return false;
  }
  
  /**
   * Says if there is a breaking point callback defined for
   * the expecific time
   * 
   * @param {Seconds} time 
   */
  _isBreakingPointCallback(time) {
    return this.#breakingPoints[time] ? true : false;
  }

  /**
   * Creates a new breaking point array or return the existing one.
   * 
   * @param {Second} time 
   * @returns {[BreakingPointCallback]}  The new breaking point array if assigned or
   * the breaking point array already defined.
   */
  _createBreakingPointArray(time) {
    let breakingPoint = this.#breakingPoints[time]

    // only creates if it is not already created
    if(!breakingPoint) {
      this.#breakingPoints[time] = [];
      breakingPoint = this.#breakingPoints[time]
    }

    return breakingPoint;
  }

  /**
   * Allows to add a callback to a specific time in the Timer.
   * 
   * @param {Seconds} time
   * @param {BreakingPointCallback} callback
   */
  addBreakingPoint(time, callback) {
    if(!this._inRange(time)) return false;

    const breakingPointArray = this._createBreakingPointArray(time);
    breakingPointArray.push(callback);

    return true;
  }

  removeBreakingPoint(time, callback) {
    if(!this._inRange(time)
    || !this._isBreakingPointArray(time)) 
      return false;
    
    let index;

    // remove all ocurances
    while((index = this.#breakingPoints[time].indexOf(callback)) != -1) {
      this.#breakingPoints[time].splice(index, 1)
    }

    return true
  }

  /**
   * Runs all breaking points callbacks in a specific time
   * 
   * @param {Seconds} time 
   */
  runBreakingPointCallbacks(time) {
    // ignore if there is no callback defined
    if(!this._isBreakingPointArray(time)
    || !this._isBreakingPointCallback(time))
      return;

    for(const callback of this.#breakingPoints[time])
      // binds the this and sets the first argument to this
      callback.bind(this)(this)
  }

  constructor(stop, autostart, step=null) {
    this.stopTime = stop;

    if(autostart) this.start();
    if(step) this.step = step;
  }
}