angular.module('mainApp').controller('generalController', ['$scope', 'mainSvc', '$rootScope', 'authenticationSvc', 'modalSvc',
    function ($scope, mainSvc, $rootScope, authenticationSvc, modalSvc) {

      $scope.loadForm = false;
      $scope.formData = {
        canDelivery: false,
        costShipping: 50,
        timeS: 0,
        timeE: 1439,
        multipleQR: 0,
        covid19: 1,
        covid19_check: 0
      };
      $scope.avatarNew = undefined;
      $scope.lstCountry = [];
      $scope.lstState = [];
      $scope.lstCity = [];
      $scope.editForm = false;
      $scope.invalidForm = false;

      $scope.loadProfile = function() {
        /* Load Data */
        mainSvc.callService({
            url: 'profile/getGeneral'
        }).then(function (response) {
          $scope.formData = response[0];
          $scope.formData.canDelivery = ($scope.formData.canDelivery==1)?true:false;
          $scope.formData.multipleQR = ($scope.formData.multipleQR==1)?true:false;
          $scope.formData.covid19_check = ($scope.formData.covid19==3)?true:false;
          $scope.loadForm = true;
          initRangeTime($scope.formData.timeS, $scope.formData.timeE, 'profileController');
        });
      }

      $scope.isEditingForm = function () {
          if (!$scope.editForm) $scope.editForm = true;
      }

      $scope.submitForm = function() {
        if (!$scope.frmProfile.$invalid) {
          $('#frmProfile').removeClass('was-validated');
          //Ajax send
          var filesUpload = [];
          if ($scope.avatarNew) filesUpload.push($scope.avatarNew);
          mainSvc.callService({
              url: 'profile/updateGeneral',
              params: {
                costShipping: $scope.formData.costShipping,
                timeS_delivery: $scope.formData.timeS,
                timeE_delivery: $scope.formData.timeE,
                canDelivery: ($scope.formData.canDelivery)?1:0,
                multipleQR: ($scope.formData.multipleQR)?1:0,
                covid19: $scope.formData.covid19
              },
              data: {
                files: filesUpload
              }
          }).then(function (response) {
            var profileRefresh = false;
            var _response = angular.copy(response);
            if ($rootScope.userInfo.canDelivery!=_response.canDelivery) {
              $rootScope.userInfo.canDelivery = _response.canDelivery;
              profileRefresh = true;
            }
            if ($rootScope.userInfo.multipleQR!=_response.multipleQR) {
              $rootScope.userInfo.multipleQR = _response.multipleQR;
              profileRefresh = true;
            }
            if ($rootScope.userInfo.covid19!=_response.covid19) {
              $rootScope.userInfo.covid19 = _response.covid19;
              profileRefresh = true;
            }
            if (profileRefresh) authenticationSvc.updateUserInfo($rootScope.userInfo);
            $scope.editForm = false;
            mainSvc.showAlertByCode(3);
          });
        }
        else {
          $('#frmProfile').addClass('was-validated');
          $scope.invalidForm = true;
          mainSvc.showAlertByCode(103);
        }
      }

      $scope.changeCovid19 = function() {
        $scope.formData.covid19 = ($scope.formData.covid19_check)?3:2;
        $scope.isEditingForm();
      };

      $scope.applyCovid19 = function(item) {
        modalSvc.showModal({
            templateUrl: '/templates/modals/modalApplyCovid19.html',
            size: 'lg'
          },
          {
              closeButtonText: undefined,
              formData: $scope.formData,
              defer: false
          });
      }

    }]);
