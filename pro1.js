let bomb = "&#128163";
let flag = "&#128681";
let smiley = "&#128578";
let mindblown = "&#129327";
let sunglasses = "&#128526";

function buildTable(h,w,b) {
    window.h = h;
    window.w = w;
    window.b = b;
    table.count = h*w;
    let arrBombs = [];
    let randy = Math.floor(Math.random() * h*w);
    while(arrBombs.length < b){
        arrBombs.push(randy);
        while(arrBombs.includes(randy)){
            randy = Math.floor(Math.random() * h*w);
        }
    }
    table = document.getElementById("table");
    table.oncontextmenu = function() {return false };
    for(let i = 0; i < h; i++){
        table.insertRow(i);
        for(let j = 0; j < w; j++){
            table.rows[i].insertCell(j);
            let td = table.rows[i].cells[j];
            td.value = "";
            td.neighbors = [];
            td.opened = false;
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
            findClick(table.rows[i].cells[j]); 
        }
    }
    document.getElementById("emoji").innerHTML = smiley;
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
    td.opened = true;
    wincheck();
    td.style.backgroundColor = "lightgrey";
    td.onmousedown = null;
    td.neighbors.forEach(reveal);
}

function reveal(te){
    if (!te.opened)
        te.onmousedown();
}
function wincheck(){
    table.count--;
    if(table.count==window.b){
        document.getElementById("emoji").innerHTML = sunglasses;
        for(let i = 0; i < window.h; i++){
            for(let j = 0; j < window.w; j++){
                temptd = table.rows[i].cells[j];
                temptd.opened = true;
                temptd.onmousedown = null;
                if(temptd.value == bomb){
                    temptd.innerHTML = flag;
                }
            }
        }
    }
}

function numClick(td){
    td.opened = true;
    wincheck();
    td.innerHTML = td.value;
    td.style.backgroundColor = "lightgrey";
    let color = ["blue", "green", "red", "darkBlue", "brown", "cyan", "black", "darkGray"];
    if(!td.value.isNaN)
        td.style.color = color[td.value-1];
    td.onmousedown = null;
}
function bombClick(td){
    document.getElementById("emoji").innerHTML = mindblown;
    for(let i = 0; i < window.h; i++){
        for(let j = 0; j < window.w; j++){
            temptd = table.rows[i].cells[j];
            temptd.opened = true;
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
