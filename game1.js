 //globais
var jogador= new Raquete(150,580,100,10);//contrutor da raquete
var contexto;//canvas
window.onload=iniciar;//quando carregar a pagina inicia
window.onkeydown=teclaPressionada;//quando a tecla e presionada
window.onkeyup=teclaSolta;//quando tecla e solta
var bola= new Bola(200,570,10);//contrutor da bola
var temporizador;//loop
var mapaTecla= new Array();//vetor para as teclas
var estado=0;//estado do jogo
var tijolos = new Array();
tijolos.push(new Tijolo(10,10,50,10));
tijolos.push(new Tijolo(62,10,50,10));
 tijolos.push(new Tijolo(114,10,50,10));
tijolos.push(new Tijolo(166,10,50,10));
tijolos.push(new Tijolo(30,22,50,10));
tijolos.push(new Tijolo(82,22,50,10));
tijolos.push(new Tijolo(134,22,50,10));
tijolos.push(new Tijolo(186,22,50,10));
var pontos=0;
var hiscore;
dado=parseInt(localStorage.getItem("hiscore"));
hiscore=(isNaN(dado))?0:dado;
var sons=new Array();
sons[0]=new Audio('Blop-Mark.mp3');
sons[1]=new Audio('Mirror Breaking.mp3');
//iniciar
function iniciar()//funçao que inicia e carrega o jogo
{
	var canvas=document.getElementById('game');
	contexto=canvas.getContext("2d");
	jogador.pintar();
	
	temporizador=setInterval(mainloop,33);

}

//player
function Raquete(x,y,largura,altura)//retangulo que e o jogador
{
	this.x=x;
	this.y=y;
	this.largura=largura;
	this.altura=altura;
	this.pintar=function()//mostra o retangulo na tela
	{
		  contexto.fillRect(this.x, this.y, this.largura, this.altura);
	}
	this.mover=function(dx)//funçao para o movimento
	{
		this.x+=dx;
	}

}
function teclaPressionada(evento)//FAZ O PERSONAGEM MOVER
{
	mapaTecla[evento.keyCode]=true;//quano clica o mapateclado dakela tecla e true
}
//pintar
function pintar()//rePINTA ELE NA TELA PARA MOSTAR O MOVIMENTO
{
	contexto.clearRect(0,0,400,600);
	jogador.pintar();
	bola.pintar();

	for(t in tijolos)//um lop para ir pintando todos os tijolos do vetor tijolos
	{
		tijolos[t].pintar();
	}

	contexto.font="18pt monospace";
	switch(estado)
	{
		case 0:
			contexto.fillText("Aperte ESPACO para iniciar",12,295);
			break;
		case 1:
			contexto.fillText(pontos,350,595);
			break;
		case 2:
			contexto.fillText("Fim de Jogo",125,295);
			break;
		case 3:
			contexto.fillText("Voce venceu",125,295);
			break;		


	}
   contexto.fillText("Hi_score",5,575);
   contexto.fillText(hiscore,5,595);


}
function teclaSolta(evento)//quando desclica
{
	mapaTecla[evento.keyCode]=false;
}

//BOLINHA
function Bola(x,y,raio)//bolinha do jogo
{
	this.x=x;
	this.y=y;
	this.raio=raio;
	this.dirX=(Math.random()>0.5)?3:-3;//numero ramdomico de 0 a 1 ,menor que0.5 ela cai para esquerda,maior que 0.5 ela vai para direita
	this.dirY=-3;
	this.pintar=function()//pinta a bolinha
	{
		contexto.beginPath();
		contexto.arc(this.x,this.y,this.raio,0,2*Math.PI);
		contexto.fill();
	}
	this.mover=function()//faz o movimento randomico com as propriedades dirx e diry
	{
		this.x+=this.dirX;
		this.y+=this.dirY;
	}
	this.inverteX=function()//multiplicando por -1 negativa a posicao da direçao da bola e faz ela andar ao contrrario do que estava na posiçao x
	{
		this.dirX*=-1;
	}
	this.inverteY=function()//mesma coisa com o y
	{
		this.dirY*=-1;
	}
	this.verificaColisao=function()
	{
		if((this.x-this.raio)<=0 || (this.x+this.raio)>=400)//se ele tiver no canto esquerdo ou dsireito da faze ele invertex
		{
			this.inverteX();
			sons[0].play();
		}
		if((this.y-this.raio)<=0 || detectarColisaoRaquetexBola())//se eletiver na parte supoerior ou no retangulo ele inverte y
		{
			this.inverteY();
			sons[0].play();
		}
		if((this.y-this.raio)>=600)//se ele passar da parte inferior ele perde o jogo
		{
			estado=2;//0 jogo pausado 1 jogo em andamento 2 fim de jogo
		  	setarhiscore();
		}
	}


}

//colisaoraquete
function clamp(val,min,max)///qual e mais proximo de vall ..miin e max
{
	return Math.max(min,Math.min(max,val));
}
function detectarColisaoRaquetexBola()//se a distancia da bola colidir com o retangulo a funçao retorna positivo
{
	var xMaisProximo=clamp(bola.x,jogador.x,(jogador.x+jogador.largura));
	var yMaisProximo=clamp(bola.y,jogador.y,(jogador.y+jogador.altura));

	var distanciaX=bola.x-xMaisProximo;
	var distanciaY=bola.y-yMaisProximo;
	var distancia=(distanciaX*distanciaX)+(distanciaY*distanciaY);
	return distancia <(bola.raio*bola.raio);


}

//tijolos
function Tijolo(x,y,largura,altura)
{
	this.x=x;
	this.y=y;
	this.largura=largura;
	this.altura=altura;

	this.pintar=function()//pinta o tijolo de preto com bordas cinza
	{
		contexto.fillRect(this.x,this.y,this.largura,this.altura);
		contexto.fillStyle="#555555";
		contexto.strokeRect(this.x,this.y,this.largura,this.altura);
		contexto.fillStyle="#000000";
	}

	this.detectarColisaoTijoloBola=function()
	{
		var xMaisProximo=clamp(bola.x,this.x,(this.x+this.largura));
		var yMaisProximo=clamp(bola.y,this.y,(this.y+this.altura));

		var distanciaX=bola.x-xMaisProximo;
		var distanciaY=bola.y-yMaisProximo;
		var distancia=(distanciaX*distanciaX)+(distanciaY*distanciaY);//mesmo algoritmo do detectar colisao com raquete

		if(distancia<(bola.raio*bola.raio))
		{
			if(bola.x>this.x && bola.x<(this.x+this.largura))//se colidir com o lado de baixo e de cima
			{
				bola.inverteY();
			}
			else if(bola.y>this.y && bola.y<(this.y+this.altura))//se colidir com o lado esquerdo ou direito
			{
				bola.inverteX();
			}
			else
			{
				bola.inverteY();
				bola.inverteX();
			}
			pontos+=1;
			sons[1].play();
			return true
			

		}
		return false;//se nao colidir simplismente retorna falso
	}
}
//hiscore
function setarhiscore()
{
	if(pontos>hiscore)
	{
		hiscore=pontos;
		localStorage.setItem("hiscore",pontos);
	}
}


//principal
function mainloop()//umas das funçoes mais importantes pois aki sera colocado oq da vida em nosso senario
{
	if(mapaTecla[37]==true && estado==1)//se precionar a seta esquerda
	{
		jogador.mover(-2);
	}
	if(mapaTecla[39]==true && estado==1)//se precionar a seta direita
	{
		jogador.mover(2);
	}
	if(mapaTecla[32]==true && estado==0)//se precionar espaço o estado vai a 1 e o jogo começa
	{
		estado=1;
	}
	if(estado==1)
	{
		bola.mover();
	}
	bola.verificaColisao();//verifica colisao
	for(t in tijolos)//loop
	{
		if(tijolos[t].detectarColisaoTijoloBola())//se ouver colisao ele e apagado
		{
			tijolos.splice(t,1);//parametro 1 do indice e dois da quantidade
			if(tijolos.length==0)//quando nao tiver mais nenhum tijolo entra no estado 3
			{
				estado=3;//estado de vitoria
				setarhiscore();
			}
		}
	}
	pintar();
}


