/** 
 * @param {[]} array
 * @returns {[]} A shallow copy of the the array.
 */
export
function cloneArray(array) {
  // just the laziest way to clone an array
  return [...array];
}

/**
 * Shuffles the given array using _Fisher-Yates shuffle algorithm_.
 * 
 * The algorithm starts by It starts from the **last element** in the 
 * array and **swaps** it with a randomly selected element from the 
 * remaining elements, working its way towards the **first element**. 
 * Finally, it returns the shuffled array.
 * 
 * It modifies the original array.
 * 
 * @param {[]} array
 * @returns {[]}
 */
export
function shuffleArray(array) {
  // loop the array
  for (let i = array.length - 1; i > 0; i--) {
    // j will be a n
    const j = Math.floor(Math.random() * (i + 1));
    // swap elements
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

/**
 * Shuffles the array and returns the position of the element.
 * 
 * @param {[]} array 
 * @param {*} element
 * @returns {Number} The position of the given element. If the element
 * is not in the array it returns -1;
 */
export
function shuffleArrayIndex(array, element) {
  if(!array.includes(element))
    return -1;

  shuffleArray(array);
  return array.indexOf(element);
}

/**
 * Generates numbers.
 * 
 * @returns A {@link Generator} Object in which we can call {@link Generator.next}
 * to generate the next number.
 * @generator
 */
export
function* numberGenerator(start=0, stop=null) {
  let number = start;

  // if there is a stop
  while(stop 
    ? stop >= start
    : true)
    yield number++;
}

/**
 * Does some basic cleanup on the provided string.
 * 
 * @param {String} string 
 * @returns {String}
 */
export
function cleanup(string) {
  // in case the string is invalid return a empty string
  if(!string || typeof(string) != "string") return "";

  // removes the white space at the start and end of a string
  return string.trim();
}

export
function cleaupId(string) {
  // replaces the space with dashed (-)
  return cleanup(string).toLowerCase().replace(" ", "-");
}

/**
 * Makes a key to be used as {@link localStorage} key.
 * 
 * @param {String} prefix 
 * @param {String} sufix 
 * @returns {`${prefix}:${sufix}`}
 */
export
function makeKey(prefix, sufix) {
  return `${cleaupId(prefix)}:${cleanup(sufix)}`
}

/**
 * Makes a key to be used as {@link localStorage} key based on a class instance.
 * 
 * @param {{
 *   name: String,
 *   constructor: {
 *     name: String
 *   }
 * }} instance
 */
export
function makeInstanceKey(instance) {
  return makeKey(instance.constructor.name, instance.name);
}

/**
 * @typedef { {
 *  autosave: Boolean,
 *  save: () => void
 * } } Autosaveble
 */

/**
 * Creates a proxy that will autosave the odject each time a property is changed.
 * 
 * @param {Autosaveble} instance The instance needs to have
 * a `autosave` boolean property and a save method.
 */
export
function AutoSaver(instance) {
  return new Proxy(instance, {
      set(target, prop, value) {
        // only save if the autosave is set
        if(target.autosave 
          && typeof(target.save) == "function")
          target.save();

        // do the default action
        target[prop] = value;

        return true;
    }
  });
}