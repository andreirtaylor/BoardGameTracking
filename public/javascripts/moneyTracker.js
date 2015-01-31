var app = angular.module('App', []);
(function(){
        app.controller('MT', function ($scope , socket) {
                $scope.something = "This is from the Controller";
                socket.on('gameStart', function (data) {
                    $scope.game = data;
                    scopegame = $scope.game;
                    game = data;
                    $scope.playerList = data.playerList;
                });
                socket.on('testConnection', function(data){
                    $scope.game = data;
                    scopegame = $scope.game;
                    game = data;
                    console.log("Connection is good");
                    $scope.playerList = data.playerList;
                });
        });
})()
