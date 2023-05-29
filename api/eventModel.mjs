/**
 * Event model that can be extended in a generic way to be implemented and
 * use similar to the default JavaScript owns event model.
 * 
 * @module cinescape/eventModel
 */

/**
 * Defines a *Event Mode* similar to those found on {@link HTMLElement},
 * that can be extended to easily implement the event model uppon a class.
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

  /**
   * The listener is a function that works as a callback when a the especific event
   * is trigged.
   * 
   * @typedef {(this: this, eventData: EventData) => void} EventListener
   */

  /**
   * @type {{[key: String]:  Array<EventListener>}}
   */
  #listeners = {};

  /**
   * Appends a new callback listener that will be dispatched when the event
   * is trigged usign {@link dispatchEvent}.
   * 
   * @param {EventType} type 
   * @param {EventListener} listener 
   * @returns 
   */
  addEventListener(type, listener) {
    if(typeof(listener) != "function")
      return;

    // create the array if is not already there
    if(!this.#listeners[type])
      this.#listeners[type] = [];

    this.#listeners[type].push(listener);
  }

  /**
   * Removes the event listener in target's event listener list with the 
   * same type.
   * 
   * @param {EventType} type 
   * @param {EventListener} listener 
   * @returns 
   */
  removeEventListener(type, listener) {
    if(typeof(listener) != "function")
      return;

    const eventList = this.#listeners[type]
    if(!eventList) return;

    // remove all the occurences
    for(let index = eventList.indexOf(listener); 
      index != -1;
      index = eventList.indexOf(listener))
        eventList.splice(index);
  }

  /**
   * Adds a listener to the event that is removed once dispatched.
   * 
   * @param {EventType} type 
   * @param {EventListener} listener 
   */
  addEventListenerOnce(type, listener) {
    const onceEvent = (...args) => {
      this.removeEventListener(type, listener);
      // use the apply instead of bind so that the function is
      // emidiatly called (applies the this value to the instance
      // and set the arguments)
      listener.apply(this, args);
    }

    this.addEventListener(type, onceEvent);
  }

  /**
   * As {@link dispatchEvent} also dispach property event formated like
   * on[eventType] this utilily function returns the name of the property.
   * 
   * @param {EventType} type 
   * @returns {OnEventType}
   */
  _onEventName(type) {
    return `on${type}`;
  }

  /**
   * Triggers/Dispatch the event by calling all the listeners callback defined
   * for the event type.
   * 
   * @param {EventType} type 
   * @param  {EventData} eventData Will be passed as the first argument to the
   * callback.
   */
  dispatchEvent(type, eventData=null) {
    const eventList = this.#listeners[type];

    if(!eventList) return;

    // call the on[event] property if available

    // call every event applying the this and the event data
    // as the argument
    for(const listener of eventList)
      listener.apply(this, eventData);

    const onEvent = this[this._onEventName(type)];

    if(onEvent) onEvent.apply(this, 
      // the apply requires that second argument to by a array
      [eventData]);
  }
}