var addScreenLocation = 'addScreen';

var app = angular.module('App', []);
// this is the place to store the angular controllers.
(function(){
        // the way that this is written it will not be able to be iminified
        // update this later
        app.controller('MT', ['$scope', 'socket', function ($scope , socket) {
                // these socket functions are all possible because of the socket factory
                socket.emit('connectme', { url: window.location.toString()});
                socket.on('incomingGame', function(data){
                    console.log(data)
                    $scope.game = data;
                    scopegame = $scope.game;
                    $scope.playerList = data.gamePlayers;
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

            //appends number to calculator screen if there was already a number there
            //if - or + was pressed, flag is set, and new string starts
            var appendToOut = function(num){
                if($scope.output === "0" || $scope.subtracttoken || $scope.addtoken){
                    $scope.output=num;
                    $scope.addtoken=false;
                    $scope.subtracttoken=false;
                }else{
                    $scope.output += String(num);
                }
            };

            //clears all statuses including saved value, might want to a clear button that doesn't reset saved value
            $scope.clear = function(){
                $scope.output = "0";
                $scope.savedVal = "";
                $scope.addtoken = false;
                $scope.subtracttoken = false;
            };

            //if subtract or add was not clicked last, set add flag, add number to saved val followed by +
            //if add was clicked last, do nothing
            //if subtract was clicked last, pop off the - and push a + to savedval
            var add = function(){
                if ($scope.subtracttoken == true){
                   $scope.subtracttoken = false;
                   $scope.savedVal = $scope.savedVal.substring(0, $scope.savedVal.length - 1);
                   $scope.savedVal += "+"
                   $scope.addtoken = true;
                }
                else if ($scope.addtoken==false && $scope.subtracttoken == false && $scope.output != "-"){
                    $scope.addtoken = true;
                    $scope.savedVal += $scope.output;
                    $scope.savedVal += "+"
                }
            };

            //if subtract of add was not clicked last, check output to see if it is 0, if it is, replace with -
                //if output is not 0, set subtract flag, push number to savedval, push -
            //if subtract was clicked last, do nothing
            //if add was clicked last, pop off the + and push a + to savedval
            var subtract = function(){
                if ($scope.addtoken == true){
                   $scope.addtoken = false;
                   $scope.savedVal = $scope.savedVal.substring(0, $scope.savedVal.length - 1);
                   $scope.savedVal += "-"
                   $scope.subtracttoken = true;
                }
                else if ($scope.subtracttoken==false && $scope.addtoken == false){
                    if ($scope.output === "0"){
                        if($scope.savedVal === ""){
                            $scope.output = "-";
                        }
                    }
                    else{
                        if ($scope.output!="-"){
                            $scope.subtracttoken = true;
                            $scope.savedVal += $scope.output;
                            $scope.savedVal += "-"
                        }
                    }
                }
            };

            //output is set to savedval and savedval is reset, but can still be used as it is in the output screen
            var solve = function(){
                $scope.savedVal += $scope.output;
                $scope.output = $scope.savedVal;
                $scope.output = eval($scope.output);
                $scope.savedVal = ""
                $scope.subtracttoken = false;
                $scope.subtracttoken = false;
            };


                $scope.addtoken = false;
                $scope.subtracttoken = false;
            //end of calculator functions

        }]);

        app.controller('newgame', ['$scope', 'socket', function ($scope , socket) {
            console.log('working')
            $scope.playerList = [];
            $scope.template = 'PowerGrid'
            $scope.newPlayerName = '';
            $scope.addPlayer = function(name){
                if($scope.newPlayerName){
                    var player = {
                        "name": $scope.newPlayerName
                    }
                    $scope.playerList.push(player);
                    $scope.newPlayerName = '';
                }
            };

            $scope.startGame = function(){
                console.log($scope.playerList, $scope.template);
                for(var i = 0; i < $scope.playerList.length; i++){
                    delete $scope.playerList[i].$$hashKey;
                }
                console.log($scope.playerList)
                socket.emit('startGame', {
                    gamePlayers: $scope.playerList,
                    templateName: $scope.template
                });
            }

            socket.on('startGame', function(game){
                window.location= "/gamescreen/?room=" + game.room;
            });
        }]);

        app.controller('Emit', ['$scope', 'socket', function ($scope , socket) {
                $scope.testConnection = function(){
                    socket.emit('startTest');
                }


                $scope.updateGameData = function(){
                    socket.emit('updateGame', {
                        game:socket.game,
                        id:socket.playerID
                    });
                }

                $scope.update = function(){
                    $scope.player.cash += parseInt($scope.output);
                    $scope.clear();
                    $scope.click();
                    for(var i = 0; i < $scope.game.gamePlayers.length; i++){
                        delete $scope.game.gamePlayers[i].$$hashKey;
                    }
                    socket.emit('updateGame', $scope.game);
                    console.log($scope.game);
                };
        }]);
})()
