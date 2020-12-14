const cnv = document.getElementById("gameScreen");
const ctx = cnv.getContext("2d");
var frames = 0;
const intervalo = 5;
var diryJ,dirxJ;
var shots = []
var tamTelaW = cnv.width;
var tamTelaH = cnv.height;
var hasShot = false;
var score = 0;
var enemyWaves = 0;
var enemies = [];
var lastScore = 0;
var highScore = 0;
var explosions = [];
const explosionImg = new Image();
var shotSound;


function enemySpawnX(){
	return Math.random() * ((cnv.width - enemy.w) - enemy.w) + enemy.w;
}

const background = {
	w: 400,
	h: 600,
	x: 0,
	y: 0,
	img: new Image(),

	desenha() {
		ctx.drawImage(
		background.img, 
		background.x, background.y,
		cnv.width, cnv.height);
	}
};
const player = {
	x: 0,
	y: 0,
	vel: 0,
	live: false,
	w: 31,
	h: 33,
	img: new Image(),
	imgPos: [0, 0, 31, 31],
	deathPos: [64, 64, 94, 94], 
	imgInd: 0,

	atualizaQuadros() {
		const atraso = frames % intervalo === 0;
		if(atraso) {
			if(player.imgInd >= player.imgPos.length - 1) {
				player.imgInd = 0;
			} 
			player.imgInd++;
		};
	},
	explode() {
		player.imgPos = player.deathPos;
		player.imgInd = 0;
	},
	desenha() {
		player.atualizaQuadros();
		const spriteX = player.imgPos[player.imgInd]
		ctx.drawImage(
			player.img, 
			spriteX, 1, 
			player.w, player.h,
			player.x, player.y,
			player.w, player.h);
	},
	atira(){
		if ((player.imgPos[player.imgInd] <= 31) )
			shots.push(new Shot());
	},
	checkExploded(){
		if(player.imgPos[player.imgInd-1] === 94){
			enemies.length = 0;
			shots.length = 0;
			highScore = highscoreCheck(highScore, score);
			player.live = false;
		}
	}
};

var enemy = {
	x:  Math.random() * (cnv.width - 0) + 0,
	y: 0,
	w: 25,
	h: 16,
	img: new Image(),
	imgPos: [1, 1, 26, 26],
	imgInd: 0,
};

class Enemy {
	constructor(posX, posY) {
		this.x = posX;
		this.y = posY;
		this.w = 24;
		this.h = 16;
		this.imgPos = [0, 0, 24, 24];
		this.imgInd = 0;
		this.live = true;
	}
	
	atualizaQuadros() {
		const atraso = frames % intervalo === 0;
		if(atraso) {
			if(this.imgInd >= this.imgPos.length - 1) {
				this.imgInd = 0;
			} 
			this.imgInd++;
		}
	}

	desenha() {
		this.atualizaQuadros();
		const spriteX = this.imgPos[this.imgInd]
		ctx.drawImage(
			enemy.img, 
			spriteX, 1, 
			this.w, this.h,
			this.x, this.y,
			this.w, this.h
		)
	}

	move() {
		if(this.y >= tamTelaH)
			this.y = 0;
		else
			this.y += 2+(enemyWaves/10);
	}

	
}

class Shot {
	constructor() {
		this.x = player.x + (player.w)/2 - 3.5;
		this.y = player.y - 7;
		this.w = 5;
		this.h = 5;
		this.vel = .1;
	}

	desenha() {
		if(this.y > 0){
			ctx.fillStyle = '#F45780';
			ctx.fillRect(this.x, this.y , this.w, this.h);
		}
	}
	
	move() {
		if(this.y > 0){
			this.y-=5;
		}
	}

	hit(){
		ctx.clearRect(this.x, this.y, this.w, this.h);
		score = score + 10;
	}
}

class Explosion {
	constructor(posX, posY){
		this.x = posX;
		this.y = posY;
		this.w = enemy.w;
		this.h = enemy.h;
		this.imgPos = [25, 25, 25, 25, 50, 50, 50, 50];
		this.imgInd = 0;
	}

	atualizaQuadros() {
		const atraso = frames % intervalo === 0;
		if(atraso) {
			if(this.imgInd >= this.imgPos.length - 1) {
				this.imgInd = 0;
			} 
			this.imgInd++;
		}
	}

	desenha() {
		this.atualizaQuadros();
		const spriteX = this.imgPos[this.imgInd]
		ctx.drawImage(
			enemy.img, 
			spriteX, 1, 
			this.w, this.h,
			this.x, this.y,
			this.w, this.h
		)
	}
}

function colisao(obj1, obj2) {
	var objeto1 = {x: obj1.x, y: obj1.y, largura: obj1.w, altura: obj1.h};
	var objeto2 = {x: obj2.x, y: obj2.y, largura: obj2.w, altura: obj2.h};

	if (objeto1.x < objeto2.x + objeto2.largura && 
		objeto1.x + objeto1.largura > objeto2.x && 
		objeto1.y < objeto2.y + objeto2.altura && 
		objeto1.y + objeto1.altura > objeto2.y) {
    	return true;
	};
	return false;
};

function teclaDw(){
	var tecla=event.keyCode;
	if(tecla==38){//Cima
		diryJ=-1;
	}else if(tecla==40){//Baixo
		diryJ=1;
	}
	if(tecla==37){//Esquerda
		dirxJ=-1;
	}else if(tecla==39){//Direita
		dirxJ=1;
	}
	if(tecla==32){//Espaço / Tiro
		//TIRO
		hasShot = true;
	}
}
function teclaUp(){
	var tecla=event.keyCode;
	if((tecla==38)||(tecla==40)){
		diryJ=0;
	}
	if((tecla==37)||(tecla==39)){//Esquerda
		dirxJ=0;
	}

	if (tecla==32 && hasShot==true){
		if(player.live && (player.imgPos[player.imgInd] <= 31)){
			player.atira();
			shotSound.stop();
			shotSound.currentTime(0);
			shotSound.play();
			hasShot = false;
		}
	}
}

function playerControll(){
	player.y+=diryJ*player.vel;
	player.x+=dirxJ*player.vel;

	if (player.x < 0){
		player.x = 0;
	} else if ( player.x + player.w >= cnv.width){
		player.x = cnv.width - player.w
	}

	if (player.y < 0){
		player.y = 0;
	} else if ( player.y + player.h >= cnv.height){
		player.y = cnv.height - player.h
	}
}

function shotControll(){
	for (var i = 0; i < shots.length; i++){
		if (shots[i].y == 0) {
			shots.splice(i, 1);
			break;
		}
		shots[i].desenha()
		shots[i].move()
		
		for (var e = 0; e < enemies.length; e++){
			if (colisao(shots[i], enemies[e])){
				shots[i].hit();
				explosionSound.stop();
				explosionSound.currentTime(0);
				explosionSound.play();
				explosions.push(new Explosion(enemies[e].x, enemies[e].y))
				shots.splice(i, 1);
				enemies.splice(e, 1);
				break;
			}
		}
	}
}

function enemiesControll(){
	if (enemies.length == 0){
		enemyWaves++;
		while(enemies.length < 9){
			enemies.push(new Enemy(enemySpawnX(), 0));
		}
		
	} else {
		for (const e of enemies) {
			e.desenha();
			e.move();
			if(colisao(player, e)){
				explosionSound.stop();
				explosionSound.currentTime(0);
				explosionSound.play();
				player.explode();
				break;
			}
		}
	}
}

function explosionControll() {
	for (const ex of explosions) {
		ex.desenha();
		if(ex.imgInd >= ex.imgPos.length - 1){
			explosions.splice(ex, 1)
			break;
		}
	}
}

function som(fonte){
	this.som = document.createElement('audio');
	this.som.src = fonte;
	this.som.setAttribute('preload', 'auto');
	this.som.setAttribute('controls', 'none');
	this.som.style.display = 'none';   
	document.body.appendChild(this.som);
	this.play = function() {
		this.som.play();
	}
	this.stop = function() {
		this.som.pause();
	}
	this.currentTime = function(time){
		this.som.currentTime = time;
	}
	this.loop = function(bool){
		this.som.setAttribute('loop', bool);
	}

	
	
 };


function gameLoop(){
	if(player.live){
		background.desenha();
		player.desenha();
		
		playerControll();
		enemiesControll()
		shotControll();
		explosionControll();
		player.checkExploded();

		document.getElementById("score").innerHTML = score;
		document.getElementById("highscore").innerHTML = highScore;
		document.getElementById("wave").innerHTML = enemyWaves;
		window.requestAnimationFrame(gameLoop, cnv);
	}
}

function highscoreCheck(scr1, scr2){
	if (scr1 > scr2){
		return scr1
	} else {
		return scr2
	}
}
// Load Assets
player.img.src = 'assets/player/p1.png';
enemy.img.src = 'assets/enemy/e1.png';
background.img.src = 'assets/background/background-space.png';
shotSound = new som('assets/sounds/shot4.wav');
bgMusic = new som('assets/sounds/bg.wav'); // 252 segundos
explosionSound = new som('assets/sounds/explosion2.wav');

function inicia(){
	bgMusic.loop(true);
	bgMusic.play();
	if (!player.live) {
		document.addEventListener("keydown",teclaDw);
		document.addEventListener("keyup",teclaUp);

		// Player live
		player.live = true;
		player.imgPos = [0, 0, 31, 31];

		// Generate Enemies
		while(enemies.length < 9){
			enemies.push(new Enemy(enemySpawnX(), 0))
		}

		//Ini Tela
		tamTelaH=cnv.height;
		tamTelaW=cnv.width;

		//Ini Jogador
		dirxJ=diryJ=0;
		player.x=tamTelaW/2;
		player.y=tamTelaH;
		player.vel=velT=5;

		//Score
		score=0

		//Enemy Waves
		enemyWaves = 1;

		gameLoop();
	}
}
