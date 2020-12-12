var cnv = document.getElementById("gameScreen");
var ctx = cnv.getContext("2d");
var frames = 0;
const intervalo = 2;
var diryJ,dirxJ;

var delay = ( function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();

var player = {
	x: 0,
	y: 0,
	vel: 0,
	live: false,
	w: 31,
	h: 33,
	img: new Image(),
	imgPos: [1, 1, 32, 32],
	imgInd: 0,

	atualizaQuadros() {
		const atraso = frames % intervalo === 0;
		if(atraso) {
			if(player.imgInd > player.imgPos.length) {
				player.imgInd = 0;
			} 
			player.imgInd++;
		};
	},
	explode() {
		if(colisao(player, enemy)) {
			ctx.clearRect(player.x, player.y, player.w, player.h);
			player.live = false			
		}
	},
	desenha() {
		player.atualizaQuadros();
		player.explode();
		const spriteW = player.imgPos[player.imgInd]
		ctx.drawImage(
			player.img, 
			spriteW, 1, 
			player.w, player.h,
			player.x, player.y,
			player.w, player.h);
	}
}

var enemy = {
	x: Math.random() * ctx.width,
	y: 0,
	w: 25,
	h: 16,
	img: new Image(),
	imgPos: [1, 26],
	imgInd: 0,
	atualizaQuadros() {
		const atraso = frames % intervalo === 0;
		if(atraso) {
			if(enemy.imgInd >= enemy.imgPos.length - 1) {
				enemy.imgInd = 0;
			} 
			enemy.imgInd++;
		};
	},
	explode() {
		if(enemy.y >= 510) {
			ctx.clearRect(enemy.x, enemy.y, enemy.w, enemy.h);
			enemy.x = Math.random() * ctx.width;
			enemy.y = 0;
		}
	},
	desenha() {
		enemy.atualizaQuadros();
		const spriteW = enemy.imgPos[enemy.imgInd]
		ctx.drawImage(
			enemy.img, 
			spriteW, 0, 
			enemy.w, enemy.h,
			enemy.x, enemy.y,
			enemy.w, enemy.h
		);
	},
	move() {
		if(enemy.y >= tamTelaH)
			enemy.y = tamTelaH;
		else
			enemy.y += 2; 
	}
};

var velT;
var tamTelaW,tamTelaH;
var jogo;
var contBombas,painelContBombas,velB,tmpCriaBomba;
var bombasTotal;
var vidaPlaneta,barraPlaneta;
var ie,isom;
var telaMsg;

function colisao(obj1, obj2) {
	var objeto1 = {x: obj1.x, y: obj1.y, largura: obj1.largura, altura: obj1.altura};
	var objeto2 = {x: obj2.x, y: obj2.y, largura: obj2.largura, altura: obj2.altura};

	if (objeto1.x < objeto2.x + objeto2.largura && 
		objeto1.x + objeto1.largura > objeto2.x && 
		objeto1.y < objeto2.y + objeto2.altura && 
		objeto1.y + objeto1.altura > objeto2.y) {
    	return true;
	};
	return false;
};

function isPlayerThere(where, playerPlace){
	return (where < playerPlace);
}

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
		atira(player.x+17,player.y);
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
}

function controlaBomba(){
	bombasTotal=document.getElementsByClassName("enemy");
	var tam=bombasTotal.length;
	for(var i=0;i<tam;i++){
		if(bombasTotal[i]){
			var pi=bombasTotal[i].offsetTop;
			pi+=velB;
			bombasTotal[i].style.top=pi+"px";
			if(pi>tamTelaH){
				vidaPlaneta-=10;
				criaExplosao(2,bombasTotal[i].offsetLeft,null);
				bombasTotal[i].remove();
			}
		}
	}
}
function atira(x,y){
	var t=document.createElement("div");
	var att1=document.createAttribute("class");
	var att2=document.createAttribute("style");
	att1.value="tiroJog";
	att2.value="top:"+y+"px;left:"+x+"px";
	t.setAttributeNode(att1);
	t.setAttributeNode(att2);
	document.body.appendChild(t);
}
function controleTiros(){
	var tiros=document.getElementsByClassName("tiroJog");
	var tam=tiros.length;
	for(var i=0;i<tam;i++){
		if(tiros[i]){
			var pt=tiros[i].offsetTop;
			pt-=velT;
			tiros[i].style.top=pt+"px";
			colisaoTiroBomba(tiros[i]);
			if(pt<0){
				//document.body.removeChild(tiros[i]);
				tiros[i].remove();
			}
		}
	}
}
function colisaoTiroBomba(tiro){
	var tam=bombasTotal.length;
	for(var i=0;i<tam;i++){
		if(bombasTotal[i]){
			if(
				(
					(tiro.offsetTop<=(bombasTotal[i].offsetTop+40))&& //Cima tiro com baixo enemy
					((tiro.offsetTop+6)>=(bombasTotal[i].offsetTop)) //Baixo tiro com cima enemy
				)
				&&
				(
					(tiro.offsetLeft<=(bombasTotal[i].offsetLeft+24))&& //Esquerda tiro com direita enemy
					((tiro.offsetLeft+6)>=(bombasTotal[i].offsetLeft)) //Direita Tito  com esquerda Bomba
				)
			){
				criaExplosao(1,bombasTotal[i].offsetLeft-25,bombasTotal[i].offsetTop);
				bombasTotal[i].remove();
				tiro.remove();
			}
		}
	}
}
function criaExplosao(tipo,x,y){ //Tipo 1=AR, 2=TERRA
	if(document.getElementById("explosao"+(ie-4))){
		document.getElementById("explosao"+(ie-4)).remove();
	}
	var explosao=document.createElement("div");
	var img=document.createElement("img");
	var som=document.createElement("audio");
	//Atributos para div
	var att1=document.createAttribute("class");
	var att2=document.createAttribute("style");
	var att3=document.createAttribute("id");
	//Atributo para imagem
	var att4=document.createAttribute("src");
	//Atributos para audio
	var att5=document.createAttribute("src");
	var att6=document.createAttribute("id");

	att3.value="explosao"+ie;
	if(tipo==1){
		att1.value="explosaoAr";
		att2.value="top:"+y+"px;left:"+x+"px;";
		att4.value="explosao_ar.gif?"+new Date();
	}else{
		att1.value="explosaoChao";
		att2.value="top:"+(tamTelaH-57)+"px;left:"+(x-17)+"px;";
		att4.value="explosao_chao.gif?"+new Date();
	}
	att5.value="exp1.mp3?"+new Date();
	att6.value="som"+isom;
	explosao.setAttributeNode(att1);
	explosao.setAttributeNode(att2);
	explosao.setAttributeNode(att3);
	img.setAttributeNode(att4);
	som.setAttributeNode(att5);
	som.setAttributeNode(att6);
	explosao.appendChild(img);
	explosao.appendChild(som);
	document.body.appendChild(explosao);
	document.getElementById("som"+isom).play();
	ie++;
	isom++;
}

function controlaJogador(){
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

function drawFrame(obj, posX){
	ctx.drawImage(obj.img, posX, 0, obj.w, obj.h, obj.x, obj.y, obj.w, obj.h);
}

function gameLoop(){
	if(player.live){
		//FUNÇÕES DE CONTROLE
		//ctx.clearRect(0, 0, cnv.width, cnv.height);
		player.desenha();
		controlaJogador()
		enemy.desenha();
		enemy.move();
		window.requestAnimationFrame(gameLoop, cnv);
	}
}


function reinicia(){
	bombasTotal=document.getElementsByClassName("enemy");
	var tam=bombasTotal.length;
	for(var i=0;i<tam;i++){
		if(bombasTotal[i]){
			bombasTotal[i].remove();
		}
	}
	var tam=bombasTotal.length;
	for(var i=0;i<tam;i++){
		if(bombasTotal[i]){
			bombasTotal[i].remove();
		}
	}	
	telaMsg.style.display="none";
	clearInterval(tmpCriaBomba);
	cancelAnimationFrame(frames);
	vidaPlaneta=300;
	player.x=tamTelaW/2;
	player.y=tamTelaH/2;
	jog.style.top=player.y+"px";
	jog.style.left=player.x+"px";
	contBombas=150;
	jogo=true;
	tmpCriaBomba=setInterval(criaBomba,1700);
	gameLoop();
}



function render(){
	ctx.clearRect(0, 0, cnv.width, cnv.height);
	drawFrame(player, player.imgPos[player.imgInd])
	player.imgInd++;
	if(player.imgInd >= player.imgPos.length){
		player.imgInd = 0;
	}
}

function inicia(){
	player.live=true;
	player.img.src = 'assets/player/p1.png';

	enemy.img.src = 'assets/enemy/e1.png';

	var enemys = []

	//Ini Tela
	tamTelaH=cnv.height;
	tamTelaW=cnv.width;

	//Ini Jogador
	dirxJ=diryJ=0;
	player.x=tamTelaW/2;
	player.y=tamTelaH/2;
	player.vel=velT=5;
	//desenhar jogador

	//Controles das bombas
	contBombas=150;
	velB=3;

	//Score
	score=0

	//Controles de explosão
	ie=ison=0;

	gameLoop();
	//Telas
	//document.getElementById("btnJogar").addEventListener("click",reinicia);

}


//window.addEventListener("load",inicia);
document.addEventListener("keydown",teclaDw);
document.addEventListener("keyup",teclaUp);