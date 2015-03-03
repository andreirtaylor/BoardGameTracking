//functions for generating random games for testing purposes
//require chance
var Chance = require('chance');
var chance = new Chance();



//this stitches the game pieces together
//function(string,array,int)
var gameCreate = function(gameName,players,numOfPlayers){
    var game ={
        name:gameName,
        gamePlayers:players,
        numPlayers:numOfPlayers
     };
    return game;
};


//random number of players in the game, between 2 and 6
var getRandomSmall = function(){return chance.natural({min:2,max:6});};

//random amount of money, between 100 and 1000
var getRandomBig = function(){return chance.natural({min:100,max:1000});};

//random name generator
var getRandomName = function(){return chance.name();};

//creates a game name of 5 characters at random
var getGameName = function(){return chance.string({length:5});};



//creates and prints x games
var genXGames = function(numGames){
    
    //for each game
    for(var x = 0; x<numGames; x++){
            var people = [];
            var numPlayers = getRandomSmall(); //how many players?
            var whichBanker = chance.natural({min:0,max:(numPlayers-1)}); //selects a banker at random
            
            //for each player in the game
            for( var y = 0; y<numPlayers; y++){
                //append the player to people
                people.push({ 
                    name:getRandomName(),
                    cash:getRandomBig(),
                    banker:false
                });
                //if banker set banker to true
                if(y == whichBanker){people[y].banker=true;};
            }
            //stitch the game together
            var newgame = gameCreate(getGameName(),people,numPlayers);

            //print the game
            console.log(newgame);
    }
};


//creates 5 games
genXGames(5);

