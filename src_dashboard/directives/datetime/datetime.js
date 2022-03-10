mainApp.directive('dateTime', function() {

        return {
            restrict: 'E',
            scope: {
                msgInvalid: '@',
                name: '@',
                value: '=',
                change: '&',
                invalidForm: '@',
                hideTime: '=',
                maxDate: '=',
                placeHolder: '@'
            },
            controller: ['$scope', function ($scope) {
                var objDate = undefined;
                var objTime = undefined;
                $scope.valueDate = '';
                $scope.valueTime = '';
                $scope.isFirstClick = false;

                $scope.$watch('value', function() {
                  if ($scope.value && (!$scope.valueDate || !$scope.isFirstClick) && ((!$scope.hideTime && (!$scope.valueTime || !$scope.isFirstClick)) || $scope.hideTime)) {
                    var valDateTime = (!$scope.hideTime)?UnixTimeStampToDateTime($scope.value, true):UnixTimeStampToDate($scope.value, true);
                    $scope.valueDate =  dateFormat(valDateTime,"dd/mm/yyyy");
                    if (!$scope.hideTime) $scope.valueTime =  dateFormat(valDateTime,"HH:MM");
                  };
                });

                $scope.readyObj = function(t) {
                    objDate = $('#'+$scope.name+'_date').pickadate(Object.assign({}, _datePickerDefault, ($scope.maxDate)?{max: $scope.maxDate}:{min: new Date()}));
                    if (!$scope.hideTime) objTime = $('#'+$scope.name+'_time').pickatime(_timePickerDefault);
                };

                $scope.changeObj = function() {
                  $scope.isFirstClick = true;
                  if ($scope.valueDate && ((!$scope.hideTime && $scope.valueTime) || $scope.hideTime)) {
                    $scope.value = (!$scope.hideTime)?DateTimeToUnixTimestamp($scope.valueDate+' '+$scope.valueTime):DateToUnixTimestamp($scope.valueDate);
                    $scope.change();
                  }
                  else if($scope.valueDate && !$scope.valueTime && !$scope.hideTime) {
                    objTime.trigger( "click" );
                  }
                }

                $scope.openDate = function() {
                  objDate.trigger( "click" );
                }
                $scope.openTime = function() {
                  objTime.trigger( "click" );
                }

                $scope.removeDate = function() {
                  $scope.value = 0;
                  $scope.valueDate = '';
                  $scope.valueTime = '';
                }
            }],
            compile: function() {
              return {
                pre: function(scope, element, attrs) {
                  if (scope.value && scope.value!='' && scope.value!=0) {
                    var valDateTime = (!scope.hideTime)?UnixTimeStampToDateTime(scope.value, true):UnixTimeStampToDate(scope.value, true);
                    scope.valueDate =  dateFormat(valDateTime,"dd/mm/yyyy");
                    if (!scope.hideTime) scope.valueTime =  dateFormat(valDateTime,"HH:MM");
                  }
                  if (attrs.change==undefined) scope.change = undefined;
                  if (attrs.placeHolder==undefined) scope.placeHolder = 'Select date';
                }
              };
            },
            templateUrl: 'templates/directives/datetime/datetime.html'
        };
    });
