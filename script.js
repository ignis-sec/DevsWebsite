

//TODO: Canvas
var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");
ctx.font = "60px Arial, Helvetica, sans-serif";
canvas.fillStyle = "#ff00ff";
ctx.fillText("PLACEHOLDER FOR CANVAS",80,300);

document.getElementById("defaultOpen").click();//start by clicking default tab

function displayTab(tabName, elmnt) {
    
    var i, tabcontent, buttons;
    tabcontent = document.getElementsByClassName("tabcontent");
    buttons = document.getElementsByClassName("headerTab");
    {
    	for (i = 0; i < buttons.length; i++) //hide everytab
    	{
    		buttons[i].style.backgroundColor = "#225424";
    	}
    }
    if(document.getElementById(tabName).style.display == "block")
    {

    	document.getElementById(tabName).style.display = "none";
    	return;
    }

    for (i = 0; i < tabcontent.length; i++) //hide everytab
        tabcontent[i].style.display = "none";

    	document.getElementById(tabName).style.display = "block";
    	elmnt.style.backgroundColor = "#690102";//show clicked tab
}
