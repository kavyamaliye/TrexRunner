//initiate Game STATEs
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

//place gameOver and restart icon on the screen
var gameOver, gameOverImage;
var restart, restartImage;

var score = 0;

var jumpSound , checkPointSound, dieSound;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png") ;
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png")
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);  
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  //For playing the game manually
  trex.setCollider("circle", 0,0,40);
  
  //For Applying AI to the trex
  //trex.setCollider("rectangle", 0, 0, 200, trex.height);
  //trex.debug = true;
  
  ground = createSprite(300,180,600,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -2;
  
  invisibleGround = createSprite(300,190,600,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  
  gameOver = createSprite(300,100);
  restart = createSprite(300,140);
  
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.5;
  restart.addImage(restartImage);
  restart.scale = 0.5;

 
}

function draw() {
  background(180);
  
  text("Score : " + score, 500,50);
  
  if(gameState === PLAY){
    
    ground.velocityX = -(4 + 3  * score / 100);
    
     gameOver.visible = false;
    restart.visible = false;
    
    score = score + Math.round(getFrameRate()/60);
    
    if(score > 0 && score % 100 === 0){
      checkPointSound.play();
    }
    
    if(keyDown("space") && trex.y >= 165) {
      trex.velocityY = -14;
      jumpSound.play();
    }

    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
     spawnClouds();
  
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
      //for playing the game manually
      gameState = END;
      dieSound.play();
      
      //For Applying AI to the trex
      //trex.velocityY = -14;
      //jumpSound.play();
    }
    
  }
  else if(gameState === END){
    
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    trex.velocityY = 0;
    
    trex.changeAnimation("collided", trex_collided);
    
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)){
      reset();
    }
  }
  
 
  
  trex.collide(invisibleGround);
  
 
  
  drawSprites();
}

function reset(){
  
  gameState = PLAY;
  trex.changeAnimation("running", trex_running);
  score = 0;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  
}


function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 120, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600, 165, 10, 40);
    obstacle.velocityX = -(6 + 3 * score / 100);
    
    //generate random obstacles
   var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      case 5: obstacle.addImage(obstacle5);
        break;
      case 6: obstacle.addImage(obstacle6);
        break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 100;
    
    obstaclesGroup.add(obstacle);
  }
}
