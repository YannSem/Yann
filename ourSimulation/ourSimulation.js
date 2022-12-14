function buildWorld() {
	
	world = new World({ //Welt in der richtigen Grösse erstellen
		hUnits: 300,
		unit: "m",
		minUnits: {x: 0, y:0},
		img: "img/Hintergrund.png",
		fontColor: "#ffffff"
	});

	Player1 = new Actor({img: "img/Aohneboost.png", x: 50, y: 60, wUnits: 14}); //linker Spieler
	Player2 = new Actor({img: "img/Bohneboost.png", x: 450, y: 60, wUnits: 14}); //rechter Spieler
	Ball = new Actor({img: "img/Red-Ball-Transparent.png", x: 267, y: 150, wUnits: 14}); //Ball
	Player1.prepareImage("img/Amitboost.png") //Vorbereiten für den Bildwechsel
	Player2.prepareImage("img/Bmitboost.png") //Vorbereiten für den Bildwechsel
	point1 = 0;
	point2 = 0;
}
   
function setup() {
	w = Math.min(window.innerWidth, 16/9*window.innerHeight)
	document.getElementById("left").style.left = 0.40 * w + "px"
	document.getElementById("right").style.right = 0.40 * w + (window.innerWidth - w) + "px"
	t = 0;
	dt = 0.016;     //Zeitschritt in Sekunden
	Player1.vy = 0; //anullierung Geschwindigkeit Player links
	Player2.vy = 0; //anullierung Geschwindigkeit Player rechts
	min = 60; 
	max = 100; 
    min2 = 1;  
    max2 = 2;  
    p = (Math.random()*(max2 - min2 )) + min2; //nach links oder nach rechts
    p = Math.round(p); //runden

    if (p == 1)    { //Geschwindigkeiten und dadurch auch Winkel randomizer
        Ball.vx = ((Math.random() * (max - min)) + min);
        Ball.vy = -((Math.random() * (max - min)) + min);
    }
    else if (p == 2){ //Geschwindigkeiten und dadurch auch Winkel randomizer
        Ball.vx = -((Math.random() * (max - min)) + min);
        Ball.vy = -((Math.random() * (max - min)) + min);
    }
    Interact = true;
}


p1up = false
p2up = false

window.addEventListener("keydown", down);
window.addEventListener("keyup", up);

function down(event) {
	console.log("Eine Taste wurde gedrückt:", event.key) 
	if (event.key == "w") {   //Wenn taste W gedrückt
		p1up = true 		  //fliege nach oben (siehe unten)
		Player1.changeImage("img/Amitboost.png") //Bildwechsel
		console.log(Player1.vy);
	}
	if (event.key == "ArrowUp") { //Wenn Taste ArrowUp gedrückt
		p2up = true 			  //Anderer Spieler fliegt nach oben (Siehe unten)
		Player2.changeImage("img/Bmitboost.png") // Bildwechsel
		console.log(Player2.vy);
	}
}

function up(event) {
	if (event.key == "w") { //Wenn taste W nicht mehr gederückt
		p1up = false //Lasse dich wieder nach unten fallen (siehe unten)
		Player1.changeImage("img/Aohneboost.png") //Bildwechsel
		console.log(Player1.vy);
	}
	if (event.key == "ArrowUp") {
		p2up = false //Anderer Spieler lässt sich wieder nach unten fallen (siehe unten)
		Player2.changeImage("img/Bohneboost.png") //Bildwechsel
		console.log(Player2.vy);
	}
}


function loop() {
	document.getElementById("left").innerHTML = point1; //Counter neu setzen (Siehe Html code)
	document.getElementById("right").innerHTML = point2; //Counter neu setzen (Siehe Html code)

	if(p1up) { //Boost
		Player1.vy +=2; //Plus 2 weil: 2-1 = 1 (Unten wird minus 1 gerechnet)
		
	}
	
	if(p2up) { //Boost
		Player2.vy +=2; //Plus 2 weil: 2-1 = 1 (Unten wird minus 1 gerechnet)
	}

	Player1.y += Player1.vy *dt; //Position update (Geschwintigkeit mal Zeittick)
	Player2.y += Player2.vy *dt; //Position update (geschwintigkeit mal Zeittick)
	Ball.x += Ball.vx*dt; //Position update (geschwintigkeit mal Zeittick)
	Ball.y += Ball.vy*dt; //Position update (geschwintigkeit mal Zeittick)
	
	if (Player1.y < 15){ //Aufprall am Boden
		Player1.y = 15;
		Player1.vy = 0;
	}
	else{
		Player1.vy -= 1; //Erdanziehungskraft
	}
	if (Player2.y < 15){ //Aufprall am Boden
		Player2.y = 15;
		Player2.vy = 0;
	}
	else{
        Player2.vy -= 1; //Erdanziehungskraft
    }
    if (Ball.y >= 292){ //Abprallen und Bounce //Geschwindigkeitserhöhung um das Spiel zu erschweren
        Ball.vy = -(Ball.vy*1.05); //Geschwindigkeitserhöhung um das Spiel zu erschweren
    }
    if (Ball.y <= 6){ //Abprallen und Bounce
        Ball.vy = -(Ball.vy*1.05); //Geschwindigkeitserhöhung um das Spiel zu erschweren
    }
    if (Ball.x >= 147.5 && Ball.x <= 152.5){ //Zurücksetzen der Interact Variable
        Interact = true;
    }
    if (Ball.x - Player2.x <= 5 && Ball.x - Player2.x >= -5 && Interact == true){ //Abprallen Spieler
        if (Ball.y - Player2.y <=20 && Ball.y - Player2.y >= -20){
            Ball.vx = -(Ball.vx*1.05);
            Interact = false; //Dadurch werden mehrfachige Interaktionen vermieden
        }
    }
    if (Ball.x - Player1.x <= 5 && Ball.x - Player1.x >= -5 && Interact == true){ //Abprallen Spieler
        if (Ball.y - Player1.y <=20 && Ball.y - Player1.y >= -20){
            Ball.vx = -(Ball.vx*1.05);
            Interact = false; //Dadurch werden mehrfachige Interaktionen vermieden
        }
    }
	if (Ball.x <= 6){ //Tor
		point2 += 1; //Counter
		Ball.x = 267; //Reset der Variabeln, die in der Buildworld und nicht in Setup erstellt werden
		Ball.y = 150; // ""
		Player1.x = 50; // ""
		Player1.y = 60; // ""
		Player2.x = 450; // ""
		Player2.y = 60; // ""
		setup(); //reset aller anderen Variabeln
	}
	if (Ball.x >= 528){ //Tor
		point1 += 1; //Counter
		Ball.x = 267; //Reset der Variabeln, die in der Buildworld und nicht in Setup erstellt werden
		Ball.y = 150; // ""
		Player1.x = 50; // ""
		Player1.y = 60; // ""
		Player2.x = 450; // ""
		Player2.y = 60; // ""
		setup(); //Reset aller anderen Variabeln
	}
    world.update();
}
