// setup canvas
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;
// function to generate random number

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

var p = document.querySelector("p");
var cont = 0;

function Formato(x, y, velX, velY, exists){
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}

function Bola(x ,y , velX, velY, exists, color, size){
    Formato.call(this,x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
}

Bola.prototype.desenhar = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2* Math.PI);
    ctx.fill();
}

Bola.prototype.atualizar = function(){
    if((this.x + this.size) >= width){
        this.velX =  -(this.velX);
    }
    if((this.x - this.size) <= 0){
       this.velX =  -(this.velX); 
    }
    if((this.y + this.size) >= height){
        this.velY =  -(this.velY);
    }
    if((this.y - this.size) <= 0){
       this.velY = -(this.velY); 
    }

    this.x += this.velX;
    this.y += this.velY;
}

Bola.prototype.colisao = function() {
    for(var j = 0; j < balls.length; j++){
        if(!(this === balls[j])) {
            var dx = this.x - balls[j].x;
            var dy = this.y - balls[j].y;
            var distance = Math.sqrt(dx * dx + dy * dy);
        }
        if (distance < this.size + balls[j].size){
            balls[j].color = this.color = `rgb(${random(0,255)},${random(0,255)},${random(0,255)})`;
        }
    }
}

function EvilCircle(x,y,exists){
    Formato.call(this,x,y,20,20,exists);
    this.color = "white";
    this.size = 10;
}

EvilCircle.prototype.desenhar = function(){
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2* Math.PI);
    ctx.stroke();
}

EvilCircle.prototype.verificarLimites = function(){
    if((this.x + this.size) >= width){
        this.x -= this.size;
    }
    if((this.x - this.size) <= 0){
       this.x += this.size;
    }
    if((this.y + this.size) >= height){
        this.y -= this.size;
    }
    if((this.y - this.size) <= 0){
       this.y += this.size;
    }
}

EvilCircle.prototype.setControls = function(){
    var _this = this;
    window.onkeydown = function(e){
        if(e.keyCode === 65){
            _this.x -= _this.velX;
        } else if(e.keyCode === 68){
            _this.x += _this.velX;
        } else if (e.keyCode === 87){
            _this.y -= _this.velY;
        } else if(e.keyCode === 83){
            _this.y += _this.velY;
        }
    }

}

EvilCircle.prototype.colisao = function(){
    
    for(var j = 0; j < balls.length; j++){
        if(balls[j].exists) {
            var dx = this.x - balls[j].x;
            var dy = this.y - balls[j].y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size){
                balls[j].exists = false;
                cont--;
                p.textContent = "Contagem de bolas: " + cont;
            }
        }
    }
}

var balls = [];

var circuloDoMal = new EvilCircle(random(0+10,width - 10),random(0+10,height-10),true);
circuloDoMal.setControls();

while(balls.length < 50) {
    var size = random(10,20);
    var ball = new  Bola(
        random(0 + size, width - size),
        random(0+ size,height - size),
        random(-7,7),
        random(-7,7),
        true,
        `rgb(${random(0,255)},${random(0,255)},${random(0,255)})`,
        size
    );
    balls.push(ball);
    cont++; 
    p.textContent = "Contagem de bola: "+ cont; 
}

function loop(){
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, width, height);

    for(let i = 0 ; i<balls.length;i++){
        if(balls[i].exists){
            balls[i].desenhar();
            balls[i].atualizar();
            balls[i].colisao();
        }
        circuloDoMal.desenhar();
        circuloDoMal.verificarLimites();
        circuloDoMal.colisao();      
    }
    requestAnimationFrame(loop);
}
loop();