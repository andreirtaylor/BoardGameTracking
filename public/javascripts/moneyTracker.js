(function(){
        var MT = angular.module('App', []);

        MT.controller('MT', function ($scope) {
              $scope.something = socket.game ;
              $scope.phones = [
                {'name': 'Nexus S',
                         'snippet': 'Fast just got faster with Nexus S.'},
                {'name': 'Motorola XOOM™ with Wi-Fi',
                         'snippet': 'The Next, Next Generation tablet.'},
                {'name': 'MOTOROLA XOOM™',
                         'snippet': 'The Next, Next Generation tablet.'}
          ];
        });
})()
