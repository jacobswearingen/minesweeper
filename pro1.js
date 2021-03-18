let bomb = "&#128163";
let flag = "&#128681";
function buildTable(h,w,b) {
    window.h = h;
    window.w = w;
    let arrBombs = [];
    for(let k = 0; k < b; k++){
        let randy = Math.floor(Math.random() * h*w);
        while(arrBombs.includes(randy)){
            randy = Math.floor(Math.random() * h*w);
        }
        arrBombs[k] = randy;
    }

    table = document.getElementById("table");
    for(let i = 0; i < h; i++){
        table.insertRow(i);
        for(let j = 0; j < w; j++){
            table.rows[i].insertCell(j);
            let td = table.rows[i].cells[j];
            td.value = "";
            td.neighbors = [];
        }
    }

    for(let i = 0; i < h; i++){
        for(let j = 0; j < w; j++){
            let td = table.rows[i].cells[j];
            if(arrBombs.includes(i*h+j)){
                td.value = bomb;
            }
            for(let m = -1; m <= 1; m++){
                if(((i+m) >=0) && ((i+m) < h)){
                    for(let u = -1; u <= 1; u++){
                        if(((j+u) >= 0) && ((j+u) < w)){
                            let temptd = table.rows[i+m].cells[j+u];
                            if(td.value == bomb){
                                if(temptd.value != bomb)
                                   temptd.value++;
                            }
                            else{
                                td.neighbors.push(temptd);
                            }
                        }
                    }
                }
            }
        }
    }
    for(let i = 0; i < h; i++){
        for(let j = 0; j < w; j++){
            table.rows[i].cells[j].oncontextmenu = function() {return false };
            findClick(table.rows[i].cells[j]); 
        }
    }
    document.getElementById("emoji").innerHTML = "&#128578"; //smiley emoji
    document.getElementById("emoji").onmousedown = function(){
        for(let l = (h-1); l >= 0; l--){
            table.deleteRow(l);
        }
        buildTable(h,w,b)};
}
function findClick(td){
    if(td.value == ""){
        td.onmousedown = function(){event.button == 0 ? blankClick(this) : flagClick(this); };
    }
    else if(td.value > 0 && td.value <= 8){
        td.onmousedown = function(){event.button == 0 ? numClick(this) : flagClick(this); };
    }
    else if(td.value == bomb){
        td.onmousedown = function(){event.button == 0 ? bombClick(this) : flagClick(this); };
    }
}
function blankClick(td){
    td.innerHTML = td.value;
    td.style.backgroundColor = "lightgrey";
    td.onmousedown = null;
    td.neighbors.forEach(reveal);
}
function reveal(te){
if (te.style.backgroundColor != "lightgrey")
    te.onmousedown();
}
function numClick(td){
    td.innerHTML = td.value;
    td.style.backgroundColor = "lightgrey";
    let color = ["blue", "green", "red", "darkBlue", "brown", "cyan", "black", "darkGray"];
    if(!td.value.isNaN)
        td.style.color = color[td.value-1];
    td.onmousedown = null;
}
function bombClick(td){
    for(let i = 0; i < window.h; i++){
        for(let j = 0; j < window.w; j++){
            temptd = table.rows[i].cells[j];
            temptd.onmousedown = null;
            if((temptd.value == bomb) && (temptd.innerHTML != flag)){
                temptd.innerHTML = temptd.value;
                temptd.style.backgroundColor = "lightgrey";
            }
        }
    }
}

function flagClick(td){
    td.innerHTML = flag;
    td.onmousedown =  function(){event.button == 0 ? null : unflagClick(td); };
}
function unflagClick(td){
    td.innerHTML = "";
    findClick(td);
}
