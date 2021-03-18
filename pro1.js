let bombemoji = "&#128163";
let flag = "&#128681";
let smiley = "&#128578";
let mindblown = "&#129327";
let sunglasses = "&#128526";
let bombval = 9;
let nightuples = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];


function buildTable(h,w,b) {
    let table = document.getElementById("table");
    table.oncontextmenu = function() {return false };
    table.count = h*w;
    table.h = h;
    table.w = w;
    table.b = b;
    let bombNums = [];
    let randy = Math.floor(Math.random() * h*w);
    while(bombNums.length < b){
        bombNums.push(randy);
        while(bombNums.includes(randy)){
            randy = Math.floor(Math.random() * h*w);
        }
    }

    for(let i = 0; i < h; i++){
        table.insertRow(i);
        for(let j = 0; j < w; j++){
            table.rows[i].insertCell(j);
            let td = table.rows[i].cells[j];
            td.neighbors = [];
            td.opened = false;
            td.value = (bombNums.includes(i*h+j))? bombval : "";
        }
    }
    for(let i = 0; i < h; i++){
        for(let j = 0; j < w; j++){
            let td = table.rows[i].cells[j];
            for(let k = 0; k < nightuples.length; k++){
                if(((i+nightuples[k][0]) >= 0) && ((i+nightuples[k][0]) < h) && ((j+nightuples[k][1]) >=0) && ((j+nightuples[k][1]) < w)){
                    let temptd = table.rows[i+nightuples[k][0]].cells[j+nightuples[k][1]];
                    (td.value >= bombval)?temptd.value++:td.neighbors.push(temptd);
                }
            }
        }
    }
    for(let i = 0; i < h; i++){
        for(let j = 0; j < w; j++){
            let td = table.rows[i].cells[j];
            findClick(td); 
        }
    }
    buildEmoji();
}

function buildEmoji(){
    document.getElementById("emoji").innerHTML = smiley;
    document.getElementById("emoji").onmousedown = function(){
        for(let l = (table.h-1); l >= 0; l--){
            table.deleteRow(l);
        }
        buildTable(table.h,table.w,table.b)};

}
function findClick(td){
    if(td.value == ""){
        td.onmousedown = function(){event.button == 0 ? blankClick(this) : flagClick(this); wincheck();};
    }
    else if(td.value > 0 && td.value < bombval){
        td.onmousedown = function(){event.button == 0 ? numClick(this) : flagClick(this); wincheck(); };
    }
    else if(td.value >= bombval){
        td.onmousedown = function(){event.button == 0 ? bombClick(this) : flagClick(this); };
    }
}

function blankClick(td){
    td.opened = true;
    td.style.backgroundColor = "lightgrey";
    td.onmousedown = null;
    table.count--;
    for(let i = 0; i < td.neighbors.length; i++){
        if (!td.neighbors[i].opened)
            td.neighbors[i].onmousedown();
    }
}

function numClick(td){
    td.opened = true;
    td.style.backgroundColor = "lightgrey";
    td.onmousedown = null;
    table.count--;
    td.innerHTML = td.value;
    td.style.color = ["blue", "green", "red", "darkBlue", "brown", "cyan", "black", "darkGray"][td.value-1];
}

function bombClick(td){
    document.getElementById("emoji").innerHTML = mindblown;
    for(let i = 0; i < table.h; i++){
        for(let j = 0; j < table.w; j++){
            temptd = table.rows[i].cells[j];
            temptd.opened = true;
            temptd.onmousedown = null;
            if((temptd.value >= bombval ) && (temptd.innerHTML != flag)){
                temptd.innerHTML = bombemoji;
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

function wincheck(){
    if(table.count==table.b){
        document.getElementById("emoji").innerHTML = sunglasses;
        for(let i = 0; i < table.h; i++){
            for(let j = 0; j < table.w; j++){
                temptd = table.rows[i].cells[j];
                temptd.opened = true;
                temptd.onmousedown = null;
                if(temptd.value >= bombval){
                    temptd.innerHTML = flag;
                }
            }
        }
    }
}
