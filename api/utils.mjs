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