$(document).ready(function(e) {
    $('img[usemap]').rwdImageMaps(); 
    //Allows image maps to be used in a responsive design by recalculating the area coordinates 
    // to match the actual image size on load and window.resize
});

const porta = document.getElementById('porta').addEventListener('click', function() {
    window.location.href = '../html/s_cinema1.html';

});