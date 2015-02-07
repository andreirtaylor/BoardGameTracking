var addScreenLocation = 'addScreen';

var app = angular.module('App', []);
// this is the place to store the angular controllers.
(function(){
        // the way that this is written it will not be able to be iminified
        // update this later
        app.controller('MT', ['$scope', 'socket', function ($scope , socket) {
                // these socket functions are all possible because of the socket factory
                socket.emit('getSampleGame', { gameName: "sampleGame"});
                socket.on('SampleUpdate', function(data){
                    $scope.game = data;
                    scopegame = $scope.game;
                    $scope.playerList = data.playerList;
                });
                
                socket.on('gameStart', function (data) {
                    $scope.game = data;
                    scopegame = $scope.game;
                    $scope.playerList = data.playerList;
                });

                socket.on('testConnection', function(data){
                    $scope.game = data;
                    socket.game = $scope.game;
                    $scope.playerList = data.playerList;
                    scopegame = $scope.game;
                    game = data;
                    console.log("Connection is good");
                });
               
                // the function that runs when you click on a 
                // players name
                $scope.setupAddScreen = function(id){
                    location.replace("/addScreen/" + id );
                }

                $scope.goToMenu = function(){
                    location.replace("/");
                }

                $scope.findPlayer = function(id){ 
                    var player = {};
                    for(var i = 0; i < playerList.length; i++){
                        if (playerList[i].id == id){
                            break;
                        }
                    }
                    return player;
                }

                $scope.addToPlayer = function(id, ammount){
                    var ammount = 10;
                    var playerList = $scope.game.playerList;
                     
                    
                }
        }]);

        app.controller('Calculator', ['$scope', function($scope){
            //calculator functions
            $scope.output="0";
            $scope.savedVal= 0;
            $scope.appendToOut = function(num){
                if($scope.output == "0" || $scope.calctoken){
                    $scope.output=num;
                    $scope.calctoken=false;
                }else{
                    $scope.output += String(num);
                }
            };
            $scope.clear = function(){
                $scope.output = "0";
                $scope.addtoken = false;
                $scope.subtracttoken = false;
                $scope.calctoken = false;
            };

            $scope.add = function(){
                $scope.addtoken = true;
                $scope.calctoken = true;
                $scope.savedVal = $scope.output;
            };

            $scope.solve = function(){
                if ($scope.addtoken == true){
                    $scope.savedVal = parseInt($scope.savedVal) + parseInt($scope.output);
                    $scope.output = $scope.savedVal;
                }
                $scope.calctoken = true;
                $scope.addtoken = false;
                $scope.subtracttoken = false;
            };
                $scope.calctoken = false;
                $scope.addtoken = false;
                $scope.subtracttoken = false;
            //end of calculator functions
        
        }]);

        app.controller('Emit', ['$scope', 'socket', function ($scope , socket) {
                $scope.testConnection = function(){
                    socket.emit('startTest');
                }
                $scope.updateGameData = function(){
                    socket.emit('updateGameData', {
                        game:socket.game,
                        id:socket.playerID
                    });
                }
        }]);
})()
