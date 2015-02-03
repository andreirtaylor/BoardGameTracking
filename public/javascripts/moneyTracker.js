
var app = angular.module('App', []);
// this is the place to store the angular controllers.
(function(){
        // the way that this is written it will not be able to be iminified
        // update this later
        app.controller('MT', ['$scope', 'socket', function ($scope , socket) {
                // these socket functions are all possible because of the socket factory
                socket.on('gameStart', function (data) {
                    $scope.game = data;
                    scopegame = $scope.game;
                    $scope.playerList = data.playerList;
                });

                socket.on('testConnection', function(data){
                    $scope.game = data;
                    scopegame = $scope.game;
                    game = data;
                    console.log("Connection is good");
                    $scope.playerList = data.playerList;
                });
                
                $scope.addToPlayer = function(id, ammount){
                    var ammount = 10;
                    var playerList = $scope.game.playerList;
                    for(var i = 0; i < playerList.length; i++){
                        if (playerList[i].id == id){
                            playerList[i].money += ammount
                            break;
                        }
                    }
                    
                }

                $scope.output="0";
                $scope.appendToOut = function(num){
              
                };
        }]);
        
        app.controller('Emit', ['$scope', 'socket', function ($scope , socket) {
                $scope.testConnection = function(){
                    socket.emit('startTest');
                }
        }]);
})()
