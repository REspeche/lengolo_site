mainApp.directive('flagsLanguage', function() {

        return {
            restrict: 'E',
            controller: ['$scope', '$translate',
            function ($scope, $translate) {
              $scope.changeLanguage = function (langKey) {
                  $translate.use(langKey);
              };
            }],
            templateUrl: 'templates/directives/flagslanguage/flagslanguage.html'
        };
    });
