angular.module('mainApp').controller('profileController', ['$scope', 'mainSvc', '$rootScope', 'authenticationSvc',
    function ($scope, mainSvc, $rootScope, authenticationSvc) {

      $scope.loadForm = false;
      $scope.formData = {
        firstName: '',
        lastName: '',
        company: '',
        email: '',
        couId: 0,
        staId: 0,
        city: '',
        address: '',
        zip: '',
        phone: '',
        webSite: '',
        avatar: undefined
      };
      $scope.avatarNew = undefined;
      $scope.lstCountry = [];
      $scope.lstState = [];
      $scope.lstCity = [];
      $scope.editForm = false;
      $scope.invalidForm = false;

      $scope.loadProfile = function() {

        /* Load combos */
        mainSvc.callService({
            url: 'common/getListCountries',
            secured: false
        }).then(function (response) {
          $scope.lstCountry = angular.copy(response);
        });

        /* Load Data */
        mainSvc.callService({
            url: 'profile/getProfile'
        }).then(function (response) {
          $scope.formData = response[0];
          $scope.loadForm = true;
          $scope.selectCountry(false);
        });
      }

      $scope.selectCountry = function (clickEvent) {
        if ($scope.formData.couId) {
          mainSvc.callService({
              url: 'common/getListStates',
              params: {
                couId: $scope.formData.couId
              }
          }).then(function (response) {
            $scope.lstState = angular.copy(response);
            if (clickEvent) $scope.isEditingForm();
          });
        }
      }

      $scope.isEditingForm = function () {
          if (!$scope.editForm) $scope.editForm = true;
      }

      $scope.selectStates = function() {
          $scope.editForm = true;
          $scope.formData.city = '';
      }

      $scope.submitForm = function() {
        if (!$scope.frmProfile.$invalid) {
          $('#frmProfile').removeClass('was-validated');
          //Validations
          if ($scope.formData.firstName=='' ||
              $scope.formData.lastName=='' ||
              $scope.formData.couId==0 ||
              $scope.formData.staId==0 ||
              $scope.formData.city=='' ||
              $scope.formData.address=='' ||
              $scope.formData.zip=='' ||
              $scope.formData.phone=='') {
            mainSvc.showAlertByCode(103);
            return false;
          }
          if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.formData.email)) {
            mainSvc.showAlertByCode(204);
            return false;
          }
          //Ajax send
          var filesUpload = [];
          if ($scope.avatarNew) filesUpload.push($scope.avatarNew);
          mainSvc.callService({
              url: 'profile/updateProfile',
              params: {
                firstName: $scope.formData.firstName,
                lastName: $scope.formData.lastName,
                company: $scope.formData.company,
                email: $scope.formData.email,
                couId: $scope.formData.couId,
                staId: $scope.formData.staId,
                city: $scope.formData.city,
                address: $scope.formData.address,
                zip: $scope.formData.zip,
                phone: $scope.formData.phone,
                webSite: $scope.formData.webSite,
                avatar: $scope.formData.avatar
              },
              data: {
                files: filesUpload
              }
          }).then(function (response) {
            var profileRefresh = false;
            var _response = angular.copy(response);
            if ($rootScope.userInfo.name!=_response.name) {
              $rootScope.userInfo.name = _response.name;
              profileRefresh = true;
            }
            if ($rootScope.userInfo.avatar!=_response.avatar) {
              $rootScope.userInfo.avatar = _response.avatar;
              profileRefresh = true;
            }
            if (profileRefresh) authenticationSvc.updateUserInfo($rootScope.userInfo);
            $rootScope.userInfo.forceProfile = false;
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

    }]);
