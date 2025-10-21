const canvas = document.getElementById('screen') as HTMLCanvasElement;

class Game {

	public screen: HTMLCanvasElement | null;
	public ctx: CanvasRenderingContext2D | null = null;
	public scenes: Record<SceneName, () => void> = {
			    Menu: () => this.sceneMenu(),
			    Game: () => this.sceneGame(),
			    GameOver: () => this.sceneGameOver(),
			  };
	//ctx: CanvasRenderingContext2D | null = null;
	isRunning: boolean;
	farame: number;
	scene: string;
	scens_arr: string[];
	isEnemy: boolean;
	seconds: number;
	timer: number;
	lastFire: { x: number; y: number; };
	sceneMap: Map<string, () => void>;
	shipsEnemy: { 4: { x: number; y: number; hor: boolean; life: number; }[]; 3: { x: number; y: number; hor: boolean; life: number; }[]; 2: { x: number; y: number; hor: boolean; life: number; }[]; 1: { x: number; y: number; hor: boolean; life: number; }[]; };
	playerBoardObj: Board;
	shipsPlayer_arr: number[][];
	shipsEnemy_arr: number[][];
	emptyBoardObj: Board;
	gameBord_arr: number[][];

	constructor(canvas: HTMLCanvasElement) {
		this.isRunning = true;
	  	this.screen = canvas;
	    this.ctx = canvas.getContext('2d')!;
		if (!this.ctx) {
			throw new Error("Не удалось получить контекст канваса");
		  }
	    this.scene = '';
	    this.farame = 0;
	    this.scens_arr = ['Menu','Game','GameOver'];

	    this.isEnemy = false;

	    this.seconds = 10;
	    this.timer = setInterval(() => {
			  this.seconds--;
			  if (this.seconds <= -1) {
			    clearInterval(this.timer);
			  }
			}, 1000);

	    this.lastFire = {x:0,y:0};


	    this.sceneMap = new Map<string, () => void>([
			    ['Menu', () => this.sceneMenu()],
			    ['Setup', () => this.sceneSetup()],
			    ['Game', () => this.sceneGame()],
			    ['GameOver', () => this.sceneGameOver()],
			  ]);

	    this.shipsEnemy = {
	    			4:[{x:0,y:0,hor:false,life:4}],
	    			3:[
	    				{x:5,y:1,hor:true,life:3},
	    				{x:9,y:3,hor:false,life:3}
	    				],
	    			2:[
	    				{x:1,y:9,hor:true,life:2},
	    				{x:5,y:7,hor:true,life:2},
	    				{x:9,y:8,hor:false,life:2}
	    				],	    			
	    			1:[
	    				{x:2,y:1,hor:true,life:1},
	    				{x:5,y:4,hor:true,life:1},
	    				{x:3,y:5,hor:true,life:1},
	    				{x:9,y:0,hor:true,life:1}
	    				]
	    		}

	    // Генерируем стартовые массивы
	    // this.shipsPlayer = Array.from({ length: 10 }, (_, i) => Array.from({ length: 10 }, (_, i) => 0));  	
	    // this.shipsEnemy = Array.from({ length: 10 }, (_, i) => Array.from({ length: 10 }, (_, i) => 0));


	    this.playerBoardObj = new Board(this.ctx,this);
	    this.playerBoardObj.genRandomMap();
	    this.shipsPlayer_arr = this.playerBoardObj.arr;
	    
	    // this.shipsPlayer_arr = [
		// 	[1,0,0,0,0,0,0,0,0,1],
		// 	[1,0,1,0,0,1,1,1,0,0],
		// 	[1,0,0,0,0,0,0,0,0,0],
		// 	[1,0,0,0,0,0,0,0,0,1],
		// 	[0,0,0,0,0,1,0,0,0,1],
		// 	[0,0,0,1,0,0,0,0,0,1],
		// 	[0,0,0,0,0,0,0,0,0,0],
		// 	[0,0,0,0,0,1,1,0,0,0],
		// 	[0,0,0,0,0,0,0,0,0,1],
		// 	[0,1,1,0,0,0,0,0,0,1]
		// ];

		// this.shipsEnemy = Array.from({ length: 10 }, (_, i) => Array.from({ length: 10 }, (_, i) => 0));
 		this.shipsEnemy_arr = [
			[1,0,0,0,0,0,0,0,0,1],
			[1,0,1,0,0,1,1,1,0,0],
			[1,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,1],
			[2,0,0,0,0,1,0,0,0,1],
			[0,0,0,1,0,0,0,0,0,1],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,1,1,0,0,0],
			[0,0,0,0,0,0,0,0,0,1],
			[0,1,1,0,0,0,0,0,0,1]
		];

		
		this.emptyBoardObj = new Board(this.ctx,this);
		this.gameBord_arr = this.emptyBoardObj.arr;

	}

	
	gameLoop( currentTime: number = 0 ): void{
		// проверяем остановку игры
		if (!this.isRunning) return;

		// Обновляем логику игры
		this.update()

		// Отрисовываем игру
		this.render()
		
		// контроль фрейм рейта
		requestAnimationFrame((time) => this.gameLoop(time));
	}

	// запуск
	start(): void {
		this.gameLoop()
		console.log('игра запущенна')
		this.scene = 'Game'		
	    this.setupEventListeners();
	}	

	// логика игры
	update(): void {
		// ход игрока
		if(this.seconds == 0 && this.isEnemy){
			this.isEnemy = false;
			this.seconds = 10;
		}

		// ход противника
		if(this.seconds == 0 && !this.isEnemy){
			this.isEnemy = true;
			this.seconds = 10;
		}

		// if(this.isEnemy){
		// 	//ждём ответ от противника
		// 	//если ответ есть сбрасываем счетчик и ход переходит к игроку 

		// 	let enemy = this.sendData(this.lastFire);

		// 	if(enemy){
		// 		this.isEnemy = false;
		// 		this.seconds = 10;
		// 	}
		// }
	}

	// графика
	render(): void {
		this.ctx.clearRect(0, 0, canvas.width, canvas.height);
		// this.farame += 1;
		// console.log('кадры: ',this.farame)
		//console.log(this.scene)
		this.sceneMap.get(this.scene)?.();
	}

	// экран меню
	sceneMenu(): string {

		this.ctx.font = '40px Arial';
		this.ctx.fillText('See Battle', 260, 300);

		this.ctx.font = '20px Arial';
		this.ctx.fillText('Играть', 320, 350);
		
		this.screen.addEventListener('click', (e) => {
			this.scene = 'Setup';
		});
		return 'Меню'
	}

	// экран настройка
	sceneSetup(): string {
		const max_let_ship = 5;
		const bord =this.drawBords();

		this.ctx.fillStyle = 'black';

		this.ctx.font = '20px Arial';
		this.ctx.fillText('Типа расставиляем коробли', 50, 50);

		// this.ctx.font = '20px Arial';
		// this.ctx.fillText('Максимальная длина коробля: ' + max_let_ship, 50, 80);
		
		const buttonSettings = {
					ctx:this.ctx,
					screen:this.screen,
					title:'Дальше',
					x:30, y:100, w:150, h:50,
					color:'blue'
					}
					

		let button = this.button( buttonSettings );

		button.onClick(() => {
		  console.log('Кнопка "Дальше" нажата!');
		});
	}

	// экран игры
	sceneGame(): string {
		this.ctx.fillStyle = 'black';
		this.ctx.font = '20px Arial';

		if(this.isEnemy){			
			this.ctx.fillText('Ход врага: '+this.seconds, 300, 50);
		}else{
			this.ctx.fillText('Твой ход: '+this.seconds, 300, 50);
		}
		

		// рисуем море
		this.emptyBoardObj.drawBords(150,200,40);

		// рисуем карту своих кораблей
		this.emptyBoardObj.drawBords(550,50,10,this.shipsPlayer_arr);

		// this.screen.addEventListener('click', (e) => {
		// 	this.scene = 'GameOver';
		// });

		return 'Игра'
	}

	// экран победы
	sceneGameOver(): string {
		this.screen.addEventListener('click', (e) => {
			this.scene = 'Menu';
		});
		return 'Игра закончина'
	}

	// сеть
	async sendData(data: any) {
	  try {
	    const response = await fetch("http://localhost:8000/cord", {
	      method: "POST",
	      headers: {
	        "Content-Type": "application/json",
	      },
	      body: JSON.stringify(data),
	    });
	    const result = await response.json();
	    console.log(result);
	  } catch (error) {
	    //console.error("Ошибка:", error);
	  }
	  return true;
	}

	// Управление
	setupEventListeners(): void {
	    this.screen.addEventListener('click', (e) => {
		    // const rect = this.screen.getBoundingClientRect();
		    // console.log(rect)

		    const x = Math.floor((e.clientX - 170) / 40);
		    const y = Math.floor((e.clientY - 220) / 40);
		    // console.log(e.clientX,e.clientY)
		    // console.log(x,y)
		    if(!this.isEnemy){

			    if(this.outArray(x,y,this.gameBord_arr)){
			    	if(this.gameBord_arr[y][x] == 0 && this.shipsEnemy_arr[y][x] == 1){
			    		// точно в цель
				    	this.gameBord_arr[y][x] = 3;
				    	this.shipsEnemy_arr[y][x] = 3;
				    	this.seconds = 10;
				    }else if(this.gameBord_arr[y][x] == 0){
				    	// промах
				    	this.gameBord_arr[y][x] = 2;
				    	this.isEnemy = true;
				    	this.seconds = 10;
				    }
			    }

			    // сохраняем последний удар
			    this.lastFire = {x:x,y:y};

			    // проверка на колличество палуб
			    //this.checkCountDeck(x,y);
			    this.emptyBoardObj.checkCountDeck(x,y,this.shipsEnemy_arr);

		    }
		    
	    });
	}

	// проверка выхода за границу массива
	outArray(x,y,arr): boolean{
		return y >= 0 && y < arr.length && x >= 0 && x < arr[y].length
	}

	// начал писать кнопку но вспомнил про обновление экрана ( забил )
	button( settings ){
		const ctx = settings.ctx
		const screen = settings.screen
		const title = settings.title
		const x = settings.x
		const y = settings.y
		const w = settings.w
		const h = settings.h
		const color = settings.color

		const width_text = this.ctx.measureText(title).width
		const height_text = 20

		// console.log(width_text)

		this.ctx.strokeStyle = 'blue';
	    this.ctx.fillStyle = 'blue';
	    this.ctx.lineWidth = 1;

	    this.ctx.strokeRect( x,  y, w, h);
		this.ctx.fillRect( x,  y, w, h);

		this.ctx.fillStyle = 'white';
		this.ctx.font = '20px Arial';
		this.ctx.fillText(
			title, 
			x - width_text/2 + w/2, 
			y + 5 + h/2,
			);

		const object = {
			x,y,w,h,
			onClick: (callback: () => void) => {

					// Добавляем обработчик клика на экран (если его ещё нет)
					if (!screen._buttonClickHandler) {
					screen._buttonClickHandler = (e: MouseEvent) => {
					  const buttons = screen._buttons || [];
					  buttons.forEach((btn: any) => {
					    if (
					      e.clientX > btn.x + 18 &&
					      e.clientX < btn.x + btn.w + 18 &&
					      e.clientY > btn.y &&
					      e.clientY < btn.y + btn.h
					    ) {
					      btn.callback?.();
					    }
					  });
					};
					screen.addEventListener('click', screen._buttonClickHandler);
					screen._buttons = [];
					}

					// Сохраняем кнопку и её колбэк
					if (!screen._buttons) screen._buttons = [];

					screen._buttons.push({x, y, w, h, callback });
				}
			};

		// Возвращаем объект кнопки
		return object
	}



}


class Board{
	ctx: CanvasRenderingContext2D;	
	parent: any;
	ships: { 4: { x: number; y: number; hor: boolean; life: number; }[]; 3: { x: number; y: number; hor: boolean; life: number; }[]; 2: { x: number; y: number; hor: boolean; life: number; }[]; 1: { x: number; y: number; hor: boolean; life: number; }[]; };
	arr: number[][];

	constructor(ctx: CanvasRenderingContext2D,scene: any){
		this.ctx = ctx;
		this.parent = scene;

		this.arr = Array.from({ length: 10 }, (_, i) => Array.from({ length: 10 }, (_, i) => 0));
		this.ships = {
	    			4:[{x:0,y:0,hor:false,life:4}],
	    			3:[
	    				{x:5,y:1,hor:true,life:3},
	    				{x:9,y:3,hor:false,life:3}
	    				],
	    			2:[
	    				{x:1,y:9,hor:true,life:2},
	    				{x:5,y:7,hor:true,life:2},
	    				{x:9,y:8,hor:false,life:2}
	    				],	    			
	    			1:[
	    				{x:2,y:1,hor:true,life:1},
	    				{x:5,y:4,hor:true,life:1},
	    				{x:3,y:5,hor:true,life:1},
	    				{x:9,y:0,hor:true,life:1}
	    				]
	    		}
	}

	genRandomMap(): void{
		console.log('work')

		for(let i=4; i>1; i--){
			
			this.ships[i].forEach( item => {
				console.log(i)
				this.addShip(item,i);
			});
		}

		// let cordDeck = [{x: 8, y: 1}, {x: 8, y: 2}, {x: 8, y: 3}, {x: 8, y: 4}]

		// cordDeck.forEach(item => {
		// 	this.arr[item.x][item.y] = 1;
		// });
		// console.log(this.arr)
		// console.log(this.checkShipEnemy(1,7,this.arr,true))
		
		

		// this.arr = [
		// 	[1,0,0,0,0,0,0,0,0,1],
		// 	[1,0,1,0,0,1,1,1,0,0],
		// 	[1,0,0,0,0,0,0,0,0,0],
		// 	[1,0,0,0,0,0,0,0,0,1],
		// 	[0,0,0,0,0,1,0,0,0,1],
		// 	[0,0,0,1,0,0,0,0,0,1],
		// 	[0,0,0,0,0,0,0,0,0,0],
		// 	[0,0,0,0,0,1,1,0,0,0],
		// 	[0,0,0,0,0,0,0,0,0,1],
		// 	[0,1,1,0,0,0,0,0,0,1]
		// ];
	}

	addShip(ship,item){
		//console.log(ship)
		let x = 0;
		let	y = 0;

		x = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
		y = Math.floor(Math.random() * (9 - 0 + 1)) + 0;

		// console.log(this.ships[4][0].x,'<------')
		ship.x = x;
		ship.y = y;
		
		const cordDeck = this.getShipDecksCord(this.arr, ship, item, x, y)
		//console.log(cordDeck)

		// выесняем выходит за рамки или нет
		let flag=false;
		cordDeck.forEach(item => {
			if(!this.parent.outArray(item.x,item.y,this.arr) &&
				this.checkShipEnemy(item.x,item.y,this.arr,true)){
				console.log('выходит за границу ');
				flag=true;
			}			
		});

		// если да пробуем снова
		if(flag == true){
			this.addShip(ship);
			return
		}
		
		//console.log(cordDeck)
		// ставим корабль
		cordDeck.forEach(item => {
			this.arr[item.x][item.y] = 1;
		});
	}

	drawBords(x:number=150, y:number=200, cellSize:number=40, bord:Array=this.arr): void{
		// const x = 150;
		// const y = 200;
		// const cellSize = 40;
		const round = 10;

		for (let i = 0; i < round; i++) {
	      for (let j = 0; j < round; j++) {
	       
	        this.ctx.strokeStyle = 'blue';
	        this.ctx.fillStyle = 'blue';
	        this.ctx.lineWidth = 1;

	        this.ctx.strokeRect(i * cellSize + x, j * cellSize + y, cellSize, cellSize);
	        
		    if( bord.length > 0  ){
		    	if( bord[j][i] == 1 ){
		        	this.ctx.fillRect(i * cellSize + x, j * cellSize + y, cellSize, cellSize);
		        }
		        if( bord[j][i] == 2 ){
		        	this.ctx.fillRect(i * cellSize + x + cellSize/4, j * cellSize + y + cellSize/4 , cellSize/2, cellSize/2);
		        }
		        if( bord[j][i] == 3 ){
		        	this.ctx.fillStyle = 'gray';
		        	this.ctx.fillRect(i * cellSize + x , j * cellSize + y  , cellSize, cellSize);
		        }
		    }

	        
	      }
	    }
	}

	// проверяем корабль на поражение
	checkCountDeck(x,y,shipsEnemy,gameBoard=this.arr): void{
		const myShips = this.ships;		
		const myBoard = shipsEnemy;
		const deck = [1,2,3,4]
		

		deck.forEach( item =>{
			myShips[item].forEach(ship =>{
				//console.log(ship.hor);

				// получаем все корабли
				let myShip = [];
				const cord = this.getShipDecksCord(shipsEnemy,ship,item,x,y);				
				let isInSlice = cord.some((cord) => cord.x === x && cord.y === y)

				// проверяем попадание
				if(isInSlice){
					
					//console.log(myShip,ship.life);
					ship.life -= 1;

					// проверяем поражение
					if(ship.life < 1){
						cord.forEach(item =>{
							const deltas = [
								[-1,-1],[0,-1],[1,-1],
								[-1,0],[0,0],[1,0],
								[-1,1],[0,1],[1,1]
							]
							
							deltas.forEach( ([dx,dy]) =>{
								this.checkShipEnemy(item.x+dx,item.y+dy,gameBoard);
							});

							console.log('входит',ship.life,cord)
							
						})
					}

				}
			});
			
		});
	}

	// отмечаем точно пустое море / проверка на пересечение с короблями
	checkShipEnemy(x, y, gameBord=this.gameBord_arr, out=false): void {
		const round = 10;
		const deckInt = out ? 1 : 3;
		let arr = gameBord;		

		const startRow = y == 0 ? y : y -1;
		const endRow = y>9 ? y : y+2; // не включается
		const startCol = x == 0 ? x : x-1;
		const endCol = x>9 ? x : x+2; // не включается

		const submatrix = arr
		  .slice(startRow, endRow)
		  .map((row) => row.slice(startCol, endCol));

		// console.log(this.outArray(x,y,arr))
		// console.log(this.parent)
		  console.log(submatrix)
		  console.log(this.parent.outArray(x,y,arr))
		  console.log(submatrix.some((row) => row.includes(deckInt)))
		  //console.log(arr[y][x] != deckInt)

		if(			
			this.parent.outArray(x,y,arr) && // Проверка выхода за границы			
			submatrix.some((row) => row.includes(deckInt)) && // Видим подбитую палубу
			arr[y][x] != deckInt // Проверяем что мы не на палубе			
			){

				if(!out){
					arr[y][x] = 2;
				}else{
					return true;
				}				
			}else{
				if(out){
					return false;
				}
			}
	}

	// получаем кординаты палуб коробля
	getShipDecksCord(shipsEnemy,ship,item,x,y): Array{
		const myBoard = shipsEnemy;
		let myShip = [];
		let isInSlice = false;
		let cord = []
		//console.log(ship.x, ship.y)

		if(!ship.hor){
			myShip = myBoard.
					map((row) => row.slice(ship.x, ship.x+1))
					.slice(ship.y, ship.y+item)

			for(let i=0; i<item; i++){
				cord.push({x:ship.x,y:ship.y+i})
			}
		}else{
			myShip = myBoard[ship.y]
					.slice(ship.x, ship.x+item)
			for(let i=0; i<item; i++){
				cord.push({x:ship.x+i,y:ship.y})
			}
		}
		return cord
	}
}

const game = new Game(canvas);
game.start();


// мусор
	// checkBordEnemy(x,y): boolean {
	// 	this.shipsEnemy_arr 
	// 	if(this.shipsEnemy_arr[y][x] == 1){
	// 		return true
	// 	}else{
	// 		return false
	// 	}
	// }

	// old_checkShipEnemy(): void {
	// 	const round = 10;
	// 	let arr = this.gameBord_arr;
	// 	let arr_u = this.shipsPlayer_arr;

	// 	for (let i = 0; i < round; i++) {
	// 		for (let j = 0; j < round; j++) {
	// 			if( arr[i][j] == 0 ){

	// 				const startRow =   i == 0 ? i : i -1;
	// 				const endRow = i>9 ? i : i+2; // не включается
	// 				const startCol = j == 0 ? j : j-1;
	// 				const endCol = j>9 ? j : j+2; // не включается

	// 				const submatrix = arr
	// 				  .slice(startRow, endRow)
	// 				  .map((row) => row.slice(startCol, endCol));
					
	// 				if(
	// 					submatrix.some((row) => row.includes(3)) && 
	// 					arr[i][j] != 3 && 
	// 					arr_u[i][j] == 0
	// 					){
	// 						arr[i][j] = 2;
	// 				}

	// 			}
	// 		}
	// 	}

	// }



	// sceneMenu(): string {

	// 	this.ctx.font = '40px Arial';
	// 	this.ctx.fillText('See Battle', 260, 300);

	// 	this.ctx.font = '20px Arial';
	// 	this.ctx.fillText('Играть', 320, 350);
		
	// 	this.screen.addEventListener('click', (e) => {
	// 		this.scene = 'Setup';
	// 	});
	// 	return 'Меню'
	// }

	// sceneSetup(): string {
	// 	const max_let_ship = 5;
	// 	const bord =this.drawBords();

	// 	this.ctx.fillStyle = 'black';

	// 	this.ctx.font = '20px Arial';
	// 	this.ctx.fillText('Типа расставиляем коробли', 50, 50);

	// 	// this.ctx.font = '20px Arial';
	// 	// this.ctx.fillText('Максимальная длина коробля: ' + max_let_ship, 50, 80);
		
	// 	const buttonSettings = {
	// 				ctx:this.ctx,
	// 				screen:this.screen,
	// 				title:'Дальше',
	// 				x:30, y:100, w:150, h:50,
	// 				color:'blue'
	// 				}
					

	// 	let button = this.button( buttonSettings );

	// 	button.onClick(() => {
	// 	  console.log('Кнопка "Дальше" нажата!');
	// 	});

	// 	// this.shipsPlayer = [
	// 	// 	[1,0,0,0,0,0,0,0,0,1],
	// 	// 	[1,0,1,0,0,1,1,1,0,0],
	// 	// 	[1,0,0,0,0,0,0,0,0,0],
	// 	// 	[1,0,0,0,0,0,0,0,0,1],
	// 	// 	[0,0,0,0,0,1,0,0,0,1],
	// 	// 	[0,0,0,1,0,0,0,0,0,1],
	// 	// 	[0,0,0,0,0,0,0,0,0,0],
	// 	// 	[0,0,0,0,0,1,1,0,0,0],
	// 	// 	[0,0,0,0,0,0,0,0,0,1],
	// 	// 	[0,1,1,0,0,0,0,0,0,1]
	// 	// ]


	// 	// this.screen.addEventListener('click', (e) => {
	// 	// 	// console.log(e)
	// 	// 	this.scene = 'Game';
			
	// 	// });

		

	// 	return 'Настройки'
	// }