mainApp.directive('daysMenu', function() {

    return {
        restrict: 'E',
        scope: {
            days: '@'
        },
        controller: ['$scope',
          function ($scope) {
              let arrDays = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
              $scope.retDays = '';
              for(i = 0; i < $scope.days.length; i++) {
                  if ($scope.days.substring(i,i+1)=='1') {
                    if ($scope.retDays!='') $scope.retDays += ', ';
                    $scope.retDays += arrDays[i];
                  }
              }

        }],
        template: '<span>{{retDays}} de </span>'
    };
});
