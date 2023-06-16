import { Puzzle, createPuzzle } from "../../api/main.mjs";

$(document).ready(function(e) {
    $('img[usemap]').rwdImageMaps(); 
    //Allows image maps to be used in a responsive design by recalculating the area coordinates 
    // to match the actual image size on load and window.resize
});

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
function implementPuzzle(type, element, question, answer) {
    const posterPuzzle = createPuzzle(type, question, answer);

    element.addEventListener("click", (event) => {
        event.stopPropagation();
        posterPuzzle.click(); 
        console.log("working")
    })

    return posterPuzzle;
}