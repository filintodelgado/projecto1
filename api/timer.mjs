/**
 * Implements the Timer.
 * 
 * @module cinescape/timer
 */

import { BreakingPointModel } from "./event.mjs";

/**
 * A integer number that represent the time in seconds
 * @typedef {Number} Seconds
 */

/**
 * A integer number that represent the time in miliseconds
 * @typedef {Number} Miliseconds
 */

/**
 * Generic Timer that allows to define a time to counter up to
 * and define callbacks for specific moments in the time.
 * 
 * Allows operantions like pause, resume and stop and define event
 * listeners for those operations.
 * 
 */
export 
class Timer
extends BreakingPointModel {
  /**
   * All the available events.
   * 
   * @typedef {"start" | "stop" | "pause" | "step" | "reset"} EventType
   */

  /**
   * @typedef {(this: this, eventData: EventData) => void} EventListener
   */

  /** Events Declaration **/
  /**
   * Trigged when {@link Timer} is started or resumed, normally by calling
   * {@link start} method.
   * 
   * @event StartEvent
   */

  /**
   * Trigged when the {@link Timer} is paused, either by timeout (when time reaches stop)
   * or by calling {@link pause} or {@link stop} method.
   * 
   * @event StopEvent
   */

  /**
   * Trigged when the {@link Timer} is paused, either by timeout (when time reaches stop)
   * or by calling {@link pause} or {@link stop} method.
   * 
   * @event PauseEvent
   */
  
  /**
   * Trigged each time {@link Timer} steps foward.
   * 
   * Only trigged when the timer is not {@link paused}.
   * 
   * @event StepEvent
   */

  /**
   * Trigged when the {@link Timer} is reset, either by timeout (when time reaches stop)
   * or by calling {@link reset} or {@link stop} method.
   * 
   * @event ResetEvent
   */

  /**
   * Breakpoints can be assinged to be execute when the {@link Timer}
   * reaches that point.
   * 
   * @event BreakingPoint
   */

  static #minTime = 0;

  /**
   * The minimun time for every {@link Timer}.
  */
  static get minTime() { return this.#minTime }

  /** 
   * The minimun stop time will always be {@link minTime} + 1.
   */
  static get minStopTime() { return Timer.minTime + 1 }

  #stopTime = Timer.minStopTime;
  /**
   * The time in which the timer should stop
   * 
   * by default 
   */
  get stopTime() { return this.#stopTime };
  set stopTime(value) {
    // the stop will be always be at least 
    // be 1 more than the minTime
    value = Math.max(value, Timer.minStopTime);

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

  get remainingTime() { return this.stopTime - this.time};

  #step = 1;
  /** 
   * How much the time should be incremented each second. 
   * 
   * Default is 1 second.
   * 
   * @type {Seconds}.
   */
  get step() { return this.#step };
  set step(value) {
    value = parseInt(value);
    
    if(!value) value = 1;

    this.#step = value;
  }
  
  /**
   * How fast in ms the timer will be refreshed.
   * 
   * Default is 1000 miliseconds or 1 second.
   * 
   * @type {Miliseconds}.
   */
  speed = 1000;

  #paused = true;
  /**
   * Says if the {@link Timer} is paused or not.
   * Modifiying its value may trigger {@link pause} or
   * {@link start} methods.
   * 
   * @fires StartEvent
   * @fires PauseEvent
   */
  get paused() { return this.#paused };
  set paused(value) {
    if(typeof(value) != "boolean"
    || value == this.#paused) return;

    // call methods instead of modifiying the value
    if(value) this.pause();
    else this.start();
  }

  /**
   * Says if the timer is running.
   * 
   * Always inverse of {@link paused}.
   */
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
   * @typedef {{
   *  "type": EventType | "breakpoint",
   *  "time": Seconds,
   *  "remainingTime", Seconds
   *  "target": Timer,
   *  "paused": Boolean,
   *  "running": Boolean
  * }} EventData
   */

  /**
   * Makes the Event Object that will be passed as the argument
   * to the callback when the event is dispatch.
   * 
   * @param {EventType} type 
   * @returns {EventData}
   */
  _makeEventObject(type) {
    return {
      "type": type,
      "time": this.time,
      "remainingTime": this.remainingTime,
      "target": this,
      "paused": this.paused,
      "running": this.running
    }
  }

  /**
   * The function that will execute each step.
   * 
   * It does not trigger the step event. This event is trigged by
   * {@link _task} method so that the event is only trigged when
   * the timer is not paused.
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
   * The tasks the timer will make if it is not paused.
   * 
   * Things like:
   * 1. Increment the timer;
   * 1. Trigger Events;
   * 
   * @fires StepEvent
   */
  _task() {
    this.increment();
    this.dispatchBreakintPoint(this.time);
    this.dispatchEvent("step");
  }

  /**
   * Will start the timer if it is not already started.
   * 
   * Can also be used to resume the execution.
   * 
   * @returns {Boolean} 
   * @fires StartEvent
   */
  start() {
    // can't start what is already started
    if(this.running) return false;

    this.dispatchEvent("start");
    this._runner();

    this.#paused = false;

    return true;
  }

  /**
   * Pauses the timer execution.
   * 
   * @fires PauseEvent
   */
  pause() {
    // can't pause what is already paused
    if(this.paused)
      return false;

    this.dispatchEvent("pause");
    this.#paused = true;

    return true;
  }

  /**
   * Resets the time back to 0 but does not pause the execution.
   * 
   * @fires ResetEvent
   */
  reset() {
    // set the time to the minimum
    this.time = Timer.#minTime;

    this.dispatchEvent("reset");
  }

  /**
   * Resets the time back to 0 and pauses the execution.
   * 
   * @fires StopEvent
   */
  stop() {
    this.reset();
    this.pause();
    this.dispatchEvent("stop");
  }

  /**
   * Create a new instance of a timer with builin event model and breakpoint model.
   * 
   * @param {Seconds} stop How long the timer takes to stop.
   * @param {Boolean} autostart If tthe timer should start right away.
   * @param {Number} step How fast the time will go each second, default 1.
   * 
   * @fires StartEvent
   */
  constructor(stop, autostart=false, step=null) {
    super();

    this.stopTime = stop;

    if(autostart) this.start();
    if(step) this.step = step;
  }

  /* Boilerplate ignore */

  /**
   * Can add those events:
   * 1. start;
   * 1. pause;
   * 1. stop;
   * 1. step;
   * 1. reset;
   * 
   * @param {EventType} type 
   * @param {EventListener} listener 
   * 
   * @inheritdoc
   */
  addEventListener(type, listener) {
    super.addEventListener(type, listener)
  }

  /**
   * @param {EventType} type 
   * @param {EventListener} listener 
   * 
   * @inheritdoc
   */
  addEventListenerOnce(type, listener) {
    super.addEventListenerOnce(type, listener);
  }
  
  /**
   * @param {EventType} type 
   * @param {EventListener} listener 
   * 
   * @inheritdoc
   */
  removeEventListener(type, listener) {
    super.addEventListener(type, listener)
  }

  /**
   * @param {EventType} type 
   * @param {EventData} eventData
   * 
   * @inheritdoc
   */
  dispatchEvent(type) {
    // always pass the EventObject to the callback
    super.dispatchEvent(type, this._makeEventObject(type));
  }

  /** @typedef {Number} Breakpoint */

  /**
   * @param {Breakpoint} breakpoint 
   * @param {EventListener} callback 
   * 
   * @inheritdoc
   */
  addBreakingPoint(breakpoint, callback) {
    super.addBreakingPoint(breakpoint, callback);
  }

  /**
   * @param {Breakpoint} breakpoint 
   * @param {EventListener} callback 
   * 
   * @inheritdoc
   */
  addBreakingPointOnce(breakpoint, callback) {
    super.addBreakingPointOnce(breakpoint, callback);
  }

  /**
   * @param {Breakpoint} breakpoint 
   * @param {EventListener} callback 
   * 
   * @inheritdoc
   */
  removeBreakingPoint(breakpoint, callback) {
    super.removeBreakingPoint(breakpoint, callback);
  }
  
  /**
   * @param {Breakpoint} breakpoint 
   * 
   * @inheritdoc
   */
  dispatchBreakintPoint(breakpoint) {
    super.dispatchBreakintPoint(breakpoint, this._makeEventObject("breakpoint"));
  }

  

  /**
   * Called when the {@link Timer} is started or resumed, normally by calling
   * {@link start} method.
   * 
   * @type {EventListener}
   * @listens StartEvent
   */
  onstart;
  /**
   * Called when the {@link Timer} is stop, either by timeout (when time reaches stop)
   * or by calling {@link stop} method.
   * 
   * @type {EventListener}
   * @listens StopEvent
   */
  onstop;
  /**
   * Called when the {@link Timer} is paused, either by timeout (when time reaches stop)
   * or by calling {@link pause} or {@link stop} method.
   * 
   * @type {EventListener}
   * @listens PauseEvent
   */
  onpause;
  /**
   * Called each time {@link Timer} steps foward.
   * 
   * Only trigged when the timer is not {@link paused}.
   * 
   * @type {EventListener}
   * @listens StepEvent
   */
  onstep;
  /**
   * Called when the {@link Timer} is reset, either by timeout (when time reaches stop)
   * or by calling {@link reset} or {@link stop} method.
   * 
   * @type {EventListener}
   * @listens ResetEvent
   */
  onreset;
}

/**
 * Default timer.
 */
export 
const timer = new Timer();

/**
 * Sets the time for the {@link timer} and starts it.
 * 
 * @param {Boolean} time
 * @param {Seconds} autostart If set to false does not start the timer.
 */
export
function setTime(time, autostart=true) {
  timer.stopTime = time;

  if(autostart) timer.start();
}

/**
 * Stops the {@link timer}.
 */
export
function stop() {
  timer.stop();
}