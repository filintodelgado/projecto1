/**
 * Event model that can be extended in a generic way to be implemented and
 * use similar to the default JavaScript owns event model.
 * 
 * @module cinescape/event
 */

/**
 * Defines a **Event Model** similar to those found on {@link HTMLElement},
 * that can be extended to easily implement the event model uppon a class.
 * 
 * **Do not implement on classes that extends {@link HTMLElement} as it
 * will overwrite the default _event model_**.
 * 
 * Event thought it is similar to the {@link HTMLElement} Event Model it 
 * implements adcional methods not found in that model like 
 * {@link addEventListenerOnce} that removes the callback
 * after calling it.
 * 
 * When using this event model thats some things you have to be aware of:
 * 1. There is no implementation for what events you will use, you can implement
 * listeners and dispatch any event even those you have not implemented. So even
 * if you didn't implement an event for click for example the user can 
 * {@link addEventListener} and them {@link dispatchEvent} the same event and it
 * will just work;
 * 1. Carreful when naming properties starting with "on", when dispatching the
 * event it will run if there is a function associated with on[eventName];
 * 1. {@link addEventListenerOnce} is especial because it adds a listener that is
 * removed once run so take care when using it because as it can be really useful
 * it can lead to unexpected results;
 * 1. Normally the `this` value is set to the instance instead of being passed as the
 * the argument so avoiding usign arrow syntax `(() => {})` as it inherits the this
 * from the context, use function syntax `(function() {})` instead. 
 */
export
class EventModel {
  /**
   * @typedef {String} EventType
   */

  /**
   * @typedef {`on${EventType}`} OnEventType
   */

  /**
   * Data that is passed as the first argument to the listener callback.
   * 
   * @typedef {{
   * [key: String] : String
   * }} EventData
   */

  static listeners = {};
  /**
   * The listener is a function that works as a callback when a the especific event
   * is trigged.
   * 
   * @typedef {(this: this, eventData: EventData) => void} EventListener
   */

  /**
   * @type {{[key: String]:  Array<EventListener>}}
   */
  listeners = {};

  /**
   * Appends a new callback listener to the class stack 
   * that will be dispatched when the event
   * is trigged usign {@link dispatchEvent} on any instance.
   * 
   * @param {EventType} type 
   * @param {EventListener} listener 
   */
  static addEventListener(type, listener) {
    // typecheck
    if(typeof(listener) != "function")
      return;

    // create the array if is not already there
    if(!this.listeners[type])
      this.listeners[type] = [];

    // add the method to the stack
    this.listeners[type].push(listener);
  }

  /**
   * Appends a new callback listener that will be dispatched when the event
   * is trigged usign {@link dispatchEvent}.
   * 
   * @param {EventType} type 
   * @param {EventListener} listener 
   */
  addEventListener(type, listener) {
    // instead of implementing the method upon the intance we can call the static
    // method with the this keyword pointing to the instance
    this.constructor.addEventListener.apply(this, [type, listener]);
  }

  /**
   * Remove the event listener from the class stack with the same type.
   * 
   * @param {EventType} type 
   * @param {EventListener} listener 
   * @returns 
   */
  static removeEventListener(type, listener) {
    if(typeof(listener) != "function")
      return;

    const eventList = this.listeners[type]
    if(!eventList) return;

    // remove all the occurences
    for(let index = eventList.indexOf(listener); 
      index != -1;
      index = eventList.indexOf(listener))
        eventList.splice(index);
  }

  /**
   * Removes the event listener in target's event listener stack with the 
   * same type.
   * 
   * @param {EventType} type 
   * @param {EventListener} listener 
   */
  removeEventListener(type, listener) {
    // call the static method as if it was instance method
    this.constructor.removeEventListener.apply(this, [type, listener]);
  }

  /**
   * Adds a listener to the class stack itself that will will be dispatched 
   * alongside with the instances equivalents.
   * 
   * **Will be remove once run**.
   * 
   * @param {EventType} type 
   * @param {EventListener} listener 
   */
  static addEventListenerOnce(type, listener) {
    const onceEvent = (...args) => {
      this.removeEventListener(type, onceEvent);
      // use the apply instead of bind so that the function is
      // emidiatly called (applies the this value to the instance
      // and set the arguments)
      listener.apply(this, args);
    }

    // event if the method is called as a instance method
    // this method will be called as a instance method without much
    // to do
    this.addEventListener(type, onceEvent);
  }

  /**
   * Adds a listener for the event to the instance that is removed once dispatched.
   * 
   * @param {EventType} type 
   * @param {EventListener} listener 
   */
  addEventListenerOnce(type, listener) {
    this.constructor.addEventListenerOnce.apply(this, [type, listener]);
  }

  /**
   * As {@link dispatchEvent} also dispach property event formated like
   * on[eventType] this utilily function returns the name of the property.
   * 
   * @param {EventType} type 
   * @returns {OnEventType}
   */
  static _onEventName(type) {
    return `on${type}`;
  }

  /** 
   * Simply returns what is the property name of the on[event] property. 
   * Calls {@link Timer._onEventName}.
   */
  _onEventName(type) {
    return this.constructor._onEventName.apply(this, [type])
  }

  /**
   * Run all the callbacks in the {@link listeners} stack and 
   * the on[event] equivalents.
   * 
   * @param {EventType} type 
   * @param  {EventData} eventData 
   */
  _runCallbacks(type, ...eventData) {
    const eventList = this.listeners[type];
    const onEvent = this[this._onEventName(type)];

    // if there is no functions in the stack and no function in the property
    // just exit
    if(!eventList 
      && !onEvent) return;

    // call every event applying the this and the event data
    // as the argument
    if(eventList)
      for(const listener of eventList)
        listener.apply(this, eventData);

    // call the on[event] property if available
    if(typeof(onEvent) == "function") onEvent.apply(this, 
      // the apply requires that second argument to by a array
      [eventData]);
  }

  /**
   * Triggers/Dispatch the event by calling all the listeners callback defined
   * for the event type.
   * 
   * First call the callbacks defined for the instance and them those defined
   * in the class itself.
   * 
   * @param {EventType} type 
   * @param  {EventData[]} eventData Will be passed as the first argument to the
   * callback.
   */
  dispatchEvent(type, ...eventData) {
    const handler = this._runCallbacks;

    // if there is no event data we will send a object representation of the
    // instance
    if(!eventData.length) eventData = [this.objectify()];

    /* Run instance callbacks */
    handler.apply(this, [type, ...eventData])

    /* Run static callbacks */
    handler.apply(this.constructor, [type, ...eventData]);
  }

  /** 
   * Remove all the static callback previouslly defined. 
   * Does not remove the callbacks defined in instances, for that use 
   * {@link removeAllEventListeners}
   */
  static removeAllEventListeners() {
    this.listeners = {};
  }

  /**
   * Empty the listeners stacks removing all the callbacks for all the types.
   * Does not remove the static callbacks, for that use 
   * {@link EventModel.removeAllEventListeners}.
   */
  removeAllEventListeners() {
    this.constructor.removeAllEventListeners.apply(this);
  }
  
  /**
   * Retruns a generic object that reprents the instance.
   */
  objectify() { return {} }; 
}

/**
 * Similar to {@link EventModel} implmenets a **event model** but uses numbers
 * instead of strings.
 * 
 * This model was made to use specificly with {@link module:cinescape/timer.Timer}
 * to have this logical distinct one from another.
 * 
 * @augments EventModel
 * @extends EventModel
 */
export
class BreakingPointModel 
extends EventModel {
  /**
   * @typedef {Number} Breakpoint
   */

  /**
   * @typedef {Object} BreakingPointData
   */

  /**
   * @typedef {(this: this) => void} BreakingPointCallback
   */

  /**
   * @type {{[key: Number]: Function[]}}
   */
  #breakingPoints = {};

  /**
   * Adds a new breakpoint pushing the callback to the stack.
   * 
   * @param {Breakpoint} breakpoint
   * @param {BreakingPointCallback} callback
   */
  addBreakingPoint(breakpoint, callback) {
    breakpoint = parseInt(breakpoint);

    // validate the data and do nothing if it is invalid
    if(!breakpoint
      || typeof(callback) != "function") return

    // add the array if is not there
    if(!this.#breakingPoints[breakpoint])
      this.#breakingPoints[breakpoint] = [];
    
    const breakingPointArray = this.#breakingPoints[breakpoint];
  
    // push the callback to the stack
    breakingPointArray.push(callback);
  }

  /**
   * Adds a new breaking point pushing the callback to the stack.
   * 
   * @param {Breakpoint} breakpoint 
   * @param {BreakingPointCallback} callback 
   */
  addBreakingPointOnce(breakpoint, callback) {
    const callbackOnce = (...args) => {
      this.removeBreakingPoint(breakpoint, callbackOnce);
      callback.apply(this, args);
    }

    this.addBreakingPoint(breakpoint, callbackOnce);
  }

  /**
   * Removes all the occurances of the callback from the type stack.
   * 
   * @param {Breakpoint} breakpoint 
   * @param {BreakingPointCallback} callback 
   */
  removeBreakingPoint(breakpoint, callback) {
    const breakingPointArray = this.#breakingPoints[breakpoint];

    if(!breakingPointArray
      || typeof(callback) != "function") return;

    // remove all ocurances
    for(const index = breakingPointArray.indexOf(callback);
      breakingPointArray != -1;
      breakingPointArray = breakingPointArray.indexOf(callback))
        this.#breakingPoints[breakpoint].splice(index, 1)
  }

  /**
   * Runs all breaking points callbacks in a specific breakpoint;
   * 
   * @param {Breakpoint} breakpoint 
   * @param {BreakingPointData} data
   */
  dispatchBreakintPoint(breakpoint, ...data) {
    breakpoint = parseInt(breakpoint);

    if(!breakpoint) return;

    const breakingPointArray = this.#breakingPoints[breakpoint];

    if(!breakingPointArray) return

    for(const callback of breakingPointArray)
      // binds the this and sets the first argument to this
      callback.apply(this, data);
  }

  /**
   * Simply removes all the breakpoints defined.
   */
  removeAllBreakingPoint() {
    this.#breakingPoints = {};
  }
}