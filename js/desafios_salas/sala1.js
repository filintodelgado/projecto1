import { currentLevel } from "../../api/level.mjs";
import { loggedUser } from "../../api/user.mjs";
import { applyHUD } from "../HUD.js";
import { implementPuzzles } from "./salas.js";

const porta = document.getElementById('porta');
porta.addEventListener('click', () => {
    loggedUser.save();

    console.log(currentLevel.complete)
    // only go if the level is completed
    if(currentLevel.complete) window.location.href = '../html/s_cinema1.html';
});

const poster = document.querySelector("#poster");
const lixo = document.querySelector("#lixo");
const mesa = document.querySelector("#mesa");

const puzzles = [{ 
        element: poster, 
        type: "puzzleSelect", 
        question: "Qual desses filmes teve a maior bilheteria nos anos 90'", 
        answers: ["Titanic", "Jurassic park", "The Lion King", "Independence day"]
    }, {
        element: lixo, 
        type: "puzzleAsk", 
        question: "Qual o nome do protagonista do filme Matrix", 
        answers: "Neo"
    }, {
        element: mesa, 
        type: "puzzleRange", 
        question: "Em que ano o filme Titanic foi lançado", 
        correct: 1997,
        min: 1990,
        max: 1999
    }];

implementPuzzles(puzzles);

applyHUD();