"use strict";

// default data for very first usage
var data = [
				{"name": "HANS", "points": "50000"},
				{"name": "BEATE", "points": "20000"},
				{"name": "FRITS", "points": "5000"}, 
				{"name": "EMPTY", "points": "0"}, 
				{"name": "EMPTY", "points": "0"}, 
				{"name": "EMPTY", "points": "0"}
			];

// set default values vor highscore list at very first usage
if (localStorage.getItem("alreadyRun") === null) {
	for(let i=0; i<data.length; i++){
			localStorage.setItem("alreadyRun", 1);
			localStorage.setItem("player" + i + "_name", data[i].name);
			localStorage.setItem("player" + i + "_points", data[i].points);
	}			
}

window.onload = function(){
	try {
		// check if new data available for highscore list
		if (localStorage.getItem("playerNew_name") !== null) {
			reorderHighscore();
		}

		// fill highscore table dynamically
		for(let i=0; i<data.length-1; i++){
		
		var tableHighscore = document.getElementById("highscore");
		console.log(tableHighscore);
		var tr = document.createElement("tr");

		var td1 = document.createElement("td");
		var text1 = document.createTextNode(i+1 + ".");
		td1.appendChild(text1);
						
		var td2 = document.createElement("td");
		var text2 = document.createTextNode(localStorage.getItem("player" + i + "_name"));
		td2.appendChild(text2);
						
		var td3 = document.createElement("td");
		var text3 = document.createTextNode(localStorage.getItem("player" + i + "_points"));
		td3.appendChild(text3);
						
		var tr_add = tableHighscore;
		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
					
		tr_add.appendChild(tr);
		}
		console.log("highscore list created");
		
	} catch(err) {
		console.log ("an error occured during highscore creation: " + err.message);
	}
		

}



