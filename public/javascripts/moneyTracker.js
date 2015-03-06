var addScreenLocation = 'addScreen';

var app = angular.module('App', []);
// this is the place to store the angular controllers.
(function(){
        // the way that this is written it will not be able to be iminified
        // update this later
        app.controller('MT', ['$scope', 'socket', function ($scope , socket) {
                // these socket functions are all possible because of the socket factory
                socket.emit('getGameTemplate', {templateName:'PowerGrid'});
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
            $scope.output="0";
            $scope.savedVal=""; 

            $scope.calc_func = function(button){
                if (!isNaN(parseInt(button))){
                    appendToOut(button);
                }
                else if (button == '-'){
                    subtract();
                }
                else if (button == '+'){
                    add();
                }
                else if (button == '='){
                    solve();
                }
                else if (button == 'C'){
                    $scope.clear();
                }
            }

            var appendToOut = function(num){
                if($scope.output === "0" || $scope.subtracttoken || $scope.addtoken){
                    $scope.output=num;
                    $scope.addtoken=false;
                    $scope.subtracttoken=false;
                }else{
                    $scope.output += String(num);
                }
            };

            $scope.clear = function(){
                $scope.output = "0";
                $scope.savedVal = "";
                $scope.addtoken = false;
                $scope.subtracttoken = false;
            };

            var add = function(){
                $scope.addtoken = true;
                $scope.savedVal += $scope.output;
                $scope.savedVal += "+"
                console.log($scope.savedVal)
            };

            var subtract = function(){
                if ($scope.output === "0"){
                    $scope.output = "-";
                    console.log($scope.savedVal)
                }
                else{
                    $scope.subtracttoken = true;
                    $scope.savedVal += $scope.output;
                    $scope.savedVal += "-"
                    console.log($scope.savedVal)
                }
            };

            var solve = function(){
                $scope.savedVal += $scope.output;
                $scope.output = $scope.savedVal;
                $scope.subtracttoken = false;
                $scope.subtracttoken = false;
            };


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
