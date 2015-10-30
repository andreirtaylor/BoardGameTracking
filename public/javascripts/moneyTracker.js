var app = angular.module("App", ["xeditable"]);

app.run(function(editableOptions) {
    editableOptions.theme = 'bs3';
    FastClick.attach(document.body);
});

// this is the place to store the angular controllers.
(function(){
        // the way that this is written it will not be able to be iminified
        // update this later
        app.controller('MT', ['$scope', 'socket', function ($scope , socket) {
            // these socket functions are all possible because of the socket factory
            socket.emit('connectme', { url: window.location.toString()});

            socket.on('incomingGame', function(data){
                $scope.game = data;
                scopegame = $scope.game;
                $scope.gamePlayers = data.gamePlayers;
                $scope.templateName = data.templateName;
                $scope.gameType = data.gameType;
            });

            $scope.player = $scope.player ? $scope.player : {};

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
                if($scope.output === "0" || $scope.subtracttoken || $scope.addtoken || $scope.eqtoken){
                    $scope.output=num;
                    $scope.addtoken=false;
                    $scope.subtracttoken=false;
                    $scope.eqtoken = false;
                }else if($scope.output.length<10){
                    if(!(num == 0 && $scope.output == "-")){
                        $scope.output += String(num);
                    }
                }
            };

            //clears all statuses including saved value, might want to a clear button that doesn't reset saved value
            $scope.clear = function(){
                $scope.output = "0";
                $scope.savedVal = "";
                $scope.addtoken = false;
                $scope.subtracttoken = false;
                $scope.eqtoken = false;
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
                else if ($scope.addtoken==false && $scope.subtracttoken == false && $scope.output != "-" && $scope.output != "0"){
                    $scope.addtoken = true;
                    $scope.savedVal += $scope.output;
                    $scope.savedVal += "+"
                }
                else if ($scope.addtoken == false){
                    $scope.output = "0";
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
                if(eval($scope.output) <= 9999999999) $scope.output = eval($scope.output);
                else $scope.output = 'error';
                $scope.savedVal = "";
                $scope.subtracttoken = false;
                $scope.subtracttoken = false;
                $scope.eqtoken = true;
            };

            $scope.eqtoken = false;
            $scope.addtoken = false;
            $scope.subtracttoken = false;
            //end of calculator functions

        }]);

        app.controller('newgame', ['$scope', 'socket', function ($scope , socket) {
            $scope.playerList = [];
            $scope.template = {
                templateName:'Monopoly',
                ready:false
            };
            $scope.newPlayerName = '';
            $scope.addPlayer = function(){
                if($scope.newPlayerName){
                    for(i=0;i<$scope.playerList.length;i++){
                        if($scope.playerList[i].name == $scope.newPlayerName){
                            return;
                        }
                    }
                    var player = {
                        "name": $scope.newPlayerName
                    }
                    $scope.playerList.push(player);
                    $scope.newPlayerName = '';
                }
            };
            $scope.removePlayer = function(name){
                for(i=0;i<$scope.playerList.length;i++){
                    if($scope.playerList[i].name == name){
                      $scope.playerList.splice(i,1);
                    }
                }

            };

            $scope.$watch('template.templateName', function(newVal){
                $scope.template.ready = false;
                if(newVal){
                    socket.emit('testTemplate', $scope.template);
                }
            });

            socket.on('validTemplate', function(template){
		// if something comes back then the template is ok
                if(template){
                    $scope.template.ready = true;
                }
            })

            socket.on('invalidGameTemplate', function(){
                alert('invalid Game Template');
            });

            $scope.startGame = function(){
                for(var i = 0; i < $scope.playerList.length; i++){
                    delete $scope.playerList[i].$$hashKey;
                }
                socket.emit('startGame', {
                    gamePlayers: $scope.playerList,
                    templateName: $scope.template.templateName
                });
            }

            socket.on('startGame', function(game){
                window.location= game.room;
            });
            socket.on("userLoggedIn", function(player){
                 $scope.playerList.push(player);
            });

            socket.emit('newGameLoggedIn');
        }]);

        app.controller('Emit', ['$scope', 'socket', function ($scope , socket) {
                $scope.update = function(){
                    if($scope.output=="-") scope.output=0;
                    $scope.player.cash += parseInt($scope.output);
                    $scope.clear();
                    $scope.click();
                    // angular is adding this hashkey into the array
                    // we have to remove it before it goes into the datbase
                    for(var i = 0; i < $scope.game.gamePlayers.length; i++){
                        delete $scope.game.gamePlayers[i].$$hashKey;
                    }
                    socket.emit('updateGame', $scope.game);
                    console.log($scope.game);
                };
        }]);

        app.controller('profile', ['$scope', 'socket', function ($scope , socket) {
            $scope.inProgress = [];
            $scope.username = '';
            $scope.pageNum = 1;
            $scope.inc_page = function(num){
                socket.emit("initProfile", {
                    username:'andrei',
                    nPerPage: 5,
                    pageNumber: $scope.pageNum + num
                });
            }

            $scope.goTo = function(room){
                window.location = room;
            };

            socket.emit('initProfile', {
                username:'andrei',
                nPerPage: 5,
                pageNumber: $scope.pageNum
            });


            socket.on('initProfile', function(profile){
                $scope.username = profile.username;
                $scope.inProgress = profile.inProgress;
                $scope.pageNum = profile.pageNum;
            });
        }]);
})()
