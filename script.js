

//TODO: Canvas
var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");
ctx.font = "60px Arial, Helvetica, sans-serif";
canvas.fillStyle = "#ff00ff";
ctx.fillText("PLACEHOLDER FOR CANVAS",80,300);


function displayTab(tabName, elmnt) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }

    document.getElementById(tabName).style.display = "block";

}
document.getElementById("defaultOpen").click();