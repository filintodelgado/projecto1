import { Puzzle, createPuzzle, currentLevel, popup, timer } from "../../api/main.mjs";

timer.start();

$(document).ready(function(e) {
    $('img[usemap]').rwdImageMaps(); 
    //Allows image maps to be used in a responsive design by recalculating the area coordinates 
    // to match the actual image size on load and window.resize
});

/**
 * @typedef {{type: String, element: HTMLElement, question: String, answer: String[]}} PuzzleImplementationObject
 */

/**
 * Implements a new puzzle and bind it to the element.
 * 
 * @param {import("../../api/puzzle.mjs").PuzzleType} type 
 * @param {HTMLElement} element 
 * @param {String} question 
 * @param {String[]} answer 
 * @returns {Puzzle}
 */
export
function implementPuzzle(type, element, ...options) {
    const puzzle = createPuzzle(type, ...options);

    element.addEventListener("click", (event) => {
        event.stopPropagation();
        puzzle.click(); 
    })

    return puzzle;
}

/**
 * Given a list of puzzle implements them binding
 * @param {PuzzleImplementationObject[]} puzzles 
 */
export
function implementPuzzles(puzzles) {
    for(const puzzle of puzzles) {
        const type = puzzle.type;
        delete puzzle.type;

        const element = puzzle.element;
        delete puzzle.element;

        const options = Object.values(puzzle);
        implementPuzzle(type, element, ...options);
    }
}

currentLevel.addEventListener("complete", () => {
    timer.pause();
})

timer.addEventListener("stop", () => {
    popup.display("Reiniciando em 5 segundos");

    setTimeout(() => {
        location.reload();
    }, 10000);
})