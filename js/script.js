document.querySelector('#game').innerHTML = '';
init(document.querySelector('#game'));

function init(id){
class Field{
    constructor(selector, rowsNum, colsNum){
	  this._gameEnd = false;
	  
	  this._field = document.querySelector(selector);
	  this._colsNum = colsNum;
	  this._rowsNum = rowsNum;
	  
	  this._dots = new Dots;
	  this._html = new HTML; 
	  this._queue = new Queue(['gamer1', 'gamer2']);
	  
	  this._html.createTable(this._field, this._rowsNum,  this._colsNum);
	  this._run();
	}
	
	_run(){
	  this._field.addEventListener('click', () => {
	    let cell = event.target.closest('td:not(.gamer)'); // если ячейка не имеет класс геймер то все ок
		
		if(!this._gameEnd && cell){
		  let col = this._html.getPrevSiblingsNum(cell); // проверяет соседей получает по ячейки
		   let row = this._html.getPrevSiblingsNum(cell.parentElement); // получает соседа по ряду
		   
		   let gamer = this._queue.getGamer();
		   let dot = new Dot(gamer, cell, row, col, this._dots);
		   this._dots.add(dot, row, col);
		   
		  // console.log(dot);
		   
		   let winLine = this._checkWin(dot);
		   
		   if(winLine){
		    this._win(winLine);
			this._declareWinner();			
		   }
		}
	  });
	}
	
	_declareWinner(){
		  let div = document.createElement('div');			  
			  document.body.appendChild(div); 
			  div.classList.add('popup');
			  div.innerHTML = 'The Winner is:' + '<br>' +getWinnerName(document.querySelectorAll('.winner')) + '<br>' + 'Congratulation!!!';
			  
			  let btn = document.createElement('button');	
			  div.appendChild(btn); 
			  btn.innerHTML = 'X';
			  
			  btn.addEventListener('click', function(){
				  document.body.disabled = false;
				  document.body.removeChild(div);
				  id.innerHTML = '';
				 
				  init(id);
			  });
			  
			  document.body.disabled = true;
	}
	
	_win(winLine){
	 this._gameEnd = true;
	 this._notyfyWinnerCells(winLine);
	}
	
	_notyfyWinnerCells(winLine){
	  winLine.forEach((dot) => {
	    dot.becomeWinner();
	  });
	}
	
	_checkWin(dot){
	   let dirs = [
	    {deltaRow: 0, deltaCol: -1},
		{deltaRow: -1, deltaCol: -1},
		{deltaRow: -1, deltaCol: 0},
		{deltaRow: -1, deltaCol: 1}
	   ];
	   
	   for(let i = 0; i< dirs.length; i++){
	      let line = this._checkLine(dot, dirs[i].deltaRow, dirs[i].deltaCol);
		  
		  if(line.length >= 5){
		     return line;
		  }
	   };
	   return false;
	}
	
	_checkLine(dot, deltaRow, deltaCol){ // проверяет одно из четырех линий
	  let dir1 = this._checkDir(dot, deltaRow, deltaCol);
	  let dir2 = this._checkDir(dot, -deltaRow, -deltaCol);
	  
	  return [].concat(dir1, [dot], dir2);
	}
	
	_checkDir(dot, deltaRow, deltaCol){ // проверяет одно из восьми направлений
	   let result = [];
	   let neighbor = dot;
	   
	   while(true){
	     neighbor = neighbor.getNeighbor(deltaRow, deltaCol);
		 
		 if(neighbor){
		    result.push(neighbor);
		 }else{
		    return result;
		 }
	   }
	}
  }

 class Dots{
    constructor(){
	   this._dots = {};
	}
	add(dot, row, col){
	 if(this._dots[row] === undefined){
	   this._dots[row] = {};
	 } 
	   this._dots[row][col] = dot;
	}
	
	get(row, col){
	 if(this._dots[row] && this._dots[row][col]){
	    return this._dots[row][col];
	 }else{
	   return undefined;
	 }
	}
  }

  class Dot{ // класс Dot представляет собой игровую точку
       constructor(gamer, elem, row, col, dots){
	   
	   this._gamer = gamer; // имя игрока(служебное gamer1 или gamer2)
	   this._elem = elem;
	   this._row = row;
	   this._col = col;
	   this._dots = dots;
	   
	   this._neighbors = {}; // {-1: {1: Dot, 0: Dot}, 0: {0: Dot}}
	   
	   this._findNeighbors();
	   this._notifyNeighbors(); // notify - уведомить
	   this._reflect();
  }
  
  getRow(){
    return this._row;
  }
  
   getCol(){
    return this._col;
  }
  
  becomeWinner(){ // become - стать
    this._elem.classList.add('winner');
  }
  
  getNeighbor(deltaRow, daltaCol){ // neighbors - сосед, этот метод вернет либо ссылку на соседа, либо undefined
    if(this._neighbors[deltaRow] !== undefined){
	  return this._neighbors[deltaRow][daltaCol];
	}else{
	  return undefined;
	}
  }
  
  addNeighbor(neighbor){
     let deltaRow = neighbor.getRow() - this._row;
	  let daltaCol = neighbor.getCol() - this._col;
	  
	  if(this._neighbors[deltaRow] === undefined){
	    this._neighbors[deltaRow] = {};
	  }
	  
	 this._neighbors[deltaRow][daltaCol] = neighbor;
  }
  
  _findNeighbors(){
    this._considerNeighbors(1,1);
	this._considerNeighbors(1,0);
	this._considerNeighbors(1,-1);
	this._considerNeighbors(-1,1);
	this._considerNeighbors(-1,0);
	this._considerNeighbors(-1,-1);
	this._considerNeighbors(0,1);
	this._considerNeighbors(0,-1);
  }
  
  _considerNeighbors(deltaRow, daltaCol){// смотрит есть ли сосед или нет, consider переводится рассмотреть
    let neighbor = this._dots.get(this._row + deltaRow, this._col + daltaCol);
	
	if(neighbor !== undefined && neighbor._belongsTo(this._gamer)){ // принадлежит ли точка тому же игроку
	   this.addNeighbor(neighbor);
	}
  }
  
  _notifyNeighbors(){ // извещает соседей о том что точка появилась(старые точки которые уже поставлены)
    for(let rowKey in this._neighbors){
	   for(let colKey in this._neighbors[rowKey]){
	     this._neighbors[rowKey][colKey].addNeighbor(this);
	   }
	}
  }
  
  _reflect(){// отразить
    this._elem.classList.add('gamer');
       this._elem.classList.add(this._gamer);
	}
	_belongsTo(gamer){
	  return this._gamer == gamer;
	}
  }
  
   class Queue {/// [kj:u] очередь
    constructor(gamers){
	   this._gamers = gamers;
	   this._counter = new Counter(this._gamers.length);
	}
   getGamer(){
     return this._gamers[this._counter.get()];
   }
  }
  
  class Counter { // 3
    constructor(length){
	   this._length = length;
	   this._counter = null;
	}
	
	get(){ // 0  1 2 0 1 2
	  if(this._counter == null){
	    this._counter = 0;
	  }else{
	    this._counter++;
		  if(this._counter == this._length){
		       this._counter = 0;
		  }
	  }
	  return this._counter;
	}
  }
  
  class HTML {
		createTable(parent, rowsNum, colsNum){
		   let table = document.createElement('table');

		 for(let i = 0; i< rowsNum; i++){
			  let tr = document.createElement('tr');
			
		  for(let j = 0; j < colsNum; j++){
			  let td = document.createElement('td');
			  tr.appendChild(td);	
			  
			  let span = document.createElement('span');
			  td.appendChild(span);
			  span.classList.add('radius');
		  }
		     
		  		  table.appendChild(tr);
		}
		parent.appendChild(table);
	 }
 
	 getPrevSiblingsNum(elem){
		let prev = elem.previousSibling; // прев - предыдущий элемент
		let i = 0;
		
		while(prev){
		   prev = prev.previousSibling;
		   i++;
		}
		return i;
	 }
}

function getWinnerName(cells){
	for(let cell of cells){
		return cell.classList[1];
	}
}

let rowsNum;
let colsNum;

 if(parseInt(getComputedStyle(document.querySelector('#wrapper')).width) <= 1200 ||
    parseInt(getComputedStyle(document.querySelector('#wrapper')).width) >= 800){
		 rowsNum = 20;
		 colsNum = 30;
   }if(parseInt(getComputedStyle(document.querySelector('#wrapper')).width) == 450){
	     rowsNum = 15;
		 colsNum = 20;
   }if(parseInt(getComputedStyle(document.querySelector('#wrapper')).width) == 300){
	     rowsNum = 10;
		 colsNum = 15;
   }
   
let field = new Field('#game', rowsNum, colsNum);
}