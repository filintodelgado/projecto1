import { currentLevel } from "../../api/level.mjs";
import { loggedUser } from "../../api/user.mjs";
import { applyHUD } from "../HUD";

// hasn't completed previous level
// requires to complete bilheteria first
if(loggedUser.levels["Bilheteria"].puzzlesUnsolved > 0) {
   location.href = "../html/s_bilheteira.html";
}

const porta2 = document.getElementById('porta').addEventListener('click', function() {
    if(currentLevel.complete) location.href = '../html/s_projecao.html';
});


applyHUD();