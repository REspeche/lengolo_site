angular.module('mainApp').controller('redirectExternalController', ['CONSTANTS', '$scope', '$window', '$stateParams', '$location', '$translate',
    function (CONSTANTS, $scope, $window, $stateParams, $location, $translate) {
      $translate.onReady(function() {
        $scope.labelPage = $translate.instant('LOADING_PAGE');
      });

      $scope.loadRedirectExternal = function() {
        var localhost = ($location.absUrl().indexOf('localhost')>-1)?true:false;
        var page = '/'+$stateParams.page;
        if (page) $window.open(page, '_self');
        else $scope.labelPage = 'Error al redireccionar. Presione <a href="'+page+'">aqui</a> para continuar.'
      }
    }]);
