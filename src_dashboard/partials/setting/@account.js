angular.module('mainApp').controller('accountController', ['$scope', 'mainSvc', '$rootScope', 'actionSvc',
    function ($scope, mainSvc, $rootScope, actionSvc) {

      $scope.loadForm = false;
      $scope.formData = {
        email: '',
        pass: '',
        passN: '',
        passR: ''
      };
      $scope.editForm = false;
      $scope.invalidForm = false;

      $scope.loadProfile = function() {
        /* Load Data */
        mainSvc.callService({
            url: 'auth/getAccount'
        }).then(function (response) {
          $scope.formData = response[0];
          $scope.loadForm = true;
        });
      }

      $scope.isEditingForm = function () {
          if (!$scope.editForm) $scope.editForm = true;
      }

      $scope.submitForm = function() {
        if (!$scope.frmAccount.$invalid) {
          $('#frmAccount').removeClass('was-validated');
          //Validations
          if ($scope.formData.pass=='' || $scope.formData.passN=='' || $scope.formData.passR=='' || $scope.formData.email=='') {
            mainSvc.showAlertByCode(103);
            return false;
          }
          if ($scope.formData.passN!=$scope.formData.passR) {
            mainSvc.showAlertByCode(201);
            return false;
          }
          if ($scope.formData.pass==$scope.formData.passN) {
            mainSvc.showAlertByCode(205);
            return false;
          }
          //Ajax send
          mainSvc.callService({
              url: 'auth/updateAccount',
              params: Object.assign({}, {
                'usrId': $rootScope.userInfo.id
              }, $scope.formData)
          }).then(function (response) {
            if (response.id>0) {
              $scope.formData.pass = '';
              $scope.formData.passN = '';
              $scope.formData.passR = '';
              $scope.editForm = false;
              mainSvc.showAlertByCode(2);
            }
          });
        }
        else {
          $('#frmAccount').addClass('was-validated');
          $scope.invalidForm = true;
          mainSvc.showAlertByCode(103);
        }
      }

    }]);
