function minesweeper(n) {
	document.getElementById("emoji").innerHTML = "&#128578"; //smiley emoji
	let numBombs = Math.ceil((n*n)/7);
	var arrBombs = [Math.floor(Math.random() * n*n)];
	let randy = Math.floor(Math.random() * n*n);
	for(let k = 0; k < numBombs; k++){
		for(let l = 0; l < arrBombs.length; l++){
			while(arrBombs[l] == randy){
				randy =	Math.floor(Math.random() * n*n)
			}
		}
		arrBombs[k] = randy;
		randy =	Math.floor(Math.random() * n*n)
	}

	table = document.getElementById("table");
	table.flagMode = false;
	table.numOpened = 0;
	window.onkeydown =  function(){ flipTable() };

	for(let i = 0; i < n; i++){
		table.insertRow(i);
		for(let j = 0; j < n; j++){
			table.rows[i].insertCell(j);
			table.rows[i].cells[j].value = "";
			table.rows[i].cells[j].id = i*n+j;
			table.rows[i].cells[j].opened = false;
			table.rows[i].cells[j].flagged = false;
			table.rows[i].cells[j].onmousedown =  function(){ click(this.id, n); };
		}
	}

	for(let i = 0; i < n; i++){
		for(let j = 0; j < n; j++){
			if(arrBombs.includes(i*n+j)){
				table.rows[i].cells[j].value = "&#128163"; //bomb emoji
				for(let m = -1; m < 2; m++){
					if(((i+m) >=0) && ((i+m) < n)){
						for(let u = -1; u < 2; u++){
							if(((j+u) >= 0) && ((j+u) < n)){
								if(table.rows[i+m].cells[j+u].value != "&#128163") //bomb emoji
								table.rows[i+m].cells[j+u].value++;
							}
						}
					}
				}
			}
		}
	}
	document.getElementById("emoji").onmousedown = function(){
		for(let l = (n-1); l >= 0; l--){
			table.deleteRow(l);
		}
		minesweeper(n)};
}

	function flipTable(){
		table = document.getElementById("table");
		table.flagMode = !table.flagMode;
		table.flagMode ? table.style.backgroundColor = "maroon" : table.style.backgroundColor = "black";
	}
	function click(id, n){
		console.log("click!", id);
		table.flagMode ? flag(id, n) : reveal(id, n);
	}

	function flag(id, n){
		let td = document.getElementById(parseInt(id));
		if(!td.opened){
			td.flagged = !td.flagged;
			td.flagged ? td.innerHTML = "&#128681" : td.innerHTML = ""; //flag emoji
		}
	}

	function reveal(id, n) {
		let td = document.getElementById(parseInt(id));
		if(!td.flagged){
			if(td.value == "&#128163"){
				document.getElementById("emoji").innerHTML = "&#129327"; //bomb emoji
				for(let i = 0; i < n; i++){
					for(let j = 0; j < n; j++){
						let alltd = document.getElementById(i*n+j);
						if(alltd.value == "&#128163"){ //bomb emoji
							alltd.innerHTML = alltd.value;
							alltd.style.backgroundColor = "lightgrey";
						}
						alltd.opened = true;
					}
				}
			}
			if(!td.opened){
				td.innerHTML = td.value;
				td.style.backgroundColor = "lightgrey";
				let color = ["blue", "green", "red", "darkBlue", "brown", "cyan", "black", "darkGray"];
				if(!td.value.isNaN)
					td.style.color = color[td.value-1];
				document.getElementById("table").numOpened++;
			}
			td.opened = true;
			if(td.value == ""){
				let canUp = (parseInt(id)-n) >= 0;
				if(canUp){ //up
					let tdup = document.getElementById(parseInt(id)-n);
					if(!tdup.opened){
						reveal(parseInt(id)-n, n);
					}
				}
				let canRight = (parseInt(id) % n != (n-1));
				if(canRight){ //right
					let tdright = document.getElementById(parseInt(id)+1);
					if(!tdright.opened){
						reveal(parseInt(id)+1, n);
					}
				}
				let canDown = ((parseInt(id)+n) < n*n);
				if(canDown){ //down
					let tddown = document.getElementById(parseInt(id)+n);
					if(!tddown.opened){
						reveal(parseInt(id)+n, n);
					}
				}
				let canLeft = (parseInt(id)%n != 0)
				if(canLeft){ //left
					let tdleft = document.getElementById(parseInt(id)-1);
					if(!tdleft.opened){
						reveal(parseInt(id)-1, n);
					}
				}
				if(canUp&&canRight){
					let tdTopRight = document.getElementById(parseInt(id)+1-n);
					if(!tdTopRight.opened){
						reveal(parseInt(id)+1-n, n);
					}
				}
				if(canDown&&canRight){
					let tdBottomRight = document.getElementById(parseInt(id)+1+n);
					if(!tdBottomRight.opened){
						reveal(parseInt(id)+1+n, n);
					}
				}
				if(canDown&&canLeft){
					let tdBottomLeft = document.getElementById(parseInt(id)-1+n);
					if(!tdBottomLeft.opened){
						reveal(parseInt(id)-1+n, n);
					}
				}
				if(canUp&&canLeft){
					let tdTopLeft = document.getElementById(parseInt(id)-1-n);
					if(!tdTopLeft.opened){
						reveal(parseInt(id)-1-n, n);
					}
				}
			}
			if(table.numOpened == n*n-Math.ceil((n*n)/7)){
				document.getElementById("emoji").innerHTML = "&#128526"; //smiley with shades emoji
				for(let i = 0; i < n; i++){
					for(let j = 0; j < n; j++){
						let alltd = document.getElementById(i*n+j);
						alltd.opened = true;
					}
				}

			}
		}

	}
