

//TODO: Canvas
var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");
ctx.font = "60px Arial, Helvetica, sans-serif";
canvas.fillStyle = "#ff00ff";
ctx.fillText("PLACEHOLDER FOR CANVAS",80,300);

document.getElementById("defaultOpen").click();//start by clicking default tab

function displayTab(tabName, elmnt) {
    
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) //hide everytab
        tabcontent[i].style.display = "none";

    document.getElementById(tabName).style.display = "block";//show clicked tab

}
