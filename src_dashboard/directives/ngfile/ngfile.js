mainApp.directive('ngFile', function() {
  return {
      restrict: 'E',
      scope: {
          name: '@',
          label: '@',
          value: '=',
          type: '@',
          valueReturn: '=',
          link: '=',
          isChange: '&'
      },
      controller:['$scope', 'mainSvc', 'modalSvc', '$rootScope', 'CONSTANTS', 'BASE_URL', '$translate',
      function ($scope, mainSvc, modalSvc, $rootScope, CONSTANTS, BASE_URL, $translate) {
        $scope.maxFileUpload = CONSTANTS.maxFileUpload;
        $scope.path = BASE_URL.api + '/v1/common/viewFile?file=';
        $scope.size = CONSTANTS.files[$scope.type];

        $scope.viewLarge = function() {
          var file = $scope.path+$scope.link+'&size=large&type='+$scope.type;
          modalSvc.showModalWithFile(file);
        };

        $scope.removeFile = function() {
          modalSvc.showModal({
            size: 'sm'
          },{
            closeButtonText: $translate.instant('BTN_NO'),
            actionButtonText: $translate.instant('BTN_YES'),
            bodyText: $translate.instant('MSG_REMOVE_IMAGE')
          }).then(function (result) {
            if ($scope.valueReturn) {
              $scope.valueReturn = undefined;
              return false;
            }
            $scope.link = undefined;
            $scope.value = undefined;
            $scope.valuePath = undefined;
            $scope.isChange();
          });
        };
      }],
      compile: function() {
        return {
          pre: function(scope, element, attrs) {
            if (attrs.isChange==undefined) scope.isChange = undefined;
          }
        };
      },
      templateUrl: 'templates/directives/ngfile/ngfile.html'
  };
});
