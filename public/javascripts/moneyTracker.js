var addScreenLocation = 'addScreen';

var app = angular.module('App', []);
// this is the place to store the angular controllers.
(function(){
        // the way that this is written it will not be able to be iminified
        // update this later
        app.controller('MT', ['$scope', 'socket', function ($scope , socket) {
                // these socket functions are all possible because of the socket factory
                socket.emit('getSampleGame', { gameName: "samplegame"});
                socket.on('SampleUpdate', function(data){
                    $scope.game = data;
                    scopegame = $scope.game;
                    $scope.playerList = data.playerList;
                });
               
                $scope.player = $scope.player?$scope.player:{};

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
                

                $scope.clicked = false;
                $scope.click = function(player){
                    $scope.player = player;
                    if($scope.clicked == true){
                        $scope.clicked = false;
                    }else{
                        $scope.clicked = true;
                    }
                };
        }]);

        app.controller('Calculator', ['$scope', function($scope){
            //calculator functions
            $scope.output=0;
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

            $scope.subtract = function(){
                $scope.subtracttoken = true;
                $scope.calctoken = true;
                $scope.savedVal = $scope.output;
    
            };

            $scope.solve = function(){
                if ($scope.addtoken == true){
                    $scope.savedVal = parseInt($scope.savedVal) + parseInt($scope.output);
                    $scope.output = $scope.savedVal;
                }
                if ($scope.subtracttoken == true){
                    $scope.savedVal = parseInt($scope.savedVal) - parseInt($scope.output);
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
                $scope.update = function(){
                    $scope.player.money += parseInt($scope.output);
                    $scope.clear();
                    $scope.click();
                    socket.emit('updateSampleGame', $scope.game);
                    console.log($scope.game);

                };
        }]);
})()
