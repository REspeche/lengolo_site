angular.module('mainApp').controller('membersFormController', ['$scope', 'mainSvc', '$rootScope', 'actionSvc', '$stateParams',
    function ($scope, mainSvc, $rootScope, actionSvc, $stateParams) {

      $scope.loadForm = false;
      $scope.formData = {
        id: 0,
        type: 1,
        firstName: '',
        lastName: '',
        company: '',
        email: '',
        couId: 1,
        staId: 6,
        city: 'Cordoba',
        address: '',
        zip: '',
        phone: '',
        costShipping: '',
        timeS: 0,
        timeE: 0,
        webSite: '',
        avatar: undefined,
        codeMenu: '',
        password: 'lengolo123$',
        status: 2
      };
      $scope.avatarNew = undefined;
      $scope.editForm = false;
      $scope.invalidForm = false;
      $scope.lstRoles = [
        {
          id: 1,
          label: 'Normal'
        },
        {
          id: 2,
          label: 'Administrator'
        }
      ];
      $scope.lstCountry = [];
      $scope.lstState = [];

      $scope.loadMembersForm = function() {
        $scope.paramAction = $stateParams.action;
        $scope.paramId = $stateParams.id;

        /* Load combos */
        mainSvc.callService({
            url: 'common/getListCountries',
            secured: false
        }).then(function (response) {
          $scope.lstCountry = angular.copy(response);
          if ($scope.formData.couId>0) $scope.selectCountry(false);
        });

        /* Load Data */
        if ($scope.paramAction=="edit" && $scope.paramId) {
          mainSvc.callService({
              url: 'profile/getMember',
              params: {
                'usrId': $rootScope.userInfo.id,
                'memId': $scope.paramId
              }
          }).then(function (response) {
            $scope.formData = response[0];
            $scope.selectCountry(false);
            $scope.loadForm = true;
          });
        }
        else {
          $scope.loadForm = true;
        }
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

      $scope.submitForm = function() {
        if (!$scope.frmMembers.$invalid) {
          $('#frmMembers').removeClass('was-validated');
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
          if ($scope.paramAction=='new') {
            if ($scope.formData.password=='') {
              mainSvc.showAlertByCode(100);
              return false;
            }
          }
          else {
            if ($scope.formData.codeMenu=='') {
              mainSvc.showAlertByCode(111);
              return false;
            }
          }
          if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.formData.email)) {
            mainSvc.showAlertByCode(204);
            return false;
          }
          //Ajax send
          var filesUpload = [];
          if ($scope.avatarNew) filesUpload.push($scope.avatarNew);
          //Ajax send
          mainSvc.callService({
              url: 'profile/updateMember',
              params: {
                memId: $scope.formData.id,
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
                avatar: $scope.formData.avatar,
                codeMenu: $scope.formData.codeMenu,
                password: $scope.formData.password,
                status: $scope.formData.status,
                type: $scope.formData.type
              },
              data: {
                files: filesUpload
              }
          }).then(function (response) {
            $scope.editForm = false;
            mainSvc.showAlertByCode(3);
            actionSvc.goToAction(16); //members
          });
        }
        else {
          $('#frmMembers').addClass('was-validated');
          $scope.invalidForm = true;
          mainSvc.showAlertByCode(103);
        }
      }

      $scope.clickCancelForm = function() {
        if ($scope.editForm) {
          modalSvc.showModal({
            size: 'sm'
          },{
            closeButtonText: $translate.instant('BTN_NO'),
            actionButtonText: $translate.instant('BTN_YES'),
            bodyText: $translate.instant('MSG_CANCEL_ACTION')
          }).then(function (result) {
            actionSvc.goToAction(16); //list members
          });
        }
        else {
          actionSvc.goToAction(16); //list members
        }
      }

    }]);
