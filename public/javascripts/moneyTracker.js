(function(){
        var MT = angular.module('App', []);
        MT.controller('MT', function ($scope, $window) {
                $scope.something = "This is from the Controller";
        });
})()
