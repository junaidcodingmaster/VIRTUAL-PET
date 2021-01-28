var doghappyDog,database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;

function preload(){
doggi=loadImage("images/Dog.png");
happyDog=loadImage("images/happy dog.png");

}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  dog=createSprite(800,200,150,150);
  dog.addImage(doggi);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(900,25);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,25);
  addFood.mousePressed(addFoods);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
}

function draw() {
  
  background(46,139,87);
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(doggi);
   }
   
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}