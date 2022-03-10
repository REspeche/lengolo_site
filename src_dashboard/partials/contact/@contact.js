angular.module('mainApp').controller('contactController', ['$scope', 'actionSvc', 'mainSvc', '$rootScope',
    function ($scope, actionSvc, mainSvc, $rootScope) {
      $scope.loadForm = false;
      $scope.formData = {
        subject: getQueryIntValue('tquId',4),
        phone: '',
        comment: ''
      };
      $scope.lstTypeQuery = [];
      $scope.editForm = false;

      $scope.loadContact = function() {
        /* Load combos */
        mainSvc.callService({
            url: 'common/getListTypeQuery'
        }).then(function (response) {
          $scope.lstTypeQuery = angular.copy(response);
          /* Load Data */
          mainSvc.callService({
              url: 'profile/getProfile'
          }).then(function (response) {
            $scope.formData.phone = response[0].phone;
            $scope.loadForm = true;
          });
        });
      }

      $scope.submitForm = function() {
        if (!$scope.frmContact.$invalid) {
          $('#frmContact').removeClass('was-validated');
          //Validations
          if ($scope.formData.comment=='') {
              mainSvc.showAlertByCode(103);
              return false;
          }
          //Ajax send
          mainSvc.callService({
              url: 'common/insertQuery',
              params: Object.assign({}, {
                'usrId': $rootScope.userInfo.id
              }, $scope.formData)
          }).then(function (response) {
            $scope.formData = {
              subject: 4,
              phone: '',
              comment: ''
            };
            mainSvc.showAlertByCode(1);
          });
        }
        else {
          $('#frmMyCargo').addClass('was-validated');
          $scope.invalidForm = true;
          mainSvc.showAlertByCode(103);
        }
      }

      $scope.isEditingForm = function () {
          if (!$scope.editForm) $scope.editForm = true;
      }
    }]);
